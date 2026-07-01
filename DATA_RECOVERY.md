# Source View Bible — Word-Level Metadata: What Survives and How to Recover It

This document is the result of a full audit of this repository, undertaken to answer
one question: **the app's unique IP was its word-level metadata tagging — is any of it
still here, and how do we get it back out into a reusable form?**

Short answer: **the great majority of the metadata is recoverable from files that are
still in this repo.** The only thing you truly need the original tooling for is the
literal per-word *surface text* and the per-word *sphere flags*, and even those are
present inside the shipped Emdros corpus, which can be opened with the decryption key
that is also committed here.

---

## 1. What the metadata actually is

Every span of scripture in the Source View Bible was tagged with:

| Concept | Meaning | Where it lives |
| --- | --- | --- |
| **Source / Speaker** | Who is speaking (or narrating) this span | `bso` + `bso_actants` (type 1), `Source` objects in the corpus |
| **Recipient / Audience** | Who they are speaking *to* | `bso_actants` (type 2) |
| **Gender** | Male / Female / Other of the actant | `actants.gender_id` |
| **Nature** | Angelic / Demonic / Divine / Human / Other | `natures` |
| **Profession / Vocation** | 52 vocations (Shepherd, King, Fisherman, …) | `professions` |
| **Chronology** | Which century the actant belongs to | `chronologies` |
| **Sphere of society** | Family, Economics, Government, Religion, Education, Communication, Celebration | `spheres` table (span level) + boolean features on every `Token` (word level) |
| **Surface text** | The actual English word | `Token.surface` inside the encrypted corpus only |

An **actant** is any person/entity that speaks or is spoken to. A **BSO**
("Book‑Source‑Occurrence") is a contiguous span of words attributed to one speaker.
Spans and words are addressed by **monads** — Emdros's integer word ids (word #1, #2, …
through the whole Bible).

---

## 2. The three shipped data artifacts (`Datasets/en/NLT/`)

| File | Size | Format | Contents | Recoverable? |
| --- | --- | --- | --- | --- |
| `SourceView.sqlite3` | 2.4 MB | plain SQLite | The relational metadata: actants, spans (bso), speaker/audience links, spheres, professions, natures, chronologies | ✅ **Fully readable right now** |
| `SourceView.bpt` | 23 MB | **encrypted** Emdros Bit‑Packed Table | The full annotated NLT corpus: every word's surface text, verse/chapter/book structure, `Source` spans, and per‑word sphere flags | ✅ Readable with the committed key (§5) |
| `SourceView.realm` | 3.2 MB | Realm DB | Pre‑computed aggregates/statistics for the app's discovery UI (word clouds, counts) — *derived*, not a source of truth | ✅ Readable; regenerable |

### The relational schema (`SourceView.sqlite3`)

```
actants(id, actant_number_id, gender_id)                      -- 1,282 rows
bso(id, first, last, book_id, source_id, occurrence_id,       -- 6,485 spans
    role_id, word_count)
bso_actants(id, actant_id, type_id, bso_id)                   -- 13,486 links
professions(actant_id, profession_id)                         --   533
chronologies(actant_id, chronology_id)                        -- 1,371
natures(actant_id, nature_id)                                 -- 1,144
spheres(bso_id, sphere_id, word_count)                        -- 23,952
```

`bso.first` / `bso.last` are the monad range of the span, tying the relational metadata
back to the words in the corpus.

---

## 3. The original master dataset and the build pipeline

`Kraken/` is the **data pipeline** that produced everything above. Reading it tells us
exactly where the data came from and how it was transformed:

- `Kraken/kraken.rb` connects to the original master corpus:
  ```ruby
  EMDROS = Sequel.connect('sqlite://../../SVB2/sphereview.sqlite3')
  ```
  **`SVB2/sphereview.sqlite3` is the "lost" original** — a full Emdros database
  (SQLite backend) where every word carried MdF features: `mdf_actant_id`,
  `mdf_gender`, `mdf_natures`, `mdf_professions`, `mdf_chronology`, `mdf_source_name`,
  `mdf_source_occurrence`, `mdf_source_color`, real names, verse/book objects, and
  source/recipient actant objects. It lived *outside* this repo, which is why it was
  lost.

