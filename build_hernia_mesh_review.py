#!/usr/bin/env python3
"""Build lawsuit.center/hernia-mesh-case-review from the existing template.

Why this page
-------------
/hernia-mesh-lawsuit on Lawsuit Informer is the best-engaging page on the
network: 44 of 53 sessions clear ten seconds, averaging 141 seconds, driven
almost entirely by Bing. Its CTA currently points at consumer-product-case-review,
a generic bucket, because Center has no hernia mesh review page. Bing queries
reaching that page are specific and claimant-shaped -- "bard hernia mesh
settlement updates as of august 2026", "three revision surgeries mesh
settlements update", "covidien hernia mesh lawsuit update".

How it works
------------
talcum-powder-case-review.html is used as the structural donor: it is the
closest analog (product + injury + diagnosis-year field) and carries the same
perf_head critical-CSS scaffolding every Center page has. The script swaps the
<main> block wholesale and rewrites the page-specific head tags. Everything
else -- inlined CSS, dark-mode init, nav, footer, script tags -- is inherited
byte-for-byte, so the new page cannot drift from the template's scaffolding.

Facts in the copy below are taken from lawsuitinformer.com/hernia-mesh-lawsuit
and /hernia-mesh-products as published, not from independent research:
MDL 2846 (Bard/Davol, S.D. Ohio, Judge Sargus); MDL 3029 (Covidien, D. Mass,
Judge Saris); MDL 2753 (Atrium C-QUR, largely resolved); Ethicon Physiomesh
substantially resolved. Verify these still hold before publishing.

The `revision-surgeries` field replaces the donor's `diagnosis-year`. That is a
deliberate change, not a port: revision surgery count is the fact claimants
volunteer unprompted in the Bing queries, and it is the fact that most affects
whether a mesh claim is worth reviewing.

Usage
-----
    python3 build_hernia_mesh_review.py            # dry run, reports only
    python3 build_hernia_mesh_review.py --apply    # write the file

Run from the lawsuits-center repo root. Review the result before committing.
"""
import argparse
import re
import sys
from pathlib import Path

DONOR = "talcum-powder-case-review.html"
TARGET = "hernia-mesh-case-review.html"
SLUG = "hernia-mesh-case-review"
FORM = "hernia-mesh-case-review"

TITLE = "Hernia Mesh Case Review | Lawsuit Center"
DESCRIPTION = (
    "Hernia mesh lawsuit case review. Submit details about mesh repair surgery, "
    "revision surgery, chronic pain, or infection. Free, no obligation."
)
OG_DESCRIPTION = (
    "Hernia mesh lawsuit case review. Submit details about hernia repair with mesh, "
    "revision or removal surgery, infection, bowel complications, or chronic pain, "
    "including Bard, Davol, Covidien, Ethicon, and Atrium products."
)
LD_NAME = "Hernia Mesh Lawsuit Case Review"
LD_DESC = "Request a hernia mesh lawsuit case review through Lawsuit Center."
CRUMB_PARENT_NAME = "Hernia Mesh Lawsuits"
CRUMB_PARENT_SLUG = "hernia-mesh-lawyers"
CRUMB_SELF = "Hernia Mesh Case Review"

INFORMER = "https://lawsuitinformer.com"
UTM = f"?utm_source=lawsuitcenter&amp;utm_medium=referral&amp;utm_campaign=cross_property&amp;utm_content={SLUG}"

