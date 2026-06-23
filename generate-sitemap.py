#!/usr/bin/env python3
"""
Generate sitemap.xml for lawsuit.center.
- Extensionless URLs to match canonicals (homepage = "/").
- Excludes the JS-fetched footer fragment, noindex pages, thank-you/utility pages,
  and any URL that 301-redirects to a different slug.
- lastmod from each file's last git commit date (falls back to file mtime, then today).
Runs in CI (GitHub Actions), where full git history is available.
"""

import os
import re
import glob
import subprocess
from datetime import date, datetime, timezone

BASE = "https://lawsuit.center"

# Never list these: footer is a fetch() fragment; the rest are noindex/utility.
EXCLUDE_FILES = {
    "footer.html",          # injected via fetch('/footer.html') — must stay a 200 fragment, not a page
    "search.html",          # noindex search UI
    "thank-you.html",
    "thank-you-asbestos-review.html",
    "thank-you-truck-accident-review.html",
    "404.html",
}


def slug_for(filename):
    s = re.sub(r"\.html?$", "", filename).strip("/")
    return "" if s == "index" else s


def is_noindex(path):
    try:
        with open(path, encoding="utf-8", errors="ignore") as f:
            return bool(re.search(r'name=["\']robots["\'][^>]*noindex', f.read(), re.I))
    except OSError:
        return False


def redirected_away():
    """Slugs that 301 to a DIFFERENT slug — never list these (here: none, redirects are .html->same slug)."""
    away = set()
    if not os.path.exists("_redirects"):
        return away
    with open("_redirects", encoding="utf-8", errors="ignore") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            parts = line.split()
            if len(parts) >= 3 and not parts[1].startswith("http"):
                a = re.sub(r"\.html?$", "", parts[0].split("?")[0].strip("/"))
                b = re.sub(r"\.html?$", "", parts[1].split("?")[0].strip("/"))
                if a and a != b:
                    away.add(a)
    return away


def git_lastmod(path):
    try:
        out = subprocess.run(
            ["git", "log", "-1", "--format=%cs", "--", path],
            capture_output=True, text=True, check=True,
        ).stdout.strip()
        if out:
            return out
    except (subprocess.CalledProcessError, FileNotFoundError):
        pass
    try:
        return datetime.fromtimestamp(os.path.getmtime(path), timezone.utc).strftime("%Y-%m-%d")
    except OSError:
        return date.today().isoformat()


def main():
    away = redirected_away()
    urls = []
    for path in sorted(glob.glob("*.html")):
        fn = os.path.basename(path)
        if fn in EXCLUDE_FILES or is_noindex(path):
            continue
        slug = slug_for(fn)
        if slug in away:
            continue
        loc = f"{BASE}/{slug}" if slug else f"{BASE}/"
        urls.append((loc, git_lastmod(path)))

    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]
    for loc, lastmod in urls:
        lines.append(f"  <url><loc>{loc}</loc><lastmod>{lastmod}</lastmod></url>")
    lines.append("</urlset>")

    with open("sitemap.xml", "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")

    print(f"Wrote sitemap.xml with {len(urls)} URLs.")


if __name__ == "__main__":
    main()