- `Kraken/db/seeds/*.rb` query that master corpus and emit the relational SQLite plus
  JSON seeds.
- `Kraken/sqlite-to-bpt.sh` runs Emdros's `bptdump` to encrypt the master corpus into
  the shipped `SourceView.bpt`.

**Even though `SVB2/sphereview.sqlite3` is gone, its outputs survive** — both as the
relational SQLite and as JSON seeds, and (for the word text) as the encrypted BPT.

### The surviving JSON seeds (`Kraken/db/seeds/` and `Kraken/app/`)

| File | What it gives you |
| --- | --- |
| `db/seeds/actants.json` (485 KB) | Every actant with **name**, gender, natures, professions, chronologies, isSource/isRecipient |
| `db/seeds/bso.json` (1.4 MB) | Every span with resolved **speaker name** and human **reference** (e.g. `1:14-15`) |
| `db/seeds/bso_word_counts.json` (1.8 MB) | Per‑span sphere word counts |
| `db/seeds/book_words.json` (8 MB) | Per‑actant word occurrences with monads + chapter/verse |
| `db/seeds/professions.json` | The 52 vocation labels (id → key) |
| `db/seeds/natures.json` | The 5 nature labels |
| `db/seeds/chronologies.json` | The 18 chronology bands with year ranges |
| `db/seeds/sphere-key-passages.json` (153 KB) | Curated key passages per sphere |
| `app/spheres.json` | The 7 spheres with display names + rich editorial overviews |
| `app/books.json` (13 KB) | 66 books with names, testament, and editorial intros |

The label tables (professions, natures, chronologies, spheres, gender) are the
"decoder rings" that turn the numeric ids in the SQLite into meaning. **They are all
present.**

---

## 4. What is NOT yet a standalone dataset (the gap)

Nothing here was ever exported as a clean, engine‑agnostic dataset. Specifically:

1. **The relational metadata was never joined/denormalized.** It is split across a
   SQLite file and a dozen JSON/Ruby seeds, addressed by numeric ids and monads. There
   was no single "here is every span with its speaker, audience, vocation and spheres"
   export.
2. **The word‑level surface text + per‑word sphere flags are locked in the encrypted
   `SourceView.bpt`.** They are not present in any JSON. (`book_words.json` has word
   *positions* but not the word *text*.)
3. **No documented, runnable extraction exists** — the pipeline only ran *into* the
   app, never *out* of it.

This repo now closes gaps (1) and (3); see below. Gap (2) is closed by §5.

---

## 5. Recovering the word text + per-word sphere flags from the encrypted corpus

The corpus is encrypted, but **the key is committed in this repository** in two places:

- Runtime key (what the app uses to open the shipped `SourceView.bpt`):
  `Libraries/Emdros/ios/RCTEmdros/RCTEmdros/RCTEmdros.m` and
  `Libraries/Emdros/android/.../EmdrosModule.java` define `RCTKeyCString`, which decodes
  from ASCII bytes to:

  ```
  3fab2edcd8663c6baa91ffeb928ec61e011b19ed866d7365e7d194e43dc47264
  ```

  (A second `PreferencesKey` is defined the same way for the preferences DB.)

- A build‑time key also appears in `Kraken/sqlite-to-bpt.sh`
  (`0x67d3d67d 0x22798509 …`). If the runtime key above does not open the shipped file,
  try this one — the shipped artifact must have been produced with whichever key the app
  successfully uses at runtime, so the runtime key is the one to try first.

### Object model inside the BPT (confirmed from the app's MQL + stylesheet)