MAIN = f"""<main id="main">
<nav class="breadcrumb" aria-label="Breadcrumb">
  <div class="container">
   <ol class="breadcrumb__list">
     <li><a href="/">Home</a></li>
     <li><a href="lawsuits">Browse Lawsuits</a></li>
     <li><a href="{CRUMB_PARENT_SLUG}">{CRUMB_PARENT_NAME}</a></li>
     <li aria-current="page">{CRUMB_SELF}</li>
   </ol>
  </div>
</nav>
<section class="page-hero">
  <div class="container container--narrow">
    <span class="eyebrow" style="display:inline-block; margin-bottom: 18px;">Hernia Mesh Lawsuit</span>
    <h1>Request a <em>hernia mesh</em> case review.</h1>
    <p class="lede">
      Tell us about a hernia repair involving surgical mesh and what happened afterward, including
      revision or removal surgery, infection, bowel complications, or chronic pain. Your submission may be
      reviewed by participating legal professionals, legal advertisers, or intake partners where available.
    </p>
    <div class="actions">
      <a href="#case-review-form" class="btn btn--amber btn--lg">Skip to Form &#8595;</a>
      <a href="{INFORMER}/hernia-mesh-lawsuit{UTM}" class="btn btn--ghost btn--lg">Read the Educational Guide</a>
    </div>
    <p class="meta">
      Free initial review &#183; No obligation &#183; No attorney-client relationship is formed by submitting this form.
    </p>
  </div>
</section>
<section class="legal-note">
  <div class="container container--narrow">
    <p>
      Lawsuit Center is not a law firm and does not provide legal advice. Submitting information
      does not guarantee eligibility, compensation, contact, or representation.
    </p>
  </div>
</section>
<section class="section">
  <div class="container container--narrow">
    <span class="eyebrow section__eyebrow">Who This Page May Help</span>
    <h2>Situations people often research.</h2>
    <p>
      Hernia mesh claims generally focus on a hernia repair that used surgical mesh, followed by
      complications that required further treatment. Most people do not know the brand or model of the mesh
      that was implanted, and that is normal. Operative reports and implant records usually identify it later.
      Basic information about roughly when the surgery happened and what went wrong afterward is enough to start.
    </p>
    <ul>
      <li>Hernia repair with mesh followed by revision, removal, or a second repair surgery</li>
      <li>Infection at the surgical site after a mesh hernia repair</li>
      <li>Bowel obstruction, perforation, adhesion, or fistula after mesh placement</li>
      <li>Chronic or ongoing pain at the repair site that began after mesh surgery</li>
      <li>Hernia recurrence after a repair that used mesh</li>
      <li>Mesh migration, shrinkage, erosion, or failure identified by a physician</li>
      <li>Implant records naming Bard, Davol, Covidien, Ethicon, Atrium, Gore, or TELA Bio products</li>
      <li>Still gathering operative reports and unsure whether the situation fits</li>
    </ul>
  </div>
</section>
<section id="case-review-form" class="section section--surface">
  <div class="container container--narrow">
    <span class="eyebrow section__eyebrow">Submit Your Information</span>
    <h2>Hernia mesh case review form.</h2>
    <p>
      Start with the situation that best fits, then briefly describe what happened.
      Contact information is requested so someone can follow up if your submission appears to match
      an available review path.
    </p>
<div class="form-card">
  <form
    name="{FORM}"
    method="POST"
    data-netlify="true"
    data-netlify-recaptcha="true"
    netlify-honeypot="bot-field"
    action="/thank-you.html"
    class="form"
  >
    <input type="hidden" name="form-name" value="{FORM}" />
    <p style="display:none;">
      <label>Do not fill this out if you are human: <input name="bot-field" /></label>
    </p>
    <div class="field">
      <label for="exposure-type" class="field-label">Situation that best fits</label>
      <select id="exposure-type" name="exposure-type" required>
        <option value="">Select what best fits</option>
        <option value="Revision or Removal Surgery">Hernia repair with mesh followed by revision, removal, or a second repair</option>
        <option value="Infection">Infection at the surgical site after a mesh hernia repair</option>
        <option value="Bowel Complication">Bowel obstruction, perforation, adhesion, or fistula after mesh placement</option>
        <option value="Chronic Pain">Chronic or ongoing pain at the repair site that began after mesh surgery</option>
        <option value="Recurrence">Hernia came back after a repair that used mesh</option>
        <option value="Mesh Failure">Mesh migration, shrinkage, erosion, or failure identified by a physician</option>
        <option value="Known Product">Records name a specific mesh product or manufacturer</option>
        <option value="Loved One Affected">Loved one had complications after a mesh hernia repair</option>
        <option value="Not Sure">Not sure / still gathering records</option>
      </select>
    </div>
    <div class="field">
      <label for="summary" class="field-label">Briefly describe what happened</label>
      <p id="summary-note" class="form-note">
        Roughly when was the original hernia repair, and what kind of hernia was it? What complications
        developed, and roughly when? If there were further surgeries, how many and when?
      </p>
      <textarea id="summary" name="summary" rows="7" aria-describedby="summary-note summary-warning" required></textarea>
      <p id="summary-warning" class="form-note">
        Please do not include Social Security numbers, financial account numbers, full medical
        records, or highly sensitive personal information.
      </p>
    </div>
    <div class="field">
      <label for="exposure-period" class="field-label">Approximate date of the original mesh surgery</label>
      <input type="text" id="exposure-period" name="exposure-period" placeholder="e.g. March 2017" aria-describedby="exposure-note" />
      <p id="exposure-note" class="form-note">
        Approximate is fine. The implant date is often what identifies which mesh product was used.
      </p>
    </div>
    <div class="field">
      <label for="revision-surgeries" class="field-label">Number of revision or removal surgeries (if any)</label>
      <input type="text" id="revision-surgeries" name="revision-surgeries" placeholder="e.g. 2" aria-describedby="revision-note" />
      <p id="revision-note" class="form-note">
        Revision history is often a key factor in these claims. Include roughly when each took place if you can.
      </p>
    </div>
    <div class="field">
      <label for="state" class="field-label">State</label>
      <input type="text" id="state" name="state" autocomplete="address-level1" aria-describedby="state-note" required />
      <p id="state-note" class="form-note">
        Your state helps identify whether location-specific deadlines, claim rules, or review options may apply.
      </p>
    </div>
    <div class="field">
      <label for="name" class="field-label">Name</label>
      <input type="text" id="name" name="name" autocomplete="name" required />
    </div>
    <div class="field">
      <label for="email" class="field-label">Email</label>
      <input type="email" id="email" name="email" autocomplete="email" required />
    </div>
    <div class="field">
      <label for="phone" class="field-label">Phone</label>
      <input type="tel" id="phone" name="phone" autocomplete="tel" aria-describedby="phone-note" required />
      <p id="phone-note" class="form-note">For follow-up about your case review request.</p>
    </div>
    <label class="checkbox-row">
      <input type="checkbox" name="legal-understanding" value="yes" required />
      <span>
        I understand that Lawsuit Center is not a law firm and that submitting this form
        does not create an attorney-client relationship.
      </span>
    </label>
    <label class="checkbox-row">
      <input type="checkbox" name="contact-consent" value="yes" required />
      <span>
        I consent to being contacted by Lawsuit Center, participating law firms, legal
        advertisers, or intake partners by phone, including autodialed calls and prerecorded
        voice messages, email, or text message about my case review request. Consent is not
        a condition of any service. Message and data rates may apply. Reply STOP to opt out.
      </span>
    </label>
    <div data-netlify-recaptcha="true"></div>
        <p class="form-note">Having trouble with the verification step above? You can also reach us through our <a href="contact" style="color:var(--amber-bright);">contact page</a> and we will follow up about your case review request.</p>
    <button type="submit">Submit Case Review Request</button>
    <p class="form-fineprint">
      Created by a California-licensed attorney. Your submission may be reviewed by
      participating legal professionals, legal advertisers, or intake partners where available.
      A submission does not guarantee eligibility, compensation, contact, or representation.
    </p>
  </form>
</div>
  </div>
</section>
<section class="section">
  <div class="container container--narrow">
    <span class="eyebrow section__eyebrow">After Submission</span>
    <h2>What happens next.</h2>
    <p>
      Your information may be reviewed to understand whether it relates to the hernia mesh
      lawsuit category, claim pattern, sponsored case-review path, or possible law firm follow-up.
    </p>
    <p>
      If there appears to be a possible fit, a participating law firm, legal advertiser, intake
      provider, or other partner may contact you to ask for more information.
    </p>
    <p>
      No attorney-client relationship is formed unless and until you sign an agreement directly
      with a law firm.
    </p>
    <div class="actions">
      <a href="how-case-review-works" class="btn btn--ghost">How Case Review Works</a>
      <a href="privacy-policy" class="btn btn--ghost">Privacy Policy</a>
    </div>
  </div>
</section>
<section class="section section--surface">
  <div class="container container--narrow">
    <span class="eyebrow section__eyebrow">Important Disclosures</span>
    <h2>Read this before submitting.</h2>
    <p>
      Lawsuit Center is not a law firm and does not provide legal advice. Submitting information
      through this website does not create an attorney-client relationship and does not guarantee
      that you qualify for a claim, that compensation will be available, or that any attorney or
      law firm will offer representation.
    </p>
    <p>
      Some pages may include attorney advertising, sponsored listings, paid law firm visibility,
      or referral-related opportunities. Sponsored visibility is advertising and should not be
      treated as a recommendation or endorsement of any attorney or law firm.
    </p>
    <p class="small-text">
      Legal deadlines for hernia mesh claims can vary by state and can be short, and separate mesh
      proceedings have moved on very different timelines. If you believe you may have a claim,
      consider speaking with a licensed attorney as soon as possible.
    </p>
    <div class="actions">
      <a href="advertising-disclosure" class="btn btn--ghost">Advertising Disclosure</a>
      <a href="disclaimer" class="btn btn--ghost">Disclaimer</a>
    </div>
  </div>
</section>
<section class="section related-topics-module">
  <div class="container">
    <div class="section__head section__head--left">
      <span class="eyebrow section__eyebrow">Related Topics</span>
      <h2>Continue exploring this category.</h2>
    </div>
    <div class="card-grid">
      <a href="consumer-product-case-review" class="card">
        <h3>Consumer Product Case Review</h3>
        <p>Submit information about an injury linked to a consumer or medical product for review.</p>
      </a>
      <a href="{CRUMB_PARENT_SLUG}" class="card">
        <h3>Hernia Mesh Lawyers</h3>
        <p>Background on how hernia mesh claims are evaluated and what records tend to matter.</p>
      </a>
      <a href="{INFORMER}/hernia-mesh-products{UTM}" class="card">
        <h3>Hernia Mesh Brands and Recall List</h3>
        <p>Read Lawsuit Informer's product reference for identifying which mesh was implanted.</p>
      </a>
      <a href="{INFORMER}/hernia-mesh-lawsuit{UTM}" class="card">
        <h3>Hernia Mesh Lawsuit Guide</h3>
        <p>Read Lawsuit Informer's background on the hernia mesh litigation and current status.</p>
      </a>
    </div>
  </div>
</section>
</main>"""

