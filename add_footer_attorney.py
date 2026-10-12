#!/usr/bin/env python3
"""Put the responsible-attorney line in the footer of every page.

California Rule of Professional Conduct 7.2(c) requires every lawyer advertising
communication to carry the name and address of at least one lawyer responsible
for its content. Lawsuit Center is David Meldofsky's intake and referral
practice, so every page carries one line naming him and the office address.

The footer is inlined on every page, and inline_footer.py does not re-sync
pages that already carry one, so a change to footer.html reaches nothing on
its own. This sweep makes the change on each page directly.

The line goes immediately above the copyright line, which is the one footer
marker present on every page, in English and Spanish, and so sits directly
below the phone line where that line exists. It reuses the site-footer__copy
class so it inherits the copyright line's size and color and needs no new CSS.
Pages under es/ get the Spanish line. text-review.html, which carries no phone
line by design, gets the attorney line like every other page.

A page that already carries the line is left alone, so this is safe to rerun
and safe to schedule. If the name or address changes, edit ATTORNEY and
ADDRESS and rerun; the old line is swapped for the new one on every page.

footer.html is updated too, so a page converted by inline_footer.py later
carries the line from the start.

A page with a footer but no copyright line is reported as a problem and left
untouched rather than guessed at.

Usage
-----
    python3 add_footer_attorney.py
    python3 add_footer_attorney.py --apply

Options
-------
    --path DIR   directory to scan (default .)
    --apply      write changes; without it the script only reports
"""

import argparse
import os
import re

ATTORNEY = "David Meldofsky"
ADDRESS = "6210 Wilshire Blvd. Ste 200, Los Angeles, CA 90048"

LINE_EN = (
    '<div class="site-footer__copy site-footer__attorney">Attorney advertising. Responsible attorney: '
    + ATTORNEY + ", " + ADDRESS + ".</div>"
)
LINE_ES = (
    '<div class="site-footer__copy site-footer__attorney">Publicidad de abogado. Abogado responsable: '
    + ATTORNEY + ", " + ADDRESS + ".</div>"
)

COPY_RE = re.compile(r'^([ \t]*)<div class="site-footer__copy">', re.M)
LINE_RE = re.compile(r'<div class="site-footer__copy site-footer__attorney">[^<]*</div>')


def is_spanish(rel, html):
    return rel.startswith("es" + os.sep) or "Todos los derechos reservados" in html


def sweep(rel, html):
    want = LINE_ES if is_spanish(rel, html) else LINE_EN
    if "site-footer__attorney" in html:
        new = LINE_RE.sub(want, html)
        return new, (["line updated"] if new != html else [])
    if "site-footer" not in html:
        return html, []
    matches = list(COPY_RE.finditer(html))
    if len(matches) != 1:
        return html, ["NO SINGLE COPYRIGHT LINE (%d found)" % len(matches)]
    m = matches[0]
    html = html[: m.start()] + m.group(1) + want + "\n" + html[m.start():]
    return html, ["footer line (%s)" % ("es" if want is LINE_ES else "en")]


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
