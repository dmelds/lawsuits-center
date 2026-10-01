#!/usr/bin/env python3
"""Give every Netlify form the hidden inputs the Lead Desk reads, and load the
script that fills them.

Why
---
A Netlify submission carries the visitor's answers and nothing about where they
came from. The desk records referrer, UTMs, landing page and the consent text
the claimant saw, but only if the form posts them. Netlify keeps only fields
that exist in the static HTML at deploy time, so the inputs have to be in the
page, not added by JavaScript.

What the sweep does
-------------------
For every form carrying data-netlify (or the bare `netlify` attribute):
  * inserts eight hidden inputs after the form-name input (or right after the
    opening <form> tag on the hidden registration forms that have none):
      utm_source utm_medium utm_campaign utm_content utm_term
      page_referrer landing_page consent_version
  * sets consent_version to a fingerprint of the consent wording inside that
    form: the checkbox labels for contact-consent / agree-and-consent and the
    .form-fineprint paragraph, whitespace-normalized, SHA-256, first 10 hex,
    prefixed cv1-. Change the wording and the fingerprint changes. A form with
    no consent wording at all gets cv1-none, which the desk shows as such.
  * loads /lead-attribution.js (defer) before the LC-LIGHT-JS block on every
    page that has that anchor, form page or not, so first-touch attribution is
    captured on the page the visitor lands on and carried to the form.

Idempotent. A rerun on a swept tree reports zero changes. If a form's consent
wording changed since the last sweep, the dry run reports DRIFT and exits 1,
which is what the monthly check keys on; --apply updates the value.

Usage
-----
    python3 add_attribution.py            dry run
    python3 add_attribution.py --apply    write

Options
-------
    --path DIR   directory to scan (default .)
"""
import argparse
import hashlib
import html as htmlmod
import io
import re
import sys
from pathlib import Path

ANCHOR = "<!-- LC-LIGHT-JS:BEGIN -->"
SCRIPT_TAG = '<script src="/lead-attribution.js" defer></script>'
SCRIPT_GUARD = "lead-attribution.js"

FIELDS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term",
          "page_referrer", "landing_page", "consent_version"]
MARK_BEGIN = "<!-- LC-ATTR:BEGIN -->"
MARK_END = "<!-- LC-ATTR:END -->"

FORM = re.compile(r'(<form\b[^>]*>)(.*?)(</form>)', re.I | re.S)
IS_NETLIFY = re.compile(r'\bdata-netlify\b|\bnetlify\b(?!-)', re.I)
FORM_NAME_INPUT = re.compile(r'[ \t]*<input\b[^>]*\bname="form-name"[^>]*>[ \t]*\n?', re.I)
TAG = re.compile(r'<[^>]+>')
WS = re.compile(r'\s+')
FINEPRINT = re.compile(r'<p\b[^>]*class="[^"]*form-fineprint[^"]*"[^>]*>(.*?)</p>', re.I | re.S)
CONSENT_LABEL = re.compile(
    r'<label\b[^>]*>\s*<input\b[^>]*\bname="(?:contact-consent|agree-and-consent)"[^>]*>\s*<span\b[^>]*>(.*?)</span>',
    re.I | re.S)
ATTR_BLOCK = re.compile(re.escape(MARK_BEGIN) + r'.*?' + re.escape(MARK_END) + r'\n?', re.S)
CV_VALUE = re.compile(r'name="consent_version"\s+value="([^"]*)"')


def text_of(fragment):
    return WS.sub(" ", htmlmod.unescape(TAG.sub(" ", fragment))).strip()


def consent_fingerprint(form_body):
    parts = [text_of(m.group(1)) for m in CONSENT_LABEL.finditer(form_body)]
    parts += [text_of(m.group(1)) for m in FINEPRINT.finditer(form_body)]
    parts = [p for p in parts if p]
    if not parts:
        return "cv1-none"
    digest = hashlib.sha256("\n".join(parts).encode("utf-8")).hexdigest()
    return "cv1-" + digest[:10]


def indent_of(line):
    return re.match(r'[ \t]*', line).group(0)


