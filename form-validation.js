/**
 * form-validation.js
 * Drop-in client-side validation for Lawsuit Center case review forms.
 *
 * Behavior:
 *   - Targets any <form class="form"> on the page
 *   - Validates name (full name with a space, min 4 chars), email (format,
 *     rejects junk domains, catches common typos), and phone (10 US digits)
 *   - Inline error messages appear on blur and on submit
 *   - Auto-formats phone as (XXX) XXX-XXXX on blur
 *   - Blocks submit if any field is invalid; valid submissions pass through
 *     untouched (Netlify forms keep working)
 *
 * Install:
 *   1. Save this file at the repo root (same folder as case-review.html etc.)
 *   2. Add this line just before </body> on each case-review page:
 *      <script src="form-validation.js"></script>
 *
 * No HTML changes required. Works alongside the existing inline scripts.
 */
(function () {
  "use strict";

  var JUNK_EMAIL_DOMAINS = ["test.com", "example.com", "test.test", "asdf.com"];
  var EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var ERROR_COLOR = "#e07a5f";

  var COMMON_EMAIL_TYPOS = {
    "gmail.cm": "gmail.com",
    "gmail.co": "gmail.com",
    "gmail.con": "gmail.com",
    "gmial.com": "gmail.com",
    "gmaill.com": "gmail.com",
    "gnail.com": "gmail.com",
    "gmaul.com": "gmail.com",
    "yahoo.cm": "yahoo.com",
    "yahoo.co": "yahoo.com",
    "yahoo.con": "yahoo.com",
    "yaho.com": "yahoo.com",
    "yahooo.com": "yahoo.com",
    "yhaoo.com": "yahoo.com",
    "hotmail.cm": "hotmail.com",
    "hotmail.co": "hotmail.com",
    "hotmail.con": "hotmail.com",
    "hotmial.com": "hotmail.com",
    "hotmai.com": "hotmail.com",
    "hotnail.com": "hotmail.com",
    "outlook.cm": "outlook.com",
    "outlook.co": "outlook.com",
    "outlook.con": "outlook.com",
    "outlok.com": "outlook.com",
    "outloook.com": "outlook.com",
    "icloud.cm": "icloud.com",
    "icloud.co": "icloud.com",
    "icloud.con": "icloud.com",
    "iclould.com": "icloud.com",
    "icoud.com": "icloud.com",
    "aol.cm": "aol.com",
    "aol.co": "aol.com",
    "aol.con": "aol.com",
    "comcast.cm": "comcast.net",
    "comcast.com": "comcast.net"
  };

  function validateName(value) {
    var v = (value || "").trim();
    if (v.length < 4) {
      return "Please enter your full name.";
    }
    if (v.indexOf(" ") === -1) {
      return "Please enter both a first and last name.";
    }
    return null;
  }

  function validateEmail(value) {
    var v = (value || "").trim().toLowerCase();
    if (!v) return "Please enter your email address.";
    if (!EMAIL_REGEX.test(v)) {
      return "Please enter a valid email address (e.g. name@example.com).";
    }
    var parts = v.split("@");
    var local = parts[0];
    var domain = parts[1];
    if (JUNK_EMAIL_DOMAINS.indexOf(domain) !== -1) {
      return "Please enter a real email address.";
    }
    if (COMMON_EMAIL_TYPOS[domain]) {
      return "Did you mean " + local + "@" + COMMON_EMAIL_TYPOS[domain] + "?";
    }
    return null;
  }

  function validatePhone(value) {
    var digits = (value || "").replace(/\D/g, "");
    if (digits.length === 0) return "Please enter your phone number.";
    if (digits.length !== 10) return "Please enter a valid 10-digit US phone number.";
    return null;
  }

  function formatPhone(value) {
    var digits = (value || "").replace(/\D/g, "").slice(0, 10);
    if (digits.length === 0) return "";
    if (digits.length < 4) return "(" + digits;
    if (digits.length < 7) return "(" + digits.slice(0, 3) + ") " + digits.slice(3);
    return "(" + digits.slice(0, 3) + ") " + digits.slice(3, 6) + "-" + digits.slice(6);
  }

  function getOrCreateErrorEl(input) {
    var existing = input.parentNode.querySelector(
      '.field-error[data-for="' + input.name + '"]'
    );
    if (existing) return existing;
    var el = document.createElement("p");
    el.className = "field-error";
    el.setAttribute("data-for", input.name);
    el.setAttribute("role", "alert");
    el.style.cssText =
      "color:" + ERROR_COLOR + ";font-size:13px;line-height:1.5;margin:6px 0 0;";
    input.parentNode.appendChild(el);
    return el;
  }

  function showError(input, message) {
    var el = getOrCreateErrorEl(input);
    el.textContent = message;
    el.style.display = "block";
    input.setAttribute("aria-invalid", "true");
    input.style.borderColor = ERROR_COLOR;
  }

  function clearError(input) {
    var el = input.parentNode.querySelector(
      '.field-error[data-for="' + input.name + '"]'
    );
    if (el) {
      el.textContent = "";
      el.style.display = "none";
    }
    input.removeAttribute("aria-invalid");
    input.style.borderColor = "";
  }

  function validateField(input, validator) {
    var error = validator(input.value);
    if (error) {
      showError(input, error);
      return false;
    }
    clearError(input);
    return true;
  }

  function attachField(form, name, validator, opts) {
    opts = opts || {};
    var input = form.querySelector('[name="' + name + '"]');
    if (!input) return null;

    input.addEventListener("blur", function () {
      if (input.value.trim() === "" && !input.dataset.touched) return;
      input.dataset.touched = "true";
      if (opts.format) input.value = opts.format(input.value);
      validateField(input, validator);
    });

    input.addEventListener("input", function () {
      input.dataset.touched = "true";
      var existing = input.parentNode.querySelector(
        '.field-error[data-for="' + name + '"]'
      );
      if (existing && existing.textContent) clearError(input);
    });

    return { input: input, validator: validator };
  }

  function init() {
    var forms = document.querySelectorAll("form.form");
    if (!forms.length) return;

    Array.prototype.forEach.call(forms, function (form) {
      var fields = [
        attachField(form, "name", validateName),
        attachField(form, "email", validateEmail),
        attachField(form, "phone", validatePhone, { format: formatPhone })
      ].filter(Boolean);

      form.addEventListener("submit", function (e) {
        var allValid = true;
        var firstInvalid = null;
        fields.forEach(function (f) {
          var ok = validateField(f.input, f.validator);
          if (!ok) {
            allValid = false;
            if (!firstInvalid) firstInvalid = f.input;
          }
        });
        if (!allValid) {
          e.preventDefault();
          if (firstInvalid) firstInvalid.focus();
        }
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
