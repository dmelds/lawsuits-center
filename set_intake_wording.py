#!/usr/bin/env python3
"""Replace the platform wording on the intake pages with the attorney-practice wording.

Phase 1 of the Rule 1.5.1 / B&P 6155 alignment (10/12/26): Lawsuit Center is described
everywhere as the intake and referral practice of David Meldofsky, a California attorney,
who refers each case review request to a participating law firm. The footer, the
how-case-review-works page and the disclosure pages were rewritten by hand; the 35 intake
pages share a handful of sentences built from the same donors, and this sweep rewrites
those sentences wherever they appear, on any page.

Each rule is an exact sentence (whitespace ignored, so a sentence wrapped across lines in
the source still matches). A page is touched only where a rule matches, so unknown wording
is left alone. A page already on the new wording matches nothing and is skipped, so this is
safe to rerun and safe to schedule. The replacement is written on one line at the position
of the old sentence.

If a rule's new text ever needs to change, add a rule from the current new text to the
newer text; never edit a rule in place, or pages already swept are left behind.

Usage
-----
    python3 set_intake_wording.py
    python3 set_intake_wording.py --apply

Options
-------
    --path DIR   directory to scan (default .)
    --apply      write changes; without it the script only reports
"""

import argparse
import html as htmlmod
import os
import re

PRACTICE = "Lawsuit Center is the intake and referral practice of David Meldofsky, a California attorney"

