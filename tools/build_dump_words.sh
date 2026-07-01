#!/bin/sh
# Build the dump_words proof-of-recovery harness against the vendored Emdros engine.
# No network or external Emdros install required: everything is in this repo.
set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/Libraries/Emdros/src"
SQLITE="$ROOT/Libraries/Emdros/android/src/main/jni/sqlite3"
OUT="${OUT:-/tmp/emdros-build}"
mkdir -p "$OUT"

CFLAGS="-O1 -w -DUSE_SYSTEM_SQLITE3=0 -DTHREADSAFE=1 -I$SRC -I$SQLITE"
CXXFLAGS="-O1 -w -std=c++11 -fpermissive -DUSE_SYSTEM_SQLITE3=0 -DTHREADSAFE=1 -I$SRC -I$SQLITE"

# NOTE: emdros_c_amalgamation.c already bundles its own SQLite 3, so we do NOT
# compile/link the separate jni/sqlite3 copy (that would duplicate symbols).
echo "[1/4] emdros_c_amalg";   gcc $CFLAGS -c "$SRC/emdros_c_amalgamation.c"      -o "$OUT/emdros_c.o"
echo "[2/4] emdros_amalg";     g++ $CXXFLAGS -c "$SRC/emdros_amalgamation.cpp"    -o "$OUT/emdros.o"
echo "[3/4] bucket + harvest"; g++ $CXXFLAGS -c "$SRC/bucket.cpp" -o "$OUT/bucket.o"; g++ $CXXFLAGS -c "$SRC/harvest.cpp" -o "$OUT/harvest.o"
echo "[4/4] link dump_words";  g++ $CXXFLAGS "$ROOT/tools/dump_words.cpp" \
      "$OUT/emdros.o" "$OUT/emdros_c.o" "$OUT/bucket.o" "$OUT/harvest.o" \
      -lz -lpthread -ldl -o "$OUT/dump_words"

echo "Built: $OUT/dump_words"
