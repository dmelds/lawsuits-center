#!/usr/bin/env python3
"""Inline the site footer into every page that currently fetches it.

83 of this site's pages render the footer client side:

    <footer class="site-footer">
     <div id="footer-placeholder"></div>
    </footer>
    <script>
     fetch('/footer.html')
      .then(response => response.text())
      .then(html => { document.getElementById('footer-placeholder').innerHTML = html; });
    </script>

Nothing in that footer exists in the raw HTML. Googlebot renders JS and sees it;
Bingbot's rendering is far less reliable, and this property draws 45 Bing
impressions in 28 days against Lawsuit Informer's 7,010 on an inline footer. The
footer also carries the attorney-advertising and no-attorney-client-relationship
disclosures, so on those pages the disclosures are absent from the served HTML
and from any reader with JS off.

This script replaces the placeholder-plus-fetch block with the contents of
footer.html, wrapped in the same <footer class="site-footer"> element the 41
already-inline pages use. footer.html stays in the repo as the single source of
truth and is re-read on every run.

What it deliberately does NOT touch
-----------------------------------
Pages that already carry an inline footer are left exactly as they are, even
when their footer differs from footer.html. Those differences are real and
intentional: the five /es/ pages carry a translated footer, five English pages
carry an Espanol toggle for hreflang, and index.html carries a longer sponsored-
visibility disclosure. Normalizing them would break the language pairs. The
script reports the drift so it stays visible, and rewrites none of it.

Any page under es/ that somehow carries the English fetch block is reported as a
problem rather than converted, since inlining the English partial there would
put an English footer on a Spanish page.

Idempotent: a page with no fetch block is skipped, so a rerun on a swept tree is
a no-op and reports zero pages inlined.

Usage
-----
    python3 inline_footer.py
    python3 inline_footer.py --apply

Options
-------
    --path DIR   directory to scan (default .)
    --apply      write changes; without it the script only reports
"""
import argparse
import io
import re
import sys
from pathlib import Path

PARTIAL = "footer.html"
OPEN_TAG = '<footer class="site-footer">'
CLOSE_TAG = "</footer>"

# The placeholder footer element plus the fetch script that fills it. Indentation
# varies across the tree (three whitespace variants), so every run of whitespace
# is matched loosely rather than pinned.
FETCH_BLOCK = re.compile(
    r'<footer class="site-footer">\s*'
    r'<div id="footer-placeholder"\s*></div>\s*'
    r'</footer>\s*'
    r'<script>\s*'
    r'fetch\(\s*[\'"]/?footer\.html[\'"]\s*\)'
    r'.*?</script>',
    re.S,
)

FOOTER_EL = re.compile(r'<footer class="site-footer">\s*(.*?)\s*</footer>', re.S)


def build_footer(partial_text):
    """The canonical inline footer, matching the existing on-page convention."""
    return "%s\n%s\n%s" % (OPEN_TAG, partial_text.strip(), CLOSE_TAG)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--path", default=".")
    ap.add_argument("--apply", action="store_true")
    args = ap.parse_args()

    root = Path(args.path)
    partial_path = root / PARTIAL
    if not partial_path.exists():
        print("::error::%s not found - nothing to inline from." % PARTIAL)
        return 1

    partial_text = io.open(partial_path, encoding="utf-8").read()
    footer_html = build_footer(partial_text)

    inlined, already, drift, problems = [], [], [], []

    for path in sorted(root.rglob("*.html")):
        if ".git" in path.parts or "node_modules" in path.parts:
            continue
        rel = str(path.relative_to(root))
        if rel == PARTIAL:
            continue

        html = io.open(path, encoding="utf-8").read()
        fetches = PARTIAL in html

        if not fetches:
            # Already inline. Report drift from the canonical partial, never fix
            # it: translated footers and language toggles live in that drift.
            m = FOOTER_EL.search(html)
            if m is None:
                problems.append((rel, "no footer element"))
            elif m.group(1).strip() != partial_text.strip():
                drift.append(rel)
            else:
                already.append(rel)
            continue

        if rel.startswith("es/") or rel.startswith("es" + "\\"):
            problems.append((rel, "Spanish page fetching the English partial"))
            continue

        if len(FETCH_BLOCK.findall(html)) != 1:
            problems.append(
                (rel, "matched the fetch block %d times"
                 % len(FETCH_BLOCK.findall(html))))
            continue

        out = FETCH_BLOCK.sub(lambda _: footer_html, html, count=1)

        # The rewrite has to leave the page with exactly one footer element and
        # no lingering reference to the partial. Anything else is drift worth
        # stopping on rather than committing.
        if out.count(OPEN_TAG) != 1 or PARTIAL in out:
            problems.append((rel, "post-rewrite check failed"))
            continue

        inlined.append(rel)
        if args.apply:
            io.open(path, "w", encoding="utf-8").write(out)

    mode = "APPLIED" if args.apply else "DRY RUN (no files written)"
    print("footer inlining sweep - %s" % mode)
    print("  %d pages inlined" % len(inlined))
    print("  %d pages already carried the canonical footer" % len(already))
    print("  %d pages carry an intentionally different footer (left alone)"
          % len(drift))
    print("  %d pages could not be inlined" % len(problems))

    for rel, why in problems:
        print("\n  %s  [SKIPPED - %s]" % (rel, why))

    if drift:
        print("\n  Different by design, not rewritten:")
        for rel in drift:
            print("    %s" % rel)

    if not args.apply:
        for rel in inlined:
            print("\n  %s" % rel)
            print("    fetch('/footer.html') -> inline footer")

    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main())