```
Book (DJHRef)
  Chapter (chapter)
    Verse (chapter, verse_start)
      Source (source_name, source_occurrence, source_color)   -- the speaker span
        Token (surface, surface_fts, + boolean sphere features:
               Family, Economics, Government, Religion,
               Education, MediaCom, Celebration)              -- one per word
```

So each **word** (`Token`) already carries its own sphere flags — this is the literal
word‑level tagging.

### How to read it

Emdros is open source. Build the `emdros-3.4.1` toolchain (or newer) — the amalgamated
sources are even vendored here at `Libraries/Emdros/src/emdros_amalgamation.cpp`. Then:

```sh
# Dump the whole corpus back to a readable Emdros MQL/MdF export:
bptdump --key "3fab2edcd8663c6baa91ffeb928ec61e011b19ed866d7365e7d194e43dc47264" \
        SourceView.bpt SourceView.decrypted.sqlite3

# Or query it directly with mql, e.g. every word tagged with the Family sphere:
mql -b sqlite3 --key "<key>" SourceView.decrypted.sqlite3 <<'EOF'
SELECT ALL OBJECTS
WHERE [Token Family = true GET surface]
GO
EOF
```

Once decrypted to a SQLite backend you can read the `Token` rows directly with the
standard `sqlite3` CLI and export `surface` + sphere columns keyed by monad. Joining
those monads to the `bso.first/last` ranges in `SourceView.sqlite3` reunites the word
text with the speaker/audience/vocation metadata.

---

## 6. What this branch adds: a runnable, dependency-free extractor

`tools/extract_metadata.py` (Python standard library only) joins the surviving
relational SQLite with the JSON seeds and the label tables, then writes portable,
engine‑agnostic datasets to `build/metadata/`:

| Output | Contents |
| --- | --- |
| `actants.json` | Every speaker/recipient with **resolved** gender, natures, professions, chronologies |
| `spans.json` | Every attributed span: book, reference, monad range, speaker, audience (resolved names), role, word count, and per‑span sphere breakdown |
| `spans.csv` | Flat version of the spans for spreadsheets / BI tools |
| `lookups.json` | All label tables (gender, natures, professions, chronologies, spheres, roles) |
| `summary.json` | Headline counts for an integrity check |

Run it from a full checkout:

```sh
python3 tools/extract_metadata.py
```

Verified output on the committed data:

```
actants: 1257
spans: 6485
spans_with_audience: 5911
spans_with_spheres: 6440
professions: 52
natures: 5
chronologies: 18
spheres: 7
books_referenced: 66      # the whole Bible
```

Example span it produces:

```json
{
  "book": "Genesis",
  "reference": "2:23",
  "first_monad": 2914,
  "last_monad": 2922,
  "speaker": "Adam",
  "audience": ["God"],
  "spheres": [
    {"sphere": "family", "word_count": 2},
    {"sphere": "economics", "word_count": 2},
    {"sphere": "celebration", "word_count": 2}
  ]
}
```

> `build/metadata/` is a generated artifact and is git‑ignored. Run the extractor to
> (re)produce it.

---

## 7. Recommended path to a reusable dataset for future apps

1. **Now (no tooling):** run `tools/extract_metadata.py` to get the full
   speaker/audience/vocation/sphere metadata as JSON + CSV. This alone is the bulk of
   the IP.
2. **Recover the words:** build Emdros, decrypt `SourceView.bpt` with the committed key
   (§5), export `Token.surface` + sphere flags keyed by monad.
3. **Reunite:** join the decrypted word/monad table to `spans.json` on the monad ranges
   to produce a single word‑level dataset: *for every word — its text, verse, speaker,
   audience, speaker's gender/vocation/nature/chronology, and spheres.*
4. **Publish** that unified table (e.g. Parquet/JSONL) as the canonical, engine‑neutral
   Source View dataset for any future app, independent of Emdros/Realm.

The one caveat: the derived numbers (word clouds, statistics in `SourceView.realm`) can
always be recomputed from the above, so they do not need to be preserved separately.
