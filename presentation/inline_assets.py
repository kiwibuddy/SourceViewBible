#!/usr/bin/env python3
"""Inline repo image assets into presentation HTML as base64 data URIs.

Replaces every ``__ASSET:<repo-relative-path>__`` token in the target HTML file(s)
with a ``data:image/...;base64,...`` URI so each deck is a single, self-contained
file (logos travel with the document; only the Unsplash photography loads from the
network). Run from anywhere:

    python3 presentation/inline_assets.py
    python3 presentation/inline_assets.py presentation/data-guide/index.html

Vercel layout (each deck is its own static site root):

    presentation/pitch/index.html
    presentation/data-guide/index.html
    presentation/bible-societies/index.html

Set the Vercel project Root Directory to ``presentation/pitch``, ``presentation/data-guide``,
or ``presentation/bible-societies`` for separate URLs, or use ``presentation`` to serve
all three at ``/pitch``, ``/data-guide``, and ``/bible-societies``.

Rebuild the Bible Societies deck from the pitch template:

    python3 presentation/build_bible_societies.py
"""
import base64
import mimetypes
import pathlib
import re
import sys

REPO = pathlib.Path(__file__).resolve().parent.parent
DEFAULT_HTML = (
    REPO / "presentation" / "pitch" / "index.html",
    REPO / "presentation" / "data-guide" / "index.html",
    REPO / "presentation" / "bible-societies" / "index.html",
)
TOKEN = re.compile(r"__ASSET:([^_][^\n\"]*?)__")


def data_uri(rel_path: str) -> str:
    path = (REPO / rel_path).resolve()
    if not path.exists():
        raise FileNotFoundError(f"asset not found: {rel_path}")
    mime = mimetypes.guess_type(str(path))[0] or "image/png"
    payload = base64.b64encode(path.read_bytes()).decode("ascii")
    return f"data:{mime};base64,{payload}"


def inline_file(html_path: pathlib.Path) -> int:
    html = html_path.read_text(encoding="utf-8")
    seen = {}

    def repl(match: "re.Match[str]") -> str:
        rel = match.group(1)
        if rel not in seen:
            seen[rel] = data_uri(rel)
            print(f"  inlined {rel} ({len(seen[rel])//1024} KB base64)")
        return seen[rel]

    new_html, count = TOKEN.subn(repl, html)
    if count == 0:
        print(f"No __ASSET:...__ tokens in {html_path.name} (already inlined?).")
        return 0
    html_path.write_text(new_html, encoding="utf-8")
    print(f"Inlined {count} asset reference(s) across {len(seen)} unique file(s).")
    print(f"Wrote {html_path.relative_to(REPO)} ({html_path.stat().st_size//1024} KB).")
    return count


def main() -> int:
    targets = [pathlib.Path(a) for a in sys.argv[1:]] if len(sys.argv) > 1 else list(DEFAULT_HTML)
    total = 0
    for html_path in targets:
        if not html_path.is_absolute():
            html_path = REPO / html_path
        print(f"\n{html_path.relative_to(REPO)}:")
        total += inline_file(html_path)
    return 0 if total >= 0 else 1


if __name__ == "__main__":
    sys.exit(main())