RULES = [
    # Form fineprint under the submit button (30 pages).
    ("fineprint",
     "Created by a California-licensed attorney. Your submission may be reviewed by participating legal professionals, legal advertisers, or intake partners where available. A submission does not guarantee eligibility, compensation, contact, or representation.",
     "Created by David Meldofsky, a California-licensed attorney, who refers your request to participating law firms. A submission does not guarantee eligibility, compensation, contact, or representation."),
    ("fineprint-es",
     "Creado por un abogado con licencia de California. Su envío puede ser revisado por profesionales legales participantes, anunciantes legales o proveedores de admisión donde estén disponibles. Un envío no garantiza elegibilidad, compensación, contacto ni representación.",
     "Creado por David Meldofsky, abogado con licencia de California, quien refiere su solicitud a firmas de abogados participantes. Un envío no garantiza elegibilidad, compensación, contacto ni representación."),
    # TCPA fineprint on the five pages that carry it in prose.
    ("consent-prose",
     "By submitting, you consent to contact by Lawsuit Center and participating law firms, legal advertisers, or intake partners — including by autodialed calls, prerecorded messages, and text messages.",
     "By submitting, you consent to contact by Lawsuit Center and participating law firms, including by autodialed calls, prerecorded messages, and text messages."),
    # TCPA consent checkbox label (35 pages).
    ("consent-label",
     "I consent to being contacted by Lawsuit Center, participating law firms, legal advertisers, or intake partners by phone, including autodialed calls and prerecorded voice messages, email, or text message about my case review request.",
     "I consent to being contacted by Lawsuit Center and participating law firms by phone, including autodialed calls and prerecorded voice messages, email, or text message about my case review request."),
    ("consent-label-understand",
     "I understand Lawsuit Center is not a law firm and does not represent me.",
     "I understand that submitting this request does not make me a client of David Meldofsky or of any law firm."),
    # Hero legal note, long form (30 pages).
    ("legal-long",
     "Lawsuit Center is not a law firm and does not provide legal advice. Submitting information through this website does not create an attorney-client relationship and does not guarantee that you qualify for a claim, that compensation will be available, or that any attorney or law firm will offer representation.",
     PRACTICE + ", and provides no legal advice through this site. Submitting information creates no attorney-client relationship. It does not guarantee that you qualify for a claim, that compensation will be available, or that any law firm will offer representation."),
    # Legal note, short form (21 pages, some with a trailing topic sentence that stays).
    ("legal-short",
     "Lawsuit Center is not a law firm and does not provide legal advice. Submitting information does not guarantee eligibility, compensation, contact, or representation.",
     PRACTICE + ", and provides no legal advice through this site. Submitting information does not guarantee eligibility, compensation, contact, or representation."),
    # thank-you legal note.
    ("legal-thankyou",
     "Lawsuit Center is not a law firm and does not provide legal advice. Submitting information does not create an attorney-client relationship.",
     PRACTICE + ", and provides no legal advice through this site. Submitting information creates no attorney-client relationship."),
    # "What happens next" on the intake pages (25 pages).
    ("follow-up",
     "If there appears to be a possible fit, a participating law firm, legal advertiser, intake provider, or other partner may contact you to ask for more information.",
     "If there appears to be a possible fit, David refers your request to a participating law firm, and that firm may contact you to ask for more information."),
    # Form intros (23 pages, three openings).
    ("intro-situation",
     "Contact information is requested so someone can follow up if your submission appears to match an available review path.",
     "Contact information is requested so the firm David refers your request to can follow up."),
    # Section intros on a few pages.
    ("intro-reviewed",
     "Your submission may be reviewed by participating legal professionals, legal advertisers, or intake partners where available.",
     "David Meldofsky refers your request to participating law firms where a firm handles your category and state."),
    # index.html step 2 and the privacy policy sharing sentence.
    ("index-step",
     "If a participating firm has active intake for that category, your information may be shared with them under the terms in our privacy policy.",
     "David Meldofsky, the California attorney behind Lawsuit Center, refers your request to a participating firm with active intake for that category and your state, under the terms in our privacy policy."),
    ("index-step-title", "We match your category.", "David refers your request."),
    # One-off sentences on topical and case pages.
    ("reviews-handled", "Reviews are handled by participating legal professionals and intake partners.",
     "David Meldofsky, a California attorney, refers each request to a participating law firm."),
    ("morales", "You can request a free, confidential case review from participating legal professionals and intake partners.",
     "You can request a free, confidential case review. David Meldofsky, a California attorney, refers it to a participating law firm."),
    ("meso-that-may-be", "That may be a participating law firm, legal advertiser, intake provider, or other partner.",
     "That is the participating law firm David refers your request to."),
    ("ozempic-vision-hear", "If your situation may fit, you may hear from a law firm, a legal advertiser, an intake provider or another partner.",
     "If your situation may fit, you hear from the participating law firm David refers your request to."),
    ("paraquat-submissions", "Case review submissions for paraquat claims may be reviewed by participating law firms, legal advertisers, or intake partners where available.",
     "David Meldofsky, a California attorney, refers paraquat case review requests to participating law firms where a firm handles them."),
    ("peritoneal-follow", "When there may be a match, someone follows up, whether a law firm, a legal advertiser, an intake provider or another partner.",
     "When there may be a match, the participating law firm David refers your request to follows up."),
    ("pfas-contact", "If it might, a law firm, legal advertiser, intake provider or other partner may contact you for more detail.",
     "If it might, the participating law firm David refers your request to may contact you for more detail."),
    ("pleural-contact", "If it may fit, a law firm, legal advertiser, intake provider or other partner may reach out for more detail.",
     "If it may fit, the participating law firm David refers your request to may reach out for more detail."),
    ("upf-checker", "Your information may be reviewed to understand whether it relates to the ultra-processed food cases currently being filed, and a participating law firm, legal advertiser, or intake provider may contact you to ask for more information.",
     "Your information is used to match your request to the ultra-processed food cases being filed. David Meldofsky refers it to a participating law firm, which may contact you to ask for more information."),
    ("product-liability", "Information submitted through Lawsuit Center may be reviewed by participating law firms, legal advertisers, intake providers, or other partners connected to the relevant claim category.",
     "Information submitted through Lawsuit Center is referred by David Meldofsky, a California attorney, to participating law firms connected to the relevant claim category."),
    ("afff-label", "I understand that Lawsuit Center is not a law firm and that submitting this form does not create an attorney-client relationship.",
     "I understand that submitting this form does not make me a client of David Meldofsky or of any law firm."),
    ("ad-disclosure-accept", "Lawsuit Center is not a law firm and doesn't accept clients or sign cases.",
     PRACTICE + ". Participating law firms accept clients and sign cases."),
    ("index-isnt", "Lawsuit Center isn't a law firm.", PRACTICE + "."),
    ("index-doesnt", "Lawsuit Center is not a law firm and doesn't provide legal advice.", PRACTICE + ", and provides no legal advice through this site."),
    ("contact-comma", "Lawsuit Center is not a law firm, does not provide legal advice,",
     PRACTICE + ". It provides no legal advice through this site,"),
    ("about-shared", "When a visitor submits information, it may be shared with a participating law firm that has active intake in that category, under the terms in our privacy policy.",
     "When a visitor submits information, David Meldofsky refers it to a participating law firm that has active intake in that category and state, under the terms in our privacy policy."),
    ("ad-disclosure-shared", "If you submit information through Lawsuit Center, it may be shared with a participating law firm that has active intake in the relevant lawsuit category, under the terms in our privacy policy.",
     "If you submit information through Lawsuit Center, David Meldofsky refers it to a participating law firm that has active intake in the relevant lawsuit category and your state, under the terms in our privacy policy."),
    ("case-review-shared", "If your situation matches an active lawsuit category, your information may be shared with a participating law firm that has active intake in that category.",
     "If your situation matches an active lawsuit category, David Meldofsky refers your request to a participating law firm that has active intake in that category and your state."),
    ("privacy-sharing",
     "Information you submit through a case review or contact form may be shared with participating law firms that have active intake in the relevant lawsuit category, with third-party intake providers, or with legal advertisers, depending on the claim category and availability.",
     "Information you submit through a case review form is referred by David Meldofsky, a California attorney, to participating law firms that have active intake in the relevant lawsuit category and your state. Contact-form messages stay with Lawsuit Center unless you ask us to pass them on."),
]


