#!/usr/bin/env python3
"""
perf_head.py — sitewide render-blocking CSS fix for lawsuit.center

What it does, per HTML page:
  1. Extracts "critical" (above-the-fold) rules from style.css and inlines
     them in a <style> block in <head>, wrapped in marker comments.
  2. Replaces the render-blocking <link rel="stylesheet" href="style.css">
     with an async preload-swap loader (+ <noscript> fallback).
  3. Standardizes font preloads (Fraunces 500 + IBM Plex Sans 400).
Plus:
  4. Injects explicit width/height attributes on local <img> tags that
     lack them (reads actual PNG/JPEG dimensions; zero dependencies).
  5. Creates/extends _headers with long-cache rules for fonts/images.
Pages with no style.css reference (the self-contained case-review and
checker pages) are skipped untouched.

Idempotent: re-running replaces the critical block with a fresh extraction
from the current style.css, so this doubles as a maintenance task after
stylesheet edits. Run with --dry-run to preview.
"""

import re
import sys
from pathlib import Path

ROOT = Path(__file__).parent
DRY = "--dry-run" in sys.argv

MARK_START = "<!-- perf:critical-css:start -->"
MARK_END = "<!-- perf:critical-css:end -->"
MARK_HEADERS = "# perf:cache-policy"

# ---------------------------------------------------------------- CSS parse

def parse_blocks(css: str):
    """Yield (prelude, body) for each top-level rule. Handles nesting."""
    i, n = 0, len(css)
    while i < n:
        # skip whitespace
        while i < n and css[i].isspace():
            i += 1
        # skip comments
        if css.startswith("/*", i):
            end = css.find("*/", i + 2)
            i = n if end == -1 else end + 2
            continue
        if i >= n:
            break
        brace = css.find("{", i)
        if brace == -1:
            break
        prelude = css[i:brace].strip()
        depth, j = 1, brace + 1
        while j < n and depth:
            c = css[j]
            if c == "{":
                depth += 1
            elif c == "}":
                depth -= 1
            elif css.startswith("/*", j):
                end = css.find("*/", j + 2)
                j = n - 1 if end == -1 else end + 1
            j += 1
        yield prelude, css[brace + 1 : j - 1]
        i = j


def strip_comments(css: str) -> str:
    return re.sub(r"/\*.*?\*/", "", css, flags=re.S)


def minify(css: str) -> str:
    css = strip_comments(css)
    css = re.sub(r"\s+", " ", css)
    for a, b in (("; ", ";"), (" ;", ";"), ("{ ", "{"), (" {", "{"),
                 ("} ", "}"), (" }", "}"), (": ", ":"), (", ", ","),
                 (";}", "}")):
        css = css.replace(a, b)
    return css.strip()


# Exact-match base selectors (normalized whitespace).
BASE = {
    "*, *::before, *::after", "*", "html, body", "html", "body", "img",
    "a", "a:hover", "ul, ol", "button, input, textarea, select",
    "::selection", ":focus-visible",
}

# Substring tokens: a rule is critical if its selector contains any of these.
TOKENS = [
    ".sr-only", ".skip-link", ".container",
    ".site-header", ".brand", ".logo", ".nav", ".menu-toggle",
    ".btn", ".eyebrow",
    ".hero", ".cats", ".cat",
    ".page-hero", ".breadcrumb", ".jump-nav", ".info-strip",
    ".dir-", ".card",
]


def selector_is_critical(sel: str) -> bool:
    s = re.sub(r"\s+", " ", sel).strip()
    if s in BASE:
        return True
    return any(t in s for t in TOKENS)


def extract_critical(css_text: str) -> str:
    out = []
    for prelude, body in parse_blocks(strip_comments(css_text)):
        if prelude.startswith("@font-face"):
            out.append(f"{prelude}{{{body}}}")
        elif prelude.startswith("@media"):
            inner = [
                f"{p}{{{b}}}"
                for p, b in parse_blocks(body)
                if selector_is_critical(p)
            ]
            if inner:
                out.append(f"{prelude}{{{''.join(inner)}}}")
        elif prelude.startswith("@"):
            continue  # other at-rules: skip
        elif prelude == ":root" or selector_is_critical(prelude):
            out.append(f"{prelude}{{{body}}}")
    return minify("".join(out))


# ---------------------------------------------------------------- head block

def build_head_block(critical: str) -> str:
    return f"""{MARK_START}
<style id="critical-css">{critical}</style>
<link rel="preload" href="/fonts/fraunces-v38-latin-500.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/ibm-plex-sans-v23-latin-regular.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/style.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="/style.css"></noscript>
{MARK_END}"""


RX_STYLESHEET = re.compile(
    r'[ \t]*<link\s+rel="stylesheet"\s+href="/?style\.css"\s*/?>\s*\n?'
)
RX_FRAUNCES_PRELOAD = re.compile(
    r'[ \t]*<link\s+rel="preload"\s+href="/fonts/fraunces-v38-latin-500\.woff2"[^>]*>\s*\n?'
)
RX_VIEWPORT_LINE = re.compile(r'^.*name="viewport".*$', re.M)

