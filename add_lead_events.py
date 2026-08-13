#!/usr/bin/env python3
"""Load lead-events.js on every intake form page and every thank-you page.

The intake form lives on this property, so a completed submission is the only
true conversion in the two-site funnel. Nothing recorded it: no page on this
site fired a single GA4 event.

lead-events.js is self-detecting, so the same tag serves both halves. It stashes
the form name, situation value, and utm_content slot on submit, then sends
generate_lead once the thank-you page loads.

In scope:
  * any page carrying a named Netlify form (data-netlify)
  * any thank-you page, identified by being the action target of one of those
    forms

The tag is inserted immediately before the LC-LIGHT-JS block, which is the one
marker present exactly once on every page in scope. A page that already loads
the script is left alone, so this is safe to rerun and safe to schedule.

Usage
-----
    python3 add_lead_events.py
    python3 add_lead_events.py --apply

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

ANCHOR = "<!-- LC-LIGHT-JS:BEGIN -->"
TAG = '<script src="/lead-events.js" defer></script>'
GUARD = "lead-events.js"

FORM = re.compile(r'<form\b[^>]*\bdata-netlify\b[^>]*>', re.I)
NAMED = re.compile(r'\bname="([^"]+)"', re.I)
ACTION = re.compile(r'\baction="([^"]+)"', re.I)


def form_blocks(html):
    return FORM.findall(html)


def thank_you_targets(root):
    """Every distinct action target of a named Netlify form, as a repo path."""
    targets = set()
    for path in sorted(root.rglob("*.html")):
        if ".git" in path.parts or "node_modules" in path.parts:
            continue
        html = io.open(path, encoding="utf-8").read()
        for tag in form_blocks(html):
            if not NAMED.search(tag):
                continue
            m = ACTION.search(tag)
            if not m:
                continue
            target = m.group(1).split("?")[0].split("#")[0]
            if not target or target.startswith("http"):
                continue
            # Normalize: leading slash is repo root, extensionless gets .html,
            # and a bare relative target resolves against the page's directory.
            if target.startswith("/"):
                rel = target.lstrip("/")
            else:
                rel = str(path.parent.relative_to(root) / target).lstrip("./")
            if not rel.endswith(".html"):
                rel += ".html"
            if (root / rel).exists():
                targets.add(rel)
    return targets


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--path", default=".")
    ap.add_argument("--apply", action="store_true")
    args = ap.parse_args()

    root = Path(args.path)
    thanks = thank_you_targets(root)

    patched, present, problems = [], [], []
    forms_seen = 0

    for path in sorted(root.rglob("*.html")):
        if ".git" in path.parts or "node_modules" in path.parts:
            continue
        rel = str(path.relative_to(root))
        html = io.open(path, encoding="utf-8").read()

        named_forms = [t for t in form_blocks(html) if NAMED.search(t)]
        is_form = bool(named_forms)
        is_thanks = rel in thanks
        if not (is_form or is_thanks):
            continue

        forms_seen += len(named_forms)
        role = "form + thank-you" if (is_form and is_thanks) else (
            "form" if is_form else "thank-you")

        if GUARD in html:
            present.append(rel)
            continue
        if html.count(ANCHOR) != 1:
            problems.append((rel, "anchor=%d" % html.count(ANCHOR)))
            continue

        patched.append((rel, role))
        if args.apply:
            out = html.replace(ANCHOR, TAG + "\n" + ANCHOR, 1)
            io.open(path, "w", encoding="utf-8").write(out)

    mode = "APPLIED" if args.apply else "DRY RUN (no files written)"
    print("lead-events sweep - %s" % mode)
    print("  %d pages tagged, %d already loaded the script" % (len(patched), len(present)))
    print("  %d pages could not be tagged" % len(problems))
    print("  named Netlify forms in scope: %d" % forms_seen)
    print("  thank-you destinations found: %d (%s)"
          % (len(thanks), ", ".join(sorted(thanks))))

    for rel, why in problems:
        print("\n  %s  [SKIPPED - %s]" % (rel, why))

    if not args.apply:
        for rel, role in patched:
            print("\n  %s" % rel)
            print("    + lead-events.js   (%s)" % role)

    # A page in scope without the anchor is real drift, not a routine skip.
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main())