def pattern(text):
    # Exact sentence, any run of whitespace in the source matching one space here. The
    # source may hold the em dash and apostrophes either literally or as entities.
    parts = []
    for ch in text:
        if ch == " ":
            parts.append(r"\s+")
        elif ch == "—":
            parts.append(r"(?:—|&mdash;)")
        elif ch == "'":
            parts.append(r"(?:'|&#39;|&rsquo;)")
        else:
            parts.append(re.escape(ch))
    return re.compile("".join(parts))


COMPILED = [(name, pattern(old), new) for name, old, new in RULES]

# Patterns with a variable middle. Applied after the exact rules. Each is a compiled regex
# and its replacement; the replacement may use groups.
GENERIC = [
    # "Your information may be reviewed to understand whether it relates to <topic> ... sponsored
    # case-review path, or possible law firm follow-up." on the intake pages.
    ("reviewed-to-understand",
     re.compile(r"Your\s+information\s+may\s+be\s+reviewed\s+to\s+understand\s+whether\s+it\s+relates\s+to\s[^.]{0,400}?law\s+firm\s+follow-up\."),
     "Your information is used to match your request to an active lawsuit category and to a participating law firm in your state."),
    # "Lawsuit Center is not a law firm and does not <rest>." on category pages, keeping <rest>.
    ("not-a-law-firm-and",
     re.compile(r"Lawsuit\s+Center\s+is\s+not\s+a\s+law\s+firm\s+and\s+does\s+not\s"),
     PRACTICE + ", and does not "),
    # Bare "Lawsuit Center is not a law firm." in CTA notes.
    ("not-a-law-firm-bare",
     re.compile(r"Lawsuit\s+Center\s+is\s+not\s+a\s+law\s+firm\."),
     PRACTICE + "."),
]


def sweep(html):
    notes = []
    for name, rx, new in COMPILED:
        html, n = rx.subn(lambda m: new, html)
        if n:
            notes.append(f"{name} x{n}")
    for name, rx, new in GENERIC:
        html, n = rx.subn(new, html)
        if n:
            notes.append(f"{name} x{n}")
    return html, notes


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--path", default=".")
    ap.add_argument("--apply", action="store_true")
    args = ap.parse_args()

    changed, totals = [], {}
    for root, dirs, files in os.walk(args.path):
        dirs[:] = [d for d in dirs if not d.startswith(".") and d != "node_modules"]
        for fn in sorted(files):
            if not fn.endswith(".html"):
                continue
            p = os.path.join(root, fn)
            rel = os.path.relpath(p, args.path)
            with open(p, encoding="utf-8") as fh:
                html = fh.read()
            new, notes = sweep(html)
            if new == html:
                continue
            for n in notes:
                k = n.split(" x")[0]
                totals[k] = totals.get(k, 0) + int(n.split(" x")[1])
            changed.append((rel, notes))
            if args.apply:
                with open(p, "w", encoding="utf-8") as fh:
                    fh.write(new)

    verb = "changed" if args.apply else "would change"
    print(f"{len(changed):3d} pages {verb}")
    print()
    for k in sorted(totals):
        print(f"  {k}: {totals[k]} replacements")
    print()
    for rel, notes in changed:
        print(f"  {rel}: {', '.join(notes)}")


if __name__ == "__main__":
    main()
