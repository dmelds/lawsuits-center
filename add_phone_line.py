#!/usr/bin/env python3
"""Put the intake phone line, (800) 956-9876, on every claimant intake form.

The line sits at the bottom of the form, next to the submit button, so it does
not pull a reader away from filling the form out. It reads as the fallback
path: finish the form, or call if the form is giving you trouble.

Three page shapes exist, and each gets the line in the spot that page already
has for a fallback note:

  * Standard case-review forms (31 pages) carry a reCAPTCHA trouble note just
    above the submit button. The phone number is folded into that note.
  * The Spanish pesticide page carries the same note in Spanish. Same swap,
    Spanish copy.
  * Three landing-style forms have no reCAPTCHA and no trouble note. They get
    one form-note line directly above their submit button.

The sweep also drops a one-rule style block on each page so the sticky header
no longer covers the top of the form when a CTA visitor lands. lead-events.js
scrolls the form itself to the top of the viewport, and the 88px header sat on
top of the first field. Most pages inline their CSS rather than load
/style.css, so the rule has to travel with the page.

Out of scope, on purpose: contact.html, law-firm-inquiry.html and
educational-review.html. Those are not claimant intake forms.

Every change is keyed on a marker that is present exactly once, and a page
that already carries the line is left alone, so this is safe to rerun and
safe to schedule. If the number ever changes, edit PHONE below and rerun; the
old number is swapped for the new one on every page.

Usage
-----
    python3 add_phone_line.py
    python3 add_phone_line.py --apply

Options
-------
    --path DIR   directory to scan (default .)
    --apply      write changes; without it the script only reports
"""

import argparse
import os
import re
import sys

PHONE_DISPLAY = "(800) 956-9876"
PHONE_TEL = "+18009569876"

# text-review.html is the form texted callers land on after a missed call. A phone line there
# sends them back to the number they just failed to reach, so it is left out on purpose.
SKIP = {"contact.html", "law-firm-inquiry.html", "educational-review.html", "text-review.html"}

TEL = (
    '<a href="tel:' + PHONE_TEL + '" class="form-phone">' + PHONE_DISPLAY + "</a>"
)

# Standard trouble note, present verbatim on 31 pages.
NOTE_EN_OLD = (
    '<p class="form-note">Having trouble with the verification step above? '
    'You can also reach us through our '
    '<a href="contact" style="color:var(--amber-bright);">contact page</a> '
    'and we will follow up about your case review request.</p>'
)
NOTE_EN_NEW = (
    '<p class="form-note">Having trouble with the verification step above? '
    "Call " + TEL + " (calls are recorded) or reach us through our "
    '<a href="contact" style="color:var(--amber-bright);">contact page</a> '
    'and we will follow up about your case review request.</p>'
)

# Spanish trouble note, es/pesticide-case-review.html.
NOTE_ES_OLD = (
    '<p class="form-note">¿Tiene problemas con el paso de verificación de arriba? '
    'También puede comunicarse a través de nuestra '
    '<a href="/contact" style="color:var(--amber-bright);">página de contacto</a> '
    'y daremos seguimiento a su solicitud de revisión de caso.</p>'
)
NOTE_ES_NEW = (
    '<p class="form-note">¿Tiene problemas con el paso de verificación de arriba? '
    "Llame al " + TEL + " (las llamadas se graban) o comuníquese a través de nuestra "
    '<a href="/contact" style="color:var(--amber-bright);">página de contacto</a> '
    'y daremos seguimiento a su solicitud de revisión de caso.</p>'
)

# Landing-style forms with no trouble note: one line above the submit button.
LANDING_LINE = (
    '<p class="form-note form-note--phone">Prefer to talk? Call '
    + TEL + ". Calls are recorded.</p>"
)

STYLE_ID = "lc-form-phone"
STYLE_BLOCK = (
    '<style id="' + STYLE_ID + '">'
    "form[name][method]{scroll-margin-top:100px}"
    ".form-phone{color:var(--amber-bright);font-weight:600;white-space:nowrap;text-decoration:none}"
    ".form-phone:hover{text-decoration:underline}"
    "</style>\n"
)
STYLE_ANCHOR = '<style id="lc-theme">'

SUBMIT_RE = re.compile(r"^([ \t]*)<button type=\"submit\"", re.M)
TEL_ANY_RE = re.compile(
    r'<a href="tel:\+1\d{10}" class="form-phone">\(\d{3}\) \d{3}-\d{4}</a>'
)


def in_scope(path, html):
    name = os.path.basename(path)
    if name in SKIP:
        return False
    return 'data-netlify="true"' in html


def sweep(path, html):
    """Return (new_html, notes). notes is a list of what changed."""
    notes = []

    # 1. Phone line.
    if TEL_ANY_RE.search(html):
        # Already carries the line. Refresh the number if it moved.
        new = TEL_ANY_RE.sub(TEL, html)
        if new != html:
            notes.append("number updated")
            html = new
    elif NOTE_EN_OLD in html:
        html = html.replace(NOTE_EN_OLD, NOTE_EN_NEW, 1)
        notes.append("trouble note (en)")
    elif NOTE_ES_OLD in html:
        html = html.replace(NOTE_ES_OLD, NOTE_ES_NEW, 1)
        notes.append("trouble note (es)")
    else:
        # Landing-style form: insert above the form's submit button. Find the
        # form element first so a search-box submit elsewhere is not matched.
        form_start = html.find('data-netlify="true"')
        m = SUBMIT_RE.search(html, form_start)
        if not m:
            return html, ["NO SUBMIT BUTTON FOUND"]
        indent = m.group(1)
        html = html[: m.start()] + indent + LANDING_LINE + "\n\n" + html[m.start():]
        notes.append("line above submit")

    # 2. Scroll + link style block, once per page.
    if STYLE_ID not in html:
        if html.count(STYLE_ANCHOR) != 1:
            notes.append("NO lc-theme ANCHOR, style block skipped")
        else:
            html = html.replace(STYLE_ANCHOR, STYLE_BLOCK + STYLE_ANCHOR, 1)
            notes.append("style block")

    return html, notes


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
            with open(p, encoding="utf-8") as fh:
                html = fh.read()
            if not in_scope(p, html):
                continue
            new, notes = sweep(p, html)
            rel = os.path.relpath(p, args.path)
            if any(n.isupper() or n.startswith("NO ") for n in notes):
                problems.append((rel, notes))
            if new == html:
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
        sys.exit(1)


if __name__ == "__main__":
    main()