def block(indent, cv):
    rows = [indent + MARK_BEGIN]
    for f in FIELDS:
        val = cv if f == "consent_version" else ""
        rows.append('%s<input type="hidden" name="%s" value="%s" />' % (indent, f, val))
    rows.append(indent + MARK_END)
    return "\n".join(rows) + "\n"


def process_form(open_tag, body, close_tag):
    """Return (new_form_html, status) where status is one of
    added | drift | ok | skipped."""
    if not IS_NETLIFY.search(open_tag):
        return open_tag + body + close_tag, "skipped"
    cv = consent_fingerprint(body)
    existing = ATTR_BLOCK.search(body)
    if existing:
        m = CV_VALUE.search(existing.group(0))
        if m and m.group(1) == cv:
            return open_tag + body + close_tag, "ok"
        indent = indent_of(existing.group(0))
        new_body = body[:existing.start()] + block(indent, cv) + body[existing.end():]
        return open_tag + new_body + close_tag, "drift"
    fn = FORM_NAME_INPUT.search(body)
    if fn:
        indent = indent_of(fn.group(0))
        new_body = body[:fn.end()] + block(indent, cv) + body[fn.end():]
    else:
        # Hidden registration forms on index.html: no form-name input, so the
        # block goes first inside the form.
        nl = body.find("\n")
        first = body[nl + 1:nl + 1 + 40] if nl != -1 else ""
        indent = indent_of(first) if first.strip() else "  "
        new_body = ("\n" if nl == -1 else body[:nl + 1]) + block(indent, cv) + (body if nl == -1 else body[nl + 1:])
    return open_tag + new_body + close_tag, "added"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--path", default=".")
    ap.add_argument("--apply", action="store_true")
    args = ap.parse_args()
    root = Path(args.path)

    added, drift, ok, scripted, present, no_anchor = [], [], [], [], [], []
    none_consent = []

    for path in sorted(root.rglob("*.html")):
        if ".git" in path.parts or "node_modules" in path.parts:
            continue
        rel = str(path.relative_to(root))
        html = io.open(path, encoding="utf-8").read()
        out = html
        statuses = []

        def repl(m):
            new, status = process_form(m.group(1), m.group(2), m.group(3))
            if status != "skipped":
                statuses.append(status)
                if "cv1-none" in new and status in ("added", "drift"):
                    none_consent.append(rel)
            return new

        out = FORM.sub(repl, out)
        for s in statuses:
            {"added": added, "drift": drift, "ok": ok}[s].append(rel)

        if html.count(ANCHOR) == 1:
            if SCRIPT_GUARD in out:
                present.append(rel)
            else:
                out = out.replace(ANCHOR, SCRIPT_TAG + "\n" + ANCHOR, 1)
                scripted.append(rel)
        elif statuses:
            no_anchor.append(rel)

        if args.apply and out != html:
            io.open(path, "w", encoding="utf-8").write(out)

    mode = "APPLIED" if args.apply else "DRY RUN (no files written)"
    print("attribution sweep - %s" % mode)
    print("  %d forms given hidden inputs, %d forms with a changed consent fingerprint (DRIFT), %d forms already current"
          % (len(added), len(drift), len(ok)))
    print("  %d pages given lead-attribution.js, %d pages already load it, %d form pages without the LC-LIGHT-JS anchor"
          % (len(scripted), len(present), len(no_anchor)))
    if none_consent:
        print("  %d forms carry NO consent wording (consent_version = cv1-none): %s"
              % (len(set(none_consent)), ", ".join(sorted(set(none_consent)))))
    if drift:
        print("\n  DRIFT (consent wording changed since last sweep):")
        for rel in sorted(set(drift)):
            print("    " + rel)
    if no_anchor:
        print("\n  No LC-LIGHT-JS anchor (inputs added, script NOT loaded):")
        for rel in sorted(set(no_anchor)):
            print("    " + rel)
    if not args.apply and added:
        print("\n  Forms to tag:")
        for rel in sorted(set(added)):
            print("    " + rel)

    # Drift on a dry run is the monthly check's signal. Missing anchor is real breakage.
    if no_anchor:
        return 1
    if drift and not args.apply:
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
