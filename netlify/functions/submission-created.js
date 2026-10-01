// Lawsuit Center. Copyright (c) 2026 David Meldofsky. All rights reserved.
// No license is granted to copy, modify or redistribute this code.
//
// Netlify runs this function itself on every VERIFIED form submission (reCAPTCHA and honeypot
// already passed) because of the filename. Nothing outside Netlify can call it: the platform
// signs the invocation. It does one thing: forward the submission to the Lead Desk.
//
// Netlify env vars (Site configuration > Environment variables, never in the repo):
//   DESK_INGEST_URL  e.g. https://desk.lawsuit.center/.netlify/functions/ingest
//   DESK_INGEST_KEY  the same value the desk holds as INGEST_KEY
//
// The submission is already stored in Netlify Forms before this runs, so a failure here loses
// nothing: the desk's sweep can re-pull by submission id. Three attempts with backoff cover a
// cold start or a deploy on the desk side.

const ATTEMPTS = 3;
const TIMEOUT_MS = 8000;
const WAIT_MS = [0, 1500, 4000];

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function post(url, key, body) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Ingest-Key": key },
      body,
      signal: ctrl.signal,
    });
    const text = await res.text().catch(() => "");
    return { status: res.status, text };
  } finally {
    clearTimeout(timer);
  }
}

exports.handler = async function (event) {
  let body;
  try { body = JSON.parse(event.body || "{}"); } catch (e) {
    console.error("submission-created: body is not JSON");
    return { statusCode: 200 };
  }
  // Netlify wraps the submission as { payload: {...} }. Forward the payload whole; the desk
  // normalizes it. Keeping this side dumb means a field added to a form needs no deploy here.
  const payload = body.payload || body;
  const url = process.env.DESK_INGEST_URL || "";
  const key = process.env.DESK_INGEST_KEY || "";
  const formName = payload.form_name || (payload.data && payload.data["form-name"]) || "?";
  const subId = payload.id || "?";

  if (!url || !key) {
    console.error(`submission-created: DESK_INGEST_URL or DESK_INGEST_KEY not set; form=${formName} id=${subId} not forwarded`);
    return { statusCode: 200 };
  }

  const out = JSON.stringify({ site: "lawsuit.center", payload });
  let last = null;
  for (let i = 0; i < ATTEMPTS; i++) {
    if (WAIT_MS[i]) await sleep(WAIT_MS[i]);
    try {
      last = await post(url, key, out);
      if (last.status >= 200 && last.status < 300) {
        console.log(`submission-created: forwarded form=${formName} id=${subId} attempt=${i + 1}`);
        return { statusCode: 200 };
      }
      // A 4xx is the desk refusing on purpose (bad key, bad body). Retrying will not change it.
      if (last.status >= 400 && last.status < 500) break;
    } catch (e) {
      last = { status: 0, text: String(e && e.message || e) };
    }
  }
  console.error(`submission-created: NOT forwarded form=${formName} id=${subId} status=${last && last.status} body=${(last && last.text || "").slice(0, 300)}`);
  return { statusCode: 200 };
};
