#!/usr/bin/env python3
"""Extract the Source View Bible word-level metadata into portable, engine-agnostic datasets.

The unique intellectual property of the Source View Bible is its word-level tagging:
every span of scripture is attributed to a speaker (source), an audience (recipient),
and is tagged with the "spheres of society" it touches, while every speaker/recipient
(an "actant") carries gender, nature, profession (vocation) and chronology metadata.

Most of that data is NOT lost. It survives in two complementary forms in this repo:

  1. Datasets/en/NLT/SourceView.sqlite3  -- the relational metadata (link tables,
     keyed by Emdros monad ranges).
  2. Kraken/db/seeds/*.json + Kraken/app/*.json -- the human-readable source seeds
     (names, references, sphere word counts, label tables) that were used to build it.

The only piece that lives exclusively inside the encrypted Emdros corpus
(Datasets/en/NLT/SourceView.bpt) is the literal *surface text* of each word and the
per-word boolean sphere flags. See DATA_RECOVERY.md for how to decrypt that with the
key committed in Libraries/Emdros.

This script joins the surviving relational + seed data and emits:

  build/metadata/actants.json        -- catalogue of every speaker/recipient with
                                        resolved labels (gender, natures, professions,
                                        chronologies).
  build/metadata/spans.json          -- every attributed span (BSO): reference, book,
                                        speaker, audience, role, word count and the
                                        per-span sphere breakdown.
  build/metadata/spans.csv           -- flat CSV of the spans for spreadsheets / BI.
  build/metadata/lookups.json        -- the label lookup tables (gender, natures,
                                        professions, chronologies, spheres, roles).
  build/metadata/summary.json        -- headline counts for a quick integrity check.

It uses only the Python standard library (sqlite3 + json + csv).
"""

import csv
import json
import os
import sqlite3
import sys

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SQLITE_PATH = os.path.join(REPO_ROOT, "Datasets", "en", "NLT", "SourceView.sqlite3")
SEEDS_DIR = os.path.join(REPO_ROOT, "Kraken", "db", "seeds")
APP_DIR = os.path.join(REPO_ROOT, "Kraken", "app")
OUT_DIR = os.path.join(REPO_ROOT, "build", "metadata")

# gender_id mapping is derived from the app filter UI
# (App/js/Scenes/DiscoveryCenter/Filters/GenderFilter.js): 2 => Male, 1 => Female.
# id 3 is used for groups / deity / unspecified in the data.
GENDER = {1: "Female", 2: "Male", 3: "Other/Unspecified"}

# bso_actants.type_id mapping is derived from Kraken/db/seeds/bso_actants.rb:
# source => 1 (the speaker), recipient => 2 (the audience).
ACTANT_ROLE = {1: "speaker", 2: "audience"}

# Sphere ids 1..7 are assigned in Kraken/db/seeds/spheres.rb in this fixed order.
SPHERE_ORDER = [
    "family",
    "economics",
    "government",
    "religion",
    "education",
    "communication",
    "celebration",
]


def load_json(path):
    with open(path, "r", encoding="utf-8") as handle:
        return json.load(handle)


def load_lenient_json(path):
    """Some seed files contain trailing commas (they were authored as JS). Strip them."""
    with open(path, "r", encoding="utf-8") as handle:
        raw = handle.read()
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        import re

        cleaned = re.sub(r",(\s*[}\]])", r"\1", raw)
        return json.loads(cleaned)


def build_lookups():
    natures = load_json(os.path.join(SEEDS_DIR, "natures.json"))
    professions = load_json(os.path.join(SEEDS_DIR, "professions.json"))
    chronologies = load_json(os.path.join(SEEDS_DIR, "chronologies.json"))
    spheres_meta = load_lenient_json(os.path.join(APP_DIR, "spheres.json"))

    # spheres.json in the app carries id ("family"...) + display name; map to numeric ids.
    sphere_by_key = {s["id"]: s for s in spheres_meta}
    spheres = {}
    for index, key in enumerate(SPHERE_ORDER, start=1):
        display = sphere_by_key.get(key, {}).get("name", key.title())
        spheres[index] = {"id": index, "key": key, "name": display}

    return {
        "gender": GENDER,
        "actant_role": ACTANT_ROLE,
        "natures": {n["id"]: n["key"] for n in natures},
        "professions": {p["id"]: p["key"] for p in professions},
        "chronologies": {c["id"]: c for c in chronologies},
        "spheres": spheres,
    }


def build_actants(lookups):
    actants = load_json(os.path.join(SEEDS_DIR, "actants.json"))
    result = {}
    for actant in actants:
        aid = actant["id"]
        result[aid] = {
            "id": aid,
            "name": actant.get("name"),
            "gender": lookups["gender"].get(actant.get("gender_id"), "Unknown"),
            "gender_id": actant.get("gender_id"),
            "actant_number": actant.get("actantNumber"),
            "is_speaker": bool(actant.get("isSource")),
            "is_audience": bool(actant.get("isRecipient")),
            "natures": [
                lookups["natures"].get(n["id"], str(n["id"]))
                for n in actant.get("natures", [])
            ],
            "professions": [
                lookups["professions"].get(p["id"], str(p["id"]))
                for p in actant.get("professions", [])
            ],
            "chronologies": [
                lookups["chronologies"].get(c["id"], {}).get("key", str(c["id"]))
                for c in actant.get("chronologies", [])
            ],
        }
    return result


def load_books():
    books = load_lenient_json(os.path.join(APP_DIR, "books.json"))
    # book_id in the relational data is (index in books.json) + 1, per Kraken/db/seeds/bso.rb
    return {index + 1: book for index, book in enumerate(books)}