LABEL_MAP = """    var displayLabelMap = {
      "Revision or Removal Surgery": "hernia mesh revision surgery",
      "Infection": "hernia mesh infection",
      "Bowel Complication": "hernia mesh bowel complication",
      "Chronic Pain": "hernia mesh chronic pain",
      "Recurrence": "hernia mesh recurrence",
      "Mesh Failure": "hernia mesh failure",
      "Known Product": "hernia mesh product claim",
      "Loved One Affected": "hernia mesh complications",
      "Not Sure": "hernia mesh"
    };"""

HEAD_SWAPS = [
    (r"(?is)<title>.*?</title>", f"<title>{TITLE}</title>"),
    (r'(?is)(<meta\s+name="description"\s+content=")[^"]*(")', rf"\g<1>{DESCRIPTION}\g<2>"),
    (r'(?is)(<meta\s+property="og:title"\s+content=")[^"]*(")', rf"\g<1>{TITLE}\g<2>"),
    (r'(?is)(<meta\s+property="og:description"\s+content=")[^"]*(")', rf"\g<1>{OG_DESCRIPTION}\g<2>"),
    (r'(?is)(<meta\s+name="twitter:title"\s+content=")[^"]*(")', rf"\g<1>{TITLE}\g<2>"),
    (r'(?is)(<meta\s+name="twitter:description"\s+content=")[^"]*(")', rf"\g<1>{OG_DESCRIPTION}\g<2>"),
    (r'(?is)(<meta\s+property="og:url"\s+content="https://lawsuit\.center/)[^"]*(")', rf"\g<1>{SLUG}\g<2>"),
    (r'(?is)(<link\s+rel="canonical"\s+href="https://lawsuit\.center/)[^"]*(")', rf"\g<1>{SLUG}\g<2>"),
]


