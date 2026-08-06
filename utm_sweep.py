#!/usr/bin/env python3
"""Normalize cross-property UTM tags on in-content links.

Two problems this fixes.

1. utm_medium values like article, sticky, intent, redirect and checker are not
   values GA4 recognizes, so every tagged cross-property click is bucketed as
   Unassigned instead of Referral. The placement detail already lives in
   utm_content, so the medium can safely become referral and the old value is
   preserved into utm_content when that parameter is missing.

2. Most in-content links to the partner property carry no UTM at all, so the
   handoff is invisible in GA4 either way.

Only in-content anchors are touched. Anything inside <head>, <nav>, <footer>,
<script>, <style> or an HTML comment is left alone, because tagging navigation
and footer links fires a campaign on every page view and buries real referrals.

A URL whose query string sits after the fragment (path#anchor?utm_source=...)
is reported and skipped rather than rewritten. Those parameters are inside the
fragment, so they never reach the server and no analytics tool has ever seen
them; appending a second, valid set in front of the fragment produces a URL
carrying two contradictory campaigns. Fix the source link by hand, then rerun.

Usage
-----
    python3 utm_sweep.py --source lawsuitinformer --partner lawsuit.center
    python3 utm_sweep.py --source lawsuitinformer --partner lawsuit.center --apply

Options
-------
    --campaign NAME   utm_campaign for links that had no tags (default cross_property)
    --path DIR        directory to scan (default .)
    --apply           write changes; without it the script only reports
"""
import argparse
import re
import sys
from pathlib import Path
from urllib.parse import urlsplit, urlunsplit

# Mediums GA4 maps to a real channel on its own.
GA4_MEDIUMS = {"referral", "organic", "cpc", "email", "social", "affiliate",
               "display", "banner", "paid_social", "paid_search", "video", "audio"}
TARGET_MEDIUM = "referral"

SKIP_BLOCKS = re.compile(
    r"<nav\b.*?</nav>|<footer\b.*?</footer>|<script\b.*?</script>"
    r"|<style\b.*?</style>|<!--.*?-->",
    re.S | re.I,
)
HEAD_END = re.compile(r"</head\s*>", re.I)
ANCHOR = re.compile(r'
