/* Lawsuit Center lead events. lead_events v1.
 *
 * The intake form lives here, so a completed submission is the only true
 * conversion in the two-site funnel. Nothing was recording it: the property
 * fired no GA4 events at all, and the thank-you pages already knew which tort
 * had been submitted and threw it away.
 *
 * Two halves, one file, self-detecting by what is on the page.
 *
 * On a form page, a submit handler stashes a small payload in sessionStorage:
 * the form name, the raw value of the situation select, the utm_content slot
 * the visitor arrived on, and the page they submitted from.
 *
 * On a thank-you page, that payload is read back, sent as generate_lead, and
 * cleared. Firing here rather than at submit time is deliberate. A submit
 * handler fires even when Netlify rejects the post for a failed recaptcha, so
 * it counts attempts. A thank-you page load only happens on success.
 *
 * The payload uses its own key, lc_lead, rather than the existing lc_category.
 * The inline block on each thank-you page removes lc_category as soon as it
 * rewrites the heading, so reading that key would make this script depend on
 * which handler happens to run first.
 *
 * Fires nothing when the page is reached directly with no stored payload, so
 * a bookmarked or crawled thank-you URL does not inflate the count.
 */
(function () {
  "use strict";

  var KEY = "lc_lead";

  function read(key) {
    try { return sessionStorage.getItem(key); } catch (e) { return null; }
  }

  function write(key, value) {
    try { sessionStorage.setItem(key, value); } catch (e) {}
  }

  function clear(key) {
    try { sessionStorage.removeItem(key); } catch (e) {}
  }

  function param(name) {
    try {
      return new URLSearchParams(location.search).get(name) || "";
    } catch (e) {
      return "";
    }
  }

  /* ---- capture half: runs on any page carrying a named Netlify form ---- */
  function capture() {
    var forms = document.querySelectorAll("form[data-netlify][name]");
    if (!forms.length) return;

    for (var i = 0; i < forms.length; i++) {
      (function (form) {
        form.addEventListener("submit", function () {
          /* The situation select is the first select in the form on every
             intake page. Its raw option value is stored rather than the
             display label, because the labels are prose and change with copy
             edits while the values are stable keys. */
          var select = form.querySelector("select");
          var payload = {
            form: form.getAttribute("name") || "unknown",
            category: (select && select.value) || "none",
            slot: param("utm_content") || "direct",
            source: location.pathname
          };
          try { write(KEY, JSON.stringify(payload)); } catch (e) {}
        });
      })(forms[i]);
    }
  }

  /* ---- fire half: runs on any page that reads the thank-you payload ---- */
  function fire() {
    var raw = read(KEY);
    if (!raw) return;

    var payload;
    try { payload = JSON.parse(raw); } catch (e) { clear(KEY); return; }

    /* Clear before sending. A duplicate on reload is worse than a lost event,
       and gtag may not be ready on a slow first paint. */
    clear(KEY);

    if (typeof window.gtag !== "function") return;

    window.gtag("event", "generate_lead", {
      lead_form: payload.form || "unknown",
      lead_category: payload.category || "none",
      lead_slot: payload.slot || "direct",
      lead_source: payload.source || "unknown"
    });
  }

  function init() {
    capture();
    fire();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