def build(root, apply_changes):
    donor = root / DONOR
    if not donor.exists():
        print(f"ERROR: donor template not found at {donor}")
        return 1
    text = donor.read_text(encoding="utf-8")

    # 1. swap the whole <main> block
    if not re.search(r"(?is)<main.*?</main>", text):
        print("ERROR: no <main> block in donor")
        return 1
    text = re.sub(r"(?is)<main.*?</main>", lambda _: MAIN, text, count=1)

    # 2. head tags
    for pat, rep in HEAD_SWAPS:
        text, n = re.subn(pat, rep, text, count=1)
        if n == 0:
            print(f"  WARNING: head pattern matched nothing -> {pat[:56]}")

    # 3. JSON-LD: ContactPage + BreadcrumbList
    text = text.replace('"name": "Talcum Powder Lawsuit Case Review"', f'"name": "{LD_NAME}"')
    text = text.replace(
        '"description": "Request a talcum powder lawsuit case review through Lawsuit Center."',
        f'"description": "{LD_DESC}"')
    text = text.replace('"name": "Talcum Powder Lawsuits"', f'"name": "{CRUMB_PARENT_NAME}"')
    text = text.replace('"name": "Talcum Powder Case Review"', f'"name": "{CRUMB_SELF}"')
    text = text.replace("https://lawsuit.center/talcum-powder-lawsuits",
                        f"https://lawsuit.center/{CRUMB_PARENT_SLUG}")
    text = text.replace("https://lawsuit.center/talcum-powder-case-review",
                        f"https://lawsuit.center/{SLUG}")

    # 4. the inline behaviour script sits OUTSIDE <main> and is topic-coupled:
    #    it selects the form by name and maps option values to the category label
    #    that thank-you.html reads out of sessionStorage. Swapping <main> alone
    #    leaves this pointing at a form that no longer exists, so the thank-you
    #    page silently loses its category. Rewrite all three coupled pieces.
    text = re.sub(r"(?s)    var displayLabelMap = \{.*?\n    \};", LABEL_MAP, text, count=1)
    text = text.replace('form[name="talcum-powder-case-review"]', f'form[name="{FORM}"]')
    text = text.replace('displayLabelMap[raw] || "talcum powder"',
                        'displayLabelMap[raw] || "hernia mesh"')

    # 5. anything left over from the donor topic is a bug -- surface it
    leftovers = sorted(set(re.findall(r"(?i)talc\w*|ovarian|shower to shower|johnson", text)))
    out = root / TARGET
    print(f"Build {TARGET} from {DONOR}")
    print(f"  size: {len(text):,} bytes")
    print(f"  form name: {FORM}")
    print(f"  leftover donor terms: {leftovers if leftovers else 'none'}")
    if leftovers:
        print("  ^ these must be zero before shipping; each is donor content that survived")
    if apply_changes:
        out.write_text(text, encoding="utf-8")
        print(f"  WROTE {out}")
    else:
        print("  dry run -- rerun with --apply to write")
    return 0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--path", default=".")
    ap.add_argument("--apply", action="store_true")
    args = ap.parse_args()
    return build(Path(args.path), args.apply)


if __name__ == "__main__":
    sys.exit(main())