def transform_page(path: Path, head_block: str) -> str:
    html = path.read_text(encoding="utf-8")
    status = []

    if MARK_START in html and MARK_END in html:
        # Refresh existing block in place.
        html = re.sub(
            re.escape(MARK_START) + r".*?" + re.escape(MARK_END),
            head_block, html, count=1, flags=re.S,
        )
        status.append("refreshed critical block")
    else:
        n_css = len(RX_STYLESHEET.findall(html))
        if n_css == 0:
            # Self-contained page (inline styles, no external stylesheet).
            # Injecting style.css here would change its rendering — skip.
            add_img_dimensions(path, html, status)
            print(f"{path.name}: skipped (self-contained){'; ' + '; '.join(status) if status else ''}")
            return html
        html = RX_STYLESHEET.sub("", html)
        html = RX_FRAUNCES_PRELOAD.sub("", html)
        m = RX_VIEWPORT_LINE.search(html)
        if m:
            html = html[: m.end()] + "\n" + head_block + html[m.end():]
        else:
            html = html.replace("<head>", "<head>\n" + head_block, 1)
            status.append("no viewport meta; inserted after <head>")
        status.append("inlined critical css + async loader")

    add_img_dimensions_inplace = add_img_dimensions(path, html, status)
    if add_img_dimensions_inplace is not None:
        html = add_img_dimensions_inplace

    if not DRY:
        path.write_text(html, encoding="utf-8")
    print(f"{path.name}: {'; '.join(status)}")
    return html


# ------------------------------------------------------- image dimensions

def png_size(p: Path):
    with open(p, "rb") as f:
        head = f.read(26)
    if head[:8] != b"\x89PNG\r\n\x1a\n":
        return None
    import struct
    return struct.unpack(">II", head[16:24])


def jpeg_size(p: Path):
    with open(p, "rb") as f:
        data = f.read()
    if data[:2] != b"\xff\xd8":
        return None
    i = 2
    while i < len(data) - 9:
        if data[i] != 0xFF:
            i += 1
            continue
        marker = data[i + 1]
        if 0xC0 <= marker <= 0xCF and marker not in (0xC4, 0xC8, 0xCC):
            h = int.from_bytes(data[i + 5 : i + 7], "big")
            w = int.from_bytes(data[i + 7 : i + 9], "big")
            return (w, h)
        seg_len = int.from_bytes(data[i + 2 : i + 4], "big")
        i += 2 + seg_len
    return None


def image_size(p: Path):
    ext = p.suffix.lower()
    if ext == ".png":
        return png_size(p)
    if ext in (".jpg", ".jpeg"):
        return jpeg_size(p)
    return None


RX_IMG = re.compile(r"<img\b[^>]*>", re.I)


def add_img_dimensions(path: Path, html: str, status: list):
    """Add width/height to local <img> tags missing them. Returns new html
    (and writes it for the skip path) or None if nothing changed."""
    changed = 0

    def fix(m):
        nonlocal changed
        tag = m.group(0)
        if re.search(r"\bwidth\s*=", tag, re.I):
            return tag
        srcm = re.search(r'src="([^"]+)"', tag)
        if not srcm:
            return tag
        src = srcm.group(1)
        if src.startswith(("http:", "https:", "//", "data:")):
            return tag
        local = ROOT / src.lstrip("/")
        if not local.exists():
            return tag
        dims = image_size(local)
        if not dims:
            return tag
        w, h = dims
        changed += 1
        attrs = f' width="{w}" height="{h}"'
        return tag[:-2] + attrs + " />" if tag.endswith("/>") else tag[:-1] + attrs + ">"

    new_html = RX_IMG.sub(fix, html)
    if changed:
        status.append(f"added dimensions to {changed} img tag(s)")
        if not DRY:
            path.write_text(new_html, encoding="utf-8")
        return new_html
    return None


def update_headers_file():
    hp = ROOT / "_headers"
    text = hp.read_text(encoding="utf-8") if hp.exists() else ""
    if MARK_HEADERS in text:
        print("_headers: cache policy already present")
        return
    block = f"""

{MARK_HEADERS}
/fonts/*
  Cache-Control: public, max-age=31536000, immutable
/*.png
  Cache-Control: public, max-age=604800
/*.jpg
  Cache-Control: public, max-age=604800
/*.ico
  Cache-Control: public, max-age=604800
/*.webmanifest
  Cache-Control: public, max-age=604800
"""
    if not DRY:
        hp.write_text(text.rstrip("\n") + block, encoding="utf-8")
    print("_headers: appended cache policy")


def main():
    css_path = ROOT / "style.css"
    critical = extract_critical(css_path.read_text(encoding="utf-8"))
    kb = len(critical) / 1024
    print(f"critical css: {kb:.1f} KB minified ({len(critical)} chars)")
    if kb > 16:
        print("WARN: critical block is large; consider trimming TOKENS")

    head_block = build_head_block(critical)
    pages = sorted(ROOT.glob("*.html")) + sorted(ROOT.glob("es/*.html"))
    print(f"transforming {len(pages)} pages{' (dry run)' if DRY else ''}\n")
    for p in pages:
        transform_page(p, head_block)
    update_headers_file()
    print("\ndone.")


if __name__ == "__main__":
    main()
