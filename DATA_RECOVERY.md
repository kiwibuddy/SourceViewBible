# Source View Bible — Data Recovery & Rebuild Specification

This document is a complete, self-contained specification for recovering and rebuilding
the Source View Bible's word-level metadata — the unique IP of the app: every span of
scripture attributed to a **speaker** and an **audience**, every speaker/recipient
carrying **gender / nature / vocation / chronology**, and every **word** tagged with the
**spheres of society** it touches.

**Bottom line up front:** the metadata is *not* lost. It survives in this repository in
three complementary forms, and this document specifies exactly where each field lives,
what every id means, and the precise steps (with commands, keys, schemas and SQL) to
rebuild a single unified, engine-neutral dataset.

Contents:

1. [Concept model & glossary](#1-concept-model--glossary)
2. [Inventory of surviving data](#2-inventory-of-surviving-data)
3. [Full relational schema (field-by-field)](#3-full-relational-schema-field-by-field)
4. [Complete lookup / decoder tables](#4-complete-lookup--decoder-tables)
5. [The Emdros corpus: encryption keys & how to decrypt it](#5-the-emdros-corpus-encryption-keys--how-to-decrypt-it)
6. [Step-by-step rebuild procedure](#6-step-by-step-rebuild-procedure)
7. [The included extractor (`tools/extract_metadata.py`)](#7-the-included-extractor)
8. [What is genuinely lost, and what that costs you](#8-what-is-genuinely-lost)

---

## 1. Concept model & glossary

| Term | Meaning |
| --- | --- |
| **Monad** | Emdros's integer id for a single word position. The whole NLT text is monads `1 … ~1.79M`, in reading order. Every piece of metadata is ultimately anchored to a monad or a monad range. |
| **Actant** | Any person/entity that speaks or is spoken to (e.g. *God*, *Adam*, *A Blind Beggar*). Carries gender, nature(s), profession(s), chronology(ies). |
| **BSO** (Book‑Source‑Occurrence) | One contiguous span of words `[first … last]` attributed to one speaker, the *n*-th time that speaker appears in that book. This is the atomic unit of speaker/audience/sphere tagging. |
| **Source / role** | The speaker of a BSO, plus a *role* (narrator / god / lead / support) that drove colour-coding. |
| **Recipient** | The audience an actant is speaking to within a BSO. |
| **Sphere** | One of seven "spheres of society" (Family, Economics, Government, Religion, Education, Communication, Celebration). Tagged both per-span (word counts) and per-word (boolean flags on each token). |

The word-level tagging is the combination of: *which BSO a word falls in* (→ speaker,
audience, role) + *the sphere flags on that word's token* + *the speaker's actant
attributes* (gender/nature/vocation/chronology).

---

## 2. Inventory of surviving data

### 2a. Shipped runtime artifacts — `Datasets/en/NLT/`

| File | Size | Format | Encrypted? | Contents |
| --- | --- | --- | --- | --- |
| `SourceView.sqlite3` | 2.4 MB | plain SQLite 3 | **No** — open it right now | The relational metadata (actants, BSO spans, speaker/audience links, spheres, professions, natures, chronologies). §3. |
| `SourceView.bpt` | 23 MB | Emdros Bit‑Packed Table v1 | **Yes** — Emdros page codec | The full annotated NLT corpus: every word's *surface text*, book/chapter/verse structure, `Source` spans, and per‑word sphere flags. §5. |
| `SourceView.realm` | 3.2 MB | Realm DB | **Yes** — Realm 64‑byte key | Pre-computed aggregates/statistics for the app's discovery UI (word clouds, counts, source relations). *Derived data* — regenerable from the two above. |

### 2b. The build pipeline & source seeds — `Kraken/`

`Kraken/` is the data pipeline that produced the runtime artifacts. It still contains
the human-readable **source seeds** and the label/decoder tables:

| File | What it gives you |
| --- | --- |
| `Kraken/kraken.rb` | The pipeline entry point. Documents that the original master corpus was `../../SVB2/sphereview.sqlite3` (see §8) and lists the MdF features it queried. |
| `Kraken/db/seeds/actants.json` (485 KB) | Every actant with **name**, gender, natures, professions, chronologies, isSource/isRecipient. |
| `Kraken/db/seeds/bso.json` (1.4 MB) | Every span with resolved **speaker name** + human **reference** (e.g. `1:14-15`). |
| `Kraken/db/seeds/bso_word_counts.json` (1.8 MB) | Per-span sphere word counts. |
| `Kraken/db/seeds/book_words.json` (8 MB) | Per-actant word occurrences with monads + chapter/verse. |
| `Kraken/db/seeds/professions.json` | 52 vocation labels (id → key). |
| `Kraken/db/seeds/natures.json` | 5 nature labels. |
| `Kraken/db/seeds/chronologies.json` | 18 chronology bands with year ranges. |
| `Kraken/db/seeds/sphere-key-passages.json` (153 KB) | Curated key passages per sphere. |
| `Kraken/app/spheres.json` | 7 spheres with display names + full editorial overviews. |
| `Kraken/app/books.json` (13 KB) | 66 books with names, testament, editorial intros. |
| `Kraken/db/migrations/*.rb` | The authoritative DDL for the relational schema. |
| `Kraken/db/seeds/*.rb` | The exact transforms from the master corpus to each table. |
| `Kraken/sqlite-to-bpt.sh` | The `bptdump` command (and key) that produced `SourceView.bpt`. |

---

## 3. Full relational schema (field-by-field)

From `SourceView.sqlite3` (verified) and `Kraken/db/migrations/`:

```sql
-- An actant is a speaker or a person spoken to.
actants(
  id               INTEGER PK,   -- actant id (matches actants.json "id")
  actant_number_id INTEGER,      -- disambiguation number for same-named actants
  gender_id        INTEGER       -- see §4 gender: 1=Female, 2=Male, 3=Other/Unspecified
)                                 -- 1,282 rows

-- A BSO = one span of words attributed to one speaker.
bso(
  id            INTEGER PK,       -- span id (matches bso.json "id")
  first         INTEGER,          -- first monad of the span  (indexed)
  last          INTEGER,          -- last  monad of the span  (indexed)
  book_id       INTEGER,          -- 1-based index into Kraken/app/books.json
  source_id     INTEGER,          -- the speaker's source-name id (from the corpus)
  occurrence_id INTEGER,          -- n-th occurrence of this speaker in this book
  role_id       INTEGER,          -- see §4 roles: 1=narrator,2=god,3=lead,4=support
  word_count    INTEGER           -- number of words in the span
)                                 -- 6,485 rows

-- Links a BSO to its actants: type 1 = the speaker, type 2 = an audience member.
bso_actants(
  id        INTEGER PK,
  actant_id INTEGER REFERENCES actants,
  type_id   INTEGER,              -- 1 = speaker (source), 2 = audience (recipient)
  bso_id    INTEGER REFERENCES bso
)                                 -- 13,486 rows (≈6,753 speaker links + 6,733 audience links)

-- Actant attribute link tables (many-to-many), keyed by actant_id:
professions(actant_id, profession_id)   -- 533 rows;  profession_id → §4 professions
chronologies(actant_id, chronology_id)  -- 1,371 rows; chronology_id → §4 chronologies
natures(actant_id, nature_id)           -- 1,144 rows; nature_id → §4 natures

-- Per-span sphere word counts:
spheres(
  bso_id     INTEGER REFERENCES bso,
  sphere_id  INTEGER,             -- 1..7 → §4 spheres
  word_count INTEGER              -- words in this span that carry this sphere
)                                 -- 23,952 rows
```

`bso.first`/`bso.last` are the bridge between this relational metadata and the words in
the encrypted corpus (§5): a word at monad *m* belongs to span *s* iff
`s.first <= m <= s.last`.

---

## 4. Complete lookup / decoder tables

These are the "decoder rings" that turn numeric ids into meaning. All are reproduced in
full here so the spec is self-contained (sources: `Kraken/db/seeds/*.json`,
`App/js/Scenes/DiscoveryCenter/Filters/GenderFilter.js`, `App/js/Database/Realm.js`).

**Gender** (`actants.gender_id`)

| id | meaning |
| -- | --- |
| 1 | Female |
| 2 | Male |
| 3 | Other / Unspecified (groups, deity, etc.) |

**Role** (`bso.role_id`, a.k.a. `source_color`)

| id | key | meaning |
| -- | --- | --- |
| 1 | narrator | narration |
| 2 | god | God speaking |
| 3 | lead | lead character |
| 4 | support | supporting character |

**bso_actants.type_id**: `1` = speaker (source), `2` = audience (recipient).

**Nature** (`natures.nature_id`)

| id | key |
| -- | --- |
| 1 | Angelic |
| 2 | Demonic |
| 3 | Divine |
| 4 | Human |
| 5 | Other |

**Sphere** (`spheres.sphere_id`) — order is authoritative, from `Kraken/db/seeds/spheres.rb`

| id | key | corpus token feature |
| -- | --- | --- |
| 1 | family | `Family` |
| 2 | economics | `Economics` |
| 3 | government | `Government` |
| 4 | religion | `Religion` |
| 5 | education | `Education` |
| 6 | communication | `MediaCom` |
| 7 | celebration | `Celebration` |

(There is also a `foundational` sphere used editorially in `spheres.json`, but it is not
one of the seven tagged spheres.)

**Chronology** (`chronologies.chronology_id`) — each is a century band with a year range

| id | key | from | to |
| -- | --- | --- | --- |
| 1 | Chron_0s_AD | 0 | 99 |
| 2 | Chron_0s_BC | -99 | -1 |
| 3 | Chron_1000s_BC | -1099 | -1000 |
| 4 | Chron_1100s_BC | -1299 | -1100 |
| 5 | Chron_1200s_BC | -1299 | -1200 |
| 6 | Chron_1300s_BC | -1399 | -1300 |
| 7 | Chron_1400s_BC | -1499 | -1400 |
| 8 | Chron_1800s_BC | -1899 | -1800 |
| 9 | Chron_1900s_BC | -1999 | -1900 |
| 10 | Chron_2000s_BC | -2099 | -2000 |
| 11 | Chron_400s_BC | -499 | -400 |
| 12 | Chron_500s_BC | -599 | -500 |
| 13 | Chron_600s_BC | -699 | -600 |
| 14 | Chron_700s_BC | -799 | -700 |
| 15 | Chron_800s_BC | -899 | -800 |
| 16 | Chron_900s_BC | -999 | -900 |
| 17 | Chron_Eschatos | 100 | 10000 |
| 18 | Chron_PreAbraham | -2100 | -10000 |

**Profession / Vocation** (`professions.profession_id`) — 52 entries; `searchable:false`
ones were hidden umbrella categories in the app UI

```
1  Agriculture (hidden)      19 Lawyer                 37 Prostitute
2  Author                    20 LinguistScribe         38 Psalmist
3  Beggar                    21 Manufacturing          39 Queen
4  Church_Leader             22 Maritime               40 Royalty (hidden)
5  ConstructionManufacturing 23 Merchant               41 Scribe
6  EducatorTeacher           24 Messenger              42 Servant
7  Executive (hidden)        25 Military               43 ServantSlave
8  Farmer                    26 MilitaryPolice (hidden)44 Shepherd
9  Fisherman                 27 Musician               45 Slave
10 Food_Services             28 Not_Hebrew (hidden)    46 SlaveServant
11 Governor                  29 Officer                47 SoldierGuard
12 Health_Services           30 OfficerLeader          48 StudentDisciple
13 Hebrew (hidden)           31 Other_Official         49 StudentLearner
14 High_Priest               32 Other_Religious_Leader 50 Teacher
15 Homemaker                 33 Priest                 51 TeacherEducator
16 Judge                     34 Prince                 52 Thief
17 Judicial (hidden)         35 Princess
18 King                      36 Prophet
```

---

## 5. The Emdros corpus: encryption keys & how to decrypt it

The words themselves (surface text + per-word sphere flags) live only in
`SourceView.bpt`, which is encrypted. **All the keys are committed in this repo.** There
are three distinct keys for three distinct stores — do not confuse them:

| Store | Key (verbatim) | Format | Defined in |
| --- | --- | --- | --- |
| **`SourceView.bpt`** (Emdros corpus) | `0x67d3d67d 0x22798509 0x13e6b1c9 0x34c22397 0x61e1b5b1 0x38c4d1b1 0x25e3f6d9 0x1a2f29d7` | Emdros "scheduled key" (8 × 32-bit words) | `Libraries/Emdros/ios/RCTEmdros/RCTEmdros/RCTEmdrosEnv.mm` line 15 **and** `Kraken/sqlite-to-bpt.sh` (they match) |
| `SourceView.realm` (aggregates) | `3fab2edcd8663c6baa91ffeb928ec61e011b19ed866d7365e7d194e43dc47264` | Realm 64-byte key | `Libraries/Emdros/.../RCTEmdros.m` → `Emdros.key`; used in `App/js/Database/Realm.js:937` |
| preferences Realm | `b52e731250ce81e843229f40ffd72e1e19604043622e18a452915544dcabafb9` | Realm 64-byte key | `RCTEmdros.m` → `Emdros.preferencesKey`; `App/js/Preferences/Realm.js:366` |

> The corpus key is the one you need to read the words. The `RCTEmdrosEnv.mm` value is
> authoritative because that is the code path the app uses to open the shipped
> `SourceView.bpt`, and it is identical to the key used by `sqlite-to-bpt.sh` to create
> it.

### How the encryption works (so you can trust/replace it)

Emdros encrypts each page of the BPT with a reversible XOR stream cipher
(`Libraries/Emdros/src/emdros_amalgamation.cpp`, functions `decode_codec_key3` and
`useCodecOnPageData`). The key string is parsed by `decode_codec_key3`, which accepts:

- an **87-char "scheduled key"**: eight `0x%08x` words separated by single spaces
  (this is the corpus key above), parsed with `sscanf(... "%x %x %x %x %x %x %x %x")`; or
- a 21-char two-word form; or a raw 7-byte "scheduling key" that it expands via a PRNG.

Because the cipher is a symmetric XOR keystream, the same key both encrypts and
decrypts. This is obfuscation, not strong cryptography — but you do not need to break it,
you have the key.

### Object model inside the BPT (confirmed from the app's MQL + stylesheet)

```
Book       (feature: DJHRef)
  Chapter  (feature: chapter)
    Verse  (features: chapter, verse_start)
      Source (features: source_name, source_occurrence, source_color)   -- speaker span
        Token (features: surface, surface_fts,                          -- one per word
               + boolean sphere flags:
                 Family, Economics, Government,
                 Religion, Education, MediaCom, Celebration)
```

Additional structural object types exist for layout (`Paragraph`, `Poetry`, `Stanza`,
`PoetryLine`, `Note`, `EmbeddedQuotation`, `EmbeddedDocument`, `Italics`, table markup) —
see `App/js/API/scripture-stylesheet.json` for the full list and their features.

---

## 6. Step-by-step rebuild procedure

### Step 0 — Extract the relational metadata (no build required)

```sh
python3 tools/extract_metadata.py     # see §7; writes build/metadata/*
```

This alone gives you every span with speaker, audience, role, vocation, gender, nature,
chronology and sphere breakdown — i.e. the bulk of the IP — with no Emdros build.

### Step 1 — Build the Emdros command-line tools

Emdros is open source and its amalgamated sources are vendored at
`Libraries/Emdros/src/emdros_amalgamation.cpp`. To get the `mql` and `bptdump` (a.k.a.
`bpt2dump`) utilities, fetch the matching Emdros release referenced by the original
pipeline (`emdros-3.4.1` per `Kraken/sqlite-to-bpt.sh`) or newer from
<https://emdros.org/download.html>, then:

```sh
tar xzf emdros-3.4.1.tar.gz && cd emdros-3.4.1
./configure --with-sqlite3=yes --with-bpt=yes    # BPT support must be enabled
make -j
# binaries land in src/  (mql, and the BPT dumper: bptdump / bpt2dump)
```

### Step 2 — Decrypt / open the corpus

Point the tools at the shipped file with the corpus key (§5). Two options:

```sh
KEY='0x67d3d67d 0x22798509 0x13e6b1c9 0x34c22397 0x61e1b5b1 0x38c4d1b1 0x25e3f6d9 0x1a2f29d7'

# (a) Query the BPT directly with mql. Example: pull every word + its sphere flags:
mql -b bpt --key "$KEY" -d Datasets/en/NLT/SourceView.bpt <<'EOF'
SELECT ALL OBJECTS
WHERE [Token GET surface, Family, Economics, Government, Religion, Education, MediaCom, Celebration]
GO
EOF

# (b) Or dump the whole corpus to an *unencrypted* SQLite/EMdF database you can read
#     with the plain sqlite3 CLI, then export the monad→surface table.
bptdump --key "$KEY" Datasets/en/NLT/SourceView.bpt SourceView.plain.sqlite3
```

> If a given tool build rejects the 8-word form, the identical key is also expressible as
> the raw 64-hex-char string `67d3d67d22798509...1a2f29d7`; use whichever form your
> Emdros build's `--key` parser accepts (see `decode_codec_key3`).

From the decrypted corpus, produce a flat **words table**:
`monad, surface, book, chapter, verse, family, economics, government, religion,
education, communication, celebration` (one row per word/monad).

### Step 3 — Reunite words with the relational metadata

Attach `build/metadata/spans.json` (or query `SourceView.sqlite3` directly) to each word
by monad range. In SQL, if `words(monad, surface, …)` is the table from Step 2 and you
`ATTACH` the relational DB:

```sql
SELECT
  w.monad, w.surface,
  b.reference,
  b.role_id,                                   -- §4 roles
  spk.name              AS speaker,
  spk.gender_id,                               -- §4 gender
  b.id                  AS bso_id
FROM words w
JOIN bso b            ON w.monad BETWEEN b.first AND b.last
LEFT JOIN bso_actants ba_s ON ba_s.bso_id = b.id AND ba_s.type_id = 1   -- speaker
LEFT JOIN actants     spk  ON spk.id = ba_s.actant_id
ORDER BY w.monad;
```

Audience per word comes from `bso_actants` where `type_id = 2`; the speaker's
professions/natures/chronologies come from the `professions`/`natures`/`chronologies`
link tables (resolve ids via §4); per-word sphere flags come straight from the `words`
table (Step 2), and the span-level sphere word counts from the `spheres` table.

### Step 4 — Publish the unified dataset

Materialize the join as a single engine-neutral file (JSONL or Parquet), e.g. one record
per word:

```json
{ "monad": 2916, "surface": "bone", "book": "Genesis", "reference": "2:23",
  "speaker": "Adam", "role": "lead", "gender": "Male", "nature": ["Human"],
  "vocation": [], "chronology": ["Chron_PreAbraham"],
  "audience": ["God"],
  "spheres": ["family", "economics", "celebration"] }
```

That table is the canonical Source View dataset, independent of Emdros/Realm, ready for
any future app.

---

## 7. The included extractor

`tools/extract_metadata.py` (Python standard library only) implements Step 0. It joins
the surviving relational SQLite with the JSON seeds and the §4 label tables, and writes
portable, label-resolved datasets to `build/metadata/`:

| Output | Contents |
| --- | --- |
| `actants.json` | Every actant with resolved gender, natures, professions, chronologies. |
| `spans.json` | Every span: book, reference, monad range, **role**, speaker, audience (resolved names), word count, per-span sphere breakdown. |
| `spans.csv` | Flat version of the spans for spreadsheets / BI. |
| `lookups.json` | All §4 label tables (gender, role, actant_role, natures, professions, chronologies, spheres). |
| `summary.json` | Headline counts for an integrity check. |

Run and verified output on the committed data:

```
$ python3 tools/extract_metadata.py
actants: 1257
spans: 6485
spans_with_audience: 5911
spans_with_spheres: 6440
professions: 52   natures: 5   chronologies: 18   spheres: 7
books_referenced: 66      # the whole Bible
```

Example record from `spans.json`:

```json
{
  "book": "Genesis", "reference": "2:23",
  "first_monad": 2914, "last_monad": 2922,
  "role": "lead", "speaker": "Adam", "audience": ["God"],
  "spheres": [
    {"sphere": "family", "word_count": 2},
    {"sphere": "economics", "word_count": 2},
    {"sphere": "celebration", "word_count": 2}
  ]
}
```

> `build/metadata/` is generated output and is git-ignored (the repo ignores `build/`).
> Re-run the extractor to reproduce it.

---

## 8. What is genuinely lost

- **`SVB2/sphereview.sqlite3`** — the original *master* Emdros authoring corpus
  (referenced by `Kraken/kraken.rb`). It lived outside this repo and is gone. It held the
  raw MdF features (`mdf_actant_id`, `mdf_gender`, `mdf_natures`, `mdf_professions`,
  `mdf_chronology`, `mdf_source_name`, `mdf_source_occurrence`, `mdf_source_color`, real
  names, verse/book objects, source/recipient actant objects) before they were reduced
  to numeric ids.

**What that actually costs you: almost nothing**, because every output of that master
corpus survives here — the relational metadata (`SourceView.sqlite3` + JSON seeds) and
the word text + per-word sphere flags (`SourceView.bpt`, decryptable with §5). The only
things not directly recoverable are any *unshipped* intermediate annotations that were
never emitted into the SQLite, the seeds, or the corpus — none of which the app used.

The derived statistics in `SourceView.realm` are fully recomputable from the recovered
data, so they need not be preserved separately.

---

### Appendix — file map for quick reference

| Need | Look at |
| --- | --- |
| Relational metadata | `Datasets/en/NLT/SourceView.sqlite3` |
| Word text + per-word spheres | `Datasets/en/NLT/SourceView.bpt` (key in §5) |
| Actant names | `Kraken/db/seeds/actants.json` |
| Span references / speaker names | `Kraken/db/seeds/bso.json` |
| Label tables | `Kraken/db/seeds/{professions,natures,chronologies}.json`, `Kraken/app/spheres.json` |
| Books & order | `Kraken/app/books.json` |
| Schema DDL | `Kraken/db/migrations/*.rb` |
| Exact original transforms | `Kraken/db/seeds/*.rb`, `Kraken/kraken.rb` |
| BPT creation command | `Kraken/sqlite-to-bpt.sh` |
| Corpus object model / features | `App/js/API/scripture-stylesheet.json`, `App/js/API/Emdros.js` |
| Encryption internals | `Libraries/Emdros/src/emdros_amalgamation.cpp` (`decode_codec_key3`, `useCodecOnPageData`) |
| One-shot extractor | `tools/extract_metadata.py` |