def build_spans(conn, actants, books, lookups):
    bso_rows = load_json(os.path.join(SEEDS_DIR, "bso.json"))

    # Link tables from the relational database.
    span_actants = {}
    for bso_id, actant_id, type_id in conn.execute(
        "SELECT bso_id, actant_id, type_id FROM bso_actants"
    ):
        span_actants.setdefault(bso_id, {"speaker": [], "audience": []})
        role = ACTANT_ROLE.get(type_id)
        if role == "speaker":
            span_actants[bso_id]["speaker"].append(actant_id)
        elif role == "audience":
            span_actants[bso_id]["audience"].append(actant_id)

    span_spheres = {}
    for bso_id, sphere_id, word_count in conn.execute(
        "SELECT bso_id, sphere_id, word_count FROM spheres"
    ):
        sphere = lookups["spheres"].get(sphere_id, {"key": str(sphere_id)})
        span_spheres.setdefault(bso_id, []).append(
            {"sphere": sphere["key"], "word_count": word_count}
        )

    def resolve_names(ids):
        names = []
        for aid in ids:
            actant = actants.get(aid)
            names.append(actant["name"] if actant else f"actant:{aid}")
        return names

    spans = []
    for row in bso_rows:
        bso_id = row["id"]
        book = books.get(row.get("book_id"), {})
        links = span_actants.get(bso_id, {"speaker": [], "audience": []})
        spans.append(
            {
                "id": bso_id,
                "book": book.get("name"),
                "book_ref": book.get("DJHRef"),
                "reference": row.get("reference"),
                "first_monad": row.get("first"),
                "last_monad": row.get("last"),
                "word_count": row.get("word_count"),
                "role_id": row.get("role_id"),
                "occurrence": row.get("occurrence_id"),
                "speaker": row.get("name"),
                "speaker_actant_ids": links["speaker"],
                "audience": resolve_names(links["audience"]),
                "audience_actant_ids": links["audience"],
                "spheres": span_spheres.get(bso_id, []),
            }
        )
    spans.sort(key=lambda s: (s["first_monad"] or 0))
    return spans


def write_csv(spans, path):
    with open(path, "w", newline="", encoding="utf-8") as handle:
        writer = csv.writer(handle)
        writer.writerow(
            [
                "id",
                "book",
                "reference",
                "first_monad",
                "last_monad",
                "word_count",
                "speaker",
                "audience",
                "spheres",
            ]
        )
        for span in spans:
            writer.writerow(
                [
                    span["id"],
                    span["book"],
                    span["reference"],
                    span["first_monad"],
                    span["last_monad"],
                    span["word_count"],
                    span["speaker"],
                    "; ".join(span["audience"]),
                    "; ".join(
                        f"{s['sphere']}:{s['word_count']}" for s in span["spheres"]
                    ),
                ]
            )


def main():
    if not os.path.exists(SQLITE_PATH):
        sys.exit(f"Could not find {SQLITE_PATH}. Run from a full checkout of the repo.")

    os.makedirs(OUT_DIR, exist_ok=True)
    conn = sqlite3.connect(SQLITE_PATH)

    lookups = build_lookups()
    actants = build_actants(lookups)
    books = load_books()
    spans = build_spans(conn, actants, books, lookups)

    # Serialize numeric-keyed lookup maps as {str: value} for JSON portability.
    serializable_lookups = {
        "gender": {str(k): v for k, v in lookups["gender"].items()},
        "actant_role": {str(k): v for k, v in lookups["actant_role"].items()},
        "natures": {str(k): v for k, v in lookups["natures"].items()},
        "professions": {str(k): v for k, v in lookups["professions"].items()},
        "chronologies": {str(k): v for k, v in lookups["chronologies"].items()},
        "spheres": {str(k): v for k, v in lookups["spheres"].items()},
    }

    with open(os.path.join(OUT_DIR, "lookups.json"), "w", encoding="utf-8") as handle:
        json.dump(serializable_lookups, handle, indent=2, ensure_ascii=False)

    with open(os.path.join(OUT_DIR, "actants.json"), "w", encoding="utf-8") as handle:
        json.dump(list(actants.values()), handle, indent=2, ensure_ascii=False)

    with open(os.path.join(OUT_DIR, "spans.json"), "w", encoding="utf-8") as handle:
        json.dump(spans, handle, indent=2, ensure_ascii=False)

    write_csv(spans, os.path.join(OUT_DIR, "spans.csv"))

    summary = {
        "actants": len(actants),
        "spans": len(spans),
        "spans_with_audience": sum(1 for s in spans if s["audience"]),
        "spans_with_spheres": sum(1 for s in spans if s["spheres"]),
        "professions": len(lookups["professions"]),
        "natures": len(lookups["natures"]),
        "chronologies": len(lookups["chronologies"]),
        "spheres": len(lookups["spheres"]),
        "books_referenced": len({s["book"] for s in spans if s["book"]}),
        "note": (
            "Word surface text and per-word sphere flags live only in the encrypted "
            "SourceView.bpt Emdros corpus; see DATA_RECOVERY.md to extract them."
        ),
    }
    with open(os.path.join(OUT_DIR, "summary.json"), "w", encoding="utf-8") as handle:
        json.dump(summary, handle, indent=2, ensure_ascii=False)

    conn.close()

    print("Wrote portable metadata to", OUT_DIR)
    for key, value in summary.items():
        if key != "note":
            print(f"  {key}: {value}")


if __name__ == "__main__":
    main()
