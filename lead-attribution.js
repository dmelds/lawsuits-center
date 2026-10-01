/* Lawsuit Center. Copyright (c) 2026 David Meldofsky. All rights reserved.
   No license is granted to copy, modify or redistribute this code.

   First-touch attribution for intake forms. Loaded on every page.

   On every page load: if the URL carries UTM parameters, or nothing is stored yet, record
   this visit as the first touch (UTMs, document.referrer, landing path) in sessionStorage.
   On a page with an intake form: fill that form's hidden utm_* / page_referrer /
   landing_page inputs from the stored first touch, falling back to this page's own values.

   First-party, inline, no third-party host, so tracker blockers that take googletagmanager
   dark leave this alone. sessionStorage lives for the tab; a private window that refuses
   storage still gets the current page's referrer and UTMs. consent_version is static in the
   HTML and is never touched here. */
(function () {
  var KEY = "lc_attr";
  var UTMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];

  function read() {
    try { var v = sessionStorage.getItem(KEY); return v ? JSON.parse(v) : null; } catch (e) { return null; }
  }
  function write(v) {
    try { sessionStorage.setItem(KEY, JSON.stringify(v)); } catch (e) { /* storage refused */ }
  }
  function current() {
    var q = {};
    try {
      var sp = new URLSearchParams(location.search);
      UTMS.forEach(function (k) { var v = sp.get(k); if (v) q[k] = String(v).slice(0, 100); });
    } catch (e) { /* old browser */ }
    var ref = "";
    try { ref = document.referrer || ""; } catch (e) { /* ignore */ }
    var sameSite = false;
    try { sameSite = !!ref && new URL(ref).hostname.replace(/^www\./, "") === location.hostname.replace(/^www\./, ""); } catch (e) { /* ignore */ }
    return {
      utm: q,
      hasUtm: Object.keys(q).length > 0,
      referrer: sameSite ? "" : ref.slice(0, 500),
      landing: (location.pathname + location.search).slice(0, 300),
      at: Date.now()
    };
  }

  var now = current();
  var first = read();
  // A new campaign click overrides an older first touch; an internal page view never does.
  if (!first || now.hasUtm || (!first.hasUtm && !first.referrer && now.referrer)) {
    first = now;
    write(first);
  }

  function fill() {
    var forms = document.querySelectorAll("form");
    for (var i = 0; i < forms.length; i++) {
      var f = forms[i];
      var probe = f.querySelector('input[name="landing_page"]');
      if (!probe) continue;
      UTMS.forEach(function (k) {
        var el = f.querySelector('input[name="' + k + '"]');
        if (el && !el.value) el.value = first.utm[k] || now.utm[k] || "";
      });
      var r = f.querySelector('input[name="page_referrer"]');
      if (r && !r.value) r.value = first.referrer || now.referrer || "";
      if (!probe.value) probe.value = first.landing || now.landing || "";
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fill);
  else fill();
})();
