#!/usr/bin/env python3
"""Put the intake phone line, (800) 956-9876, in the footer of every page.

The footer is inlined on every page, and inline_footer.py does not re-sync
pages that already carry one, so a change to footer.html reaches nothing on
its own. This sweep makes the change on each page directly.

The line goes immediately above the copyright line, which is the one footer
marker present on every page, in English and Spanish. It reuses the
site-footer__copy class so it inherits the copyright line's size and color and
needs no new CSS. Pages under es/ get the Spanish line.

A page that already carries the line is left alone, so this is safe to rerun
and safe to schedule. If the number changes, edit PHONE_DISPLAY and PHONE_TEL
and rerun; the old number is swapped for the new one on every page.

footer.html is updated too, so a page converted by inline_footer.py later
carries the line from the start.

A page with a footer but no copyright line is reported as a problem and left
untouched rather than guessed at.

Usage
-----
    python3 add_footer_phone.py
    python3 add_footer_phone.py --apply

Options
-------
    --path DIR   directory to scan (default .)
    --apply      write changes; without it the script only reports
"""

import argparse
import os
import re

PHONE_DISPLAY = "(800) 956-9876"
PHONE_TEL = "+18009569876"

TEL = (
    '<a href="tel:' + PHONE_TEL + '" style="color:var(--amber-bright);">'
    + PHONE_DISPLAY + "</a>"
)
LINE_EN = (
    '<div class="site-footer__copy site-footer__phone">Case review line: '
    + TEL + ". Calls are recorded.</div>"
)
LINE_ES = (
    '<div class="site-footer__copy site-footer__phone">Línea de revisión de casos: '
    + TEL + ". Las llamadas se graban.</div>"
)

COPY_RE = re.compile(r'^([ \t]*)<div class="site-footer__copy">', re.M)
PHONE_RE = re.compile(
    r'<a href="tel:\+1\d{10}" style="color:var\(--amber-bright\);">\(\d{3}\) \d{3}-\d{4}</a>'
)


def is_spanish(rel, html):
    return rel.startswith("es" + os.sep) or "Todos los derechos reservados" in html


# text-review.html is the form texted callers land on after a missed call. The number they just
# failed to reach stays off that page, footer included, so the sweep never adds it there.
SKIP = {"text-review.html"}


def sweep(rel, html):
    if os.path.basename(rel) in SKIP:
        return html, []
    if 'site-footer__phone' in html:
        new = PHONE_RE.sub(TEL, html)
        return new, (["number updated"] if new != html else [])
    if "site-footer" not in html:
        return html, []
    matches = list(COPY_RE.finditer(html))
    if len(matches) != 1:
        return html, ["NO SINGLE COPYRIGHT LINE (%d found)" % len(matches)]
    m = matches[0]
    line = LINE_ES if is_spanish(rel, html) else LINE_EN
    html = html[: m.start()] + m.group(1) + line + "\n" + html[m.start():]
    return html, ["footer line (%s)" % ("es" if line is LINE_ES else "en")]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--path", default=".")
    ap.add_argument("--apply", action="store_true")
    args = ap.parse_args()

    changed, skipped, problems = [], [], []
    for root, dirs, files in os.walk(args.path):
        dirs[:] = [d for d in dirs if not d.startswith(".") and d != "node_modules"]
        for fn in sorted(files):
            if not fn.endswith(".html"):
                continue
            p = os.path.join(root, fn)
            rel = os.path.relpath(p, args.path)
            with open(p, encoding="utf-8") as fh:
                html = fh.read()
            new, notes = sweep(rel, html)
            if any(n.startswith("NO ") for n in notes):
                problems.append((rel, notes))
                continue
            if new == html:
                if "site-footer" in html:
                    skipped.append(rel)
                continue
            changed.append((rel, notes))
            if args.apply:
                with open(p, "w", encoding="utf-8") as fh:
                    fh.write(new)

    verb = "changed" if args.apply else "would change"
    print(f"{len(changed):3d} pages {verb}")
    print(f"{len(skipped):3d} pages already current")
    print(f"{len(problems):3d} pages with problems")
    print()
    for rel, notes in changed:
        print(f"  {rel}: {', '.join(notes)}")
    if problems:
        print()
        for rel, notes in problems:
            print(f"  PROBLEM {rel}: {', '.join(notes)}")
        print()
        print("Problem pages were left untouched. Fix their footer, then rerun.")


if __name__ == "__main__":
    main()
