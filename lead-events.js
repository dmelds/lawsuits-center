/* Lawsuit Center lead events. lead_events v2.
 *
 * The intake form lives here, so a completed submission is the only true
 * conversion in the two-site funnel. This script records it as generate_lead
 * and, since v2, opens the form at the situation the visitor already chose
 * on Lawsuit Informer.
 *
 * Three parts, one file, self-detecting by what is on the page.
 *
 * PREFILL. Informer's hero and inline links append ?situation=<option value>.
 * On a form page that carries that param, the first select in the intake
 * form holding an option with that exact value is set to it and the page
 * scrolls to the form. A value that matches nothing leaves the form alone,
 * and a page with no intake form ignores the param. The match is on the
 * option's value attribute, not its label, so copy edits do not break it.
 *
 * CAPTURE. On a form page, a submit handler stashes a small payload in
 * sessionStorage: the form name, the raw value of the situation select, the
 * utm_content slot the visitor arrived on, and the page they submitted from.
 * The handler is registered on DOMContentLoaded so that it runs AFTER the
 * validation handler in form-validation.js, which registers there too but
 * earlier in the parse. A submit that validation has blocked arrives here
 * with defaultPrevented set and writes nothing. v1 registered at script
 * execution time, which put it ahead of validation, so a visitor who failed
 * validation and later reached any thank-you page produced a false lead.
 *
 * FIRE. On a thank-you page, the payload is read back, sent as generate_lead,
 * and cleared. Firing here rather than at submit time is deliberate. A submit
 * handler fires even when Netlify rejects the post for a failed recaptcha, so
 * it counts attempts. A thank-you page load only happens on success.
 *
 * gtag arrives through Netlify snippet injection and loads after this script,
 * so fire() waits for it, polling every 250 ms for up to 10 seconds. The
 * payload is cleared the moment gtag is found and immediately before the
 * event is sent, so a reload cannot send it twice. If gtag never appears the
 * payload stays put and the next thank-you load in the same tab sends it.
 * v1 cleared the payload before checking for gtag, and because gtag was never
 * present at that instant, no generate_lead event was ever sent.
 *
 * The payload uses its own key, lc_lead, rather than the existing lc_category.
 * The inline block on each thank-you page removes lc_category as soon as it
 * rewrites the heading, so reading that key would make this script depend on
 * which handler happens to run first.
 *
 * Fires nothing when the page is reached directly with no stored payload, so
 * a bookmarked or crawled thank-you URL does not inflate the count.
 *
 * Not every named form on this site is a claim. The contact form, the law firm
 * sponsorship inquiry, and the retainer review all post to the same thank-you
 * page as the intake forms. Counting those as generate_lead would fold inbound
 * sponsorship mail into the headline conversion number, so they are skipped by
 * name in NOT_A_LEAD below. Add to that list, do not remove from it, when a new
 * non-claimant form ships.
 */
(function () {
  "use strict";

  var KEY = "lc_lead";
  var PREFILL_PARAM = "situation";
  var GTAG_POLL_MS = 250;
  var GTAG_POLL_LIMIT = 40; /* 40 x 250 ms = 10 s */

  /* Named forms that post to a thank-you page but are not claimant intakes. */
  var NOT_A_LEAD = {
    "site-contact": 1,        /* contact.html - general enquiries */
    "law-firm-inquiry": 1,    /* law-firm-inquiry.html - sponsorship, inbound sales */
    "retainer-review": 1      /* educational-review.html - retainer agreement review */
  };

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

  function intakeForms() {
    var all = document.querySelectorAll("form[data-netlify][name]");
    var out = [];
    for (var i = 0; i < all.length; i++) {
      var name = all[i].getAttribute("name") || "";
      if (!NOT_A_LEAD[name]) out.push(all[i]);
    }
    return out;
  }

  /* ---- prefill: runs on a form page reached with ?situation=<value> ---- */
  function prefill(forms) {
    var wanted = param(PREFILL_PARAM);
    if (!wanted) return;
    wanted = wanted.replace(/\s+/g, " ").trim();
    if (!wanted) return;

    for (var f = 0; f < forms.length; f++) {
      var form = forms[f];
      var selects = form.querySelectorAll("select");
      for (var s = 0; s < selects.length; s++) {
        var select = selects[s];
        for (var o = 0; o < select.options.length; o++) {
          var value = (select.options[o].value || "").replace(/\s+/g, " ").trim();
          if (value && value === wanted) {
            select.value = select.options[o].value;
            try {
              select.dispatchEvent(new Event("change", { bubbles: true }));
            } catch (e) {
              /* Old engines without the Event constructor keep the value; only
                 dependent UI misses the change notification. */
            }
            try { form.scrollIntoView({ block: "start" }); } catch (e2) {}
            return;
          }
        }
      }
    }
  }

  /* ---- capture: runs on any page carrying a named Netlify intake form ---- */
  function capture(forms) {
    for (var i = 0; i < forms.length; i++) {
      (function (form) {
        var name = form.getAttribute("name") || "unknown";

        form.addEventListener("submit", function (event) {
          /* form-validation.js has already run for this submit. When it
             blocked the post, nothing was sent and nothing is stored. */
          if (event.defaultPrevented) return;

          /* The situation select is the first select in the form on every
             intake page. Its raw option value is stored rather than the
             display label, because the labels are prose and change with copy
             edits while the values are stable keys. */
          var select = form.querySelector("select");
          var payload = {
            form: name,
            category: (select && select.value) || "none",
            slot: param("utm_content") || "direct",
            source: location.pathname
          };
          try { write(KEY, JSON.stringify(payload)); } catch (e) {}
        });
      })(forms[i]);
    }
  }

  /* ---- fire: runs on any page that finds a stored payload ---- */
  function fire() {
    var raw = read(KEY);
    if (!raw) return;

    var payload;
    try { payload = JSON.parse(raw); } catch (e) { clear(KEY); return; }

    var attempts = 0;

    function send() {
      if (typeof window.gtag !== "function") {
        attempts += 1;
        if (attempts < GTAG_POLL_LIMIT) setTimeout(send, GTAG_POLL_MS);
        return;
      }

      /* Clear immediately before sending, never earlier. A reload after this
         point finds no payload; a reload before it retries from scratch. */
      clear(KEY);

      window.gtag("event", "generate_lead", {
        lead_form: payload.form || "unknown",
        lead_category: payload.category || "none",
        lead_slot: payload.slot || "direct",
        lead_source: payload.source || "unknown"
      });
    }

    send();
  }

  function init() {
    var forms = intakeForms();
    if (forms.length) {
      prefill(forms);
      capture(forms);
    }
    fire();
  }

  /* Register on DOMContentLoaded even though this script is deferred and the
     DOM is already parsed. Listeners run in registration order, and the
     validation handler registered its own DOMContentLoaded listener during
     the parse, so deferring init to the same event puts the submit handler
     below it. readyState is "complete" only if the script was injected after
     load, in which case DOMContentLoaded has passed and init runs at once. */
  if (document.readyState === "complete") {
    init();
  } else {
    document.addEventListener("DOMContentLoaded", init);
  }
})();
