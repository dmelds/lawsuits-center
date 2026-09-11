/**
 * form-validation.js (Spanish / es)
 * Drop-in client-side validation for Lawsuit Center /es/ case review forms.
 * Spanish copy of /form-validation.js - keep logic in sync with the English original.
 *
 * Behavior:
 *   - Targets any <form class="form"> on the page
 *   - Validates name (full name with a space, min 4 chars), email (format,
 *     rejects junk domains, catches common typos), and phone (10 US digits,
 *     NANP structure checked; a leading 1 on an 11-digit entry is the
 *     country code and is dropped, nothing else is ever trimmed)
 *   - Inline error messages appear on blur and on submit
 *   - Auto-formats phone as (XXX) XXX-XXXX on blur. A number that will be
 *     rejected is left exactly as typed, so the visitor sees their own
 *     digits beside the error instead of a plausible-looking record
 *   - Sets aria-invalid on failing fields and announces a screen-reader\n *     summary via an aria-live region on blocked submits\n *   - Blocks submit if any field is invalid; valid submissions pass through
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
      return "Por favor ingrese su nombre completo.";
    }
    if (v.indexOf(" ") === -1) {
      return "Por favor ingrese nombre y apellido.";
    }
    return null;
  }

  function validateEmail(value) {
    var v = (value || "").trim().toLowerCase();
    if (!v) return "Por favor ingrese su correo electrónico.";
    if (!EMAIL_REGEX.test(v)) {
      return "Por favor ingrese un correo electrónico válido (p. ej. nombre@ejemplo.com).";
    }
    var parts = v.split("@");
    var local = parts[0];
    var domain = parts[1];
    if (JUNK_EMAIL_DOMAINS.indexOf(domain) !== -1) {
      return "Por favor ingrese un correo electrónico real.";
    }
    if (COMMON_EMAIL_TYPOS[domain]) {
      return "¿Quiso decir " + local + "@" + COMMON_EMAIL_TYPOS[domain] + "?";
    }
    return null;
  }

  function rawDigits(value) {
    return (value || "").replace(/\D/g, "");
  }

  /* A leading 1 on an 11-digit entry is the US country code and the only
     unambiguous case: the remaining 10 digits are the whole number, so it is
     dropped. Nothing else is ever trimmed - a wrong length is an error. */
  function phoneDigits(value) {
    var digits = rawDigits(value);
    if (digits.length === 11 && digits.charAt(0) === "1") {
      digits = digits.slice(1);
    }
    return digits;
  }

  function digitCount(n) {
    return n === 1 ? "1 dígito" : n + " dígitos";
  }

  /* NANP numbers are NXX-NXX-XXXX, where N is 2-9. An area code or an
     exchange starting with 0 or 1 cannot be dialed. */
  function nanpError(digits, rawLength) {
    var npa = digits.slice(0, 3);
    var nxx = digits.slice(3, 6);
    if (npa.charAt(0) === "1") {
      if (rawLength === 10) return "Es un 1 seguido de 9 dígitos. Por favor verifique si falta un dígito.";
      return "Los códigos de área no comienzan con 0 ni 1. Por favor verifique el número.";
    }
    if (npa.charAt(0) === "0") return "Los códigos de área no comienzan con 0 ni 1. Por favor verifique el número.";
    if (npa.charAt(1) === "1" && npa.charAt(2) === "1") return "Por favor ingrese un número de teléfono válido de EE. UU. de 10 dígitos.";
    if (nxx.charAt(0) === "0" || nxx.charAt(0) === "1") return "Por favor verifique los tres dígitos después del código de área.";
    return null;
  }

  function validatePhone(value) {
    var raw = rawDigits(value);
    var digits = phoneDigits(value);
    if (digits.length === 0) return "Por favor ingrese su número de teléfono.";
    if (digits.length > 10) return "Ingresó " + digitCount(digits.length) + ". Por favor ingrese un número de teléfono de EE. UU. de 10 dígitos.";
    if (digits.length < 10) return "Ingresó solo " + digitCount(digits.length) + ". Por favor ingrese un número de teléfono de EE. UU. de 10 dígitos.";
    return nanpError(digits, raw.length);
  }

  function formatPhone(value) {
    var digits = phoneDigits(value);
    if (digits.length === 0) return "";
    if (digits.length > 10) return value;
    if (digits.length === 10 && nanpError(digits, rawDigits(value).length)) {
      return value;
    }
    if (digits.length < 4) return "(" + digits;
    if (digits.length < 7) return "(" + digits.slice(0, 3) + ") " + digits.slice(3);
    return "(" + digits.slice(0, 3) + ") " + digits.slice(3, 6) + "-" + digits.slice(6);
  }

  function getOrCreateLiveRegion(form) {
    var existing = form.querySelector(".form-error-summary");
    if (existing) return existing;
    var region = document.createElement("div");
    region.className = "form-error-summary";
    region.setAttribute("aria-live", "assertive");
    region.setAttribute("role", "status");
    region.style.cssText =
      "position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;" +
      "clip:rect(0,0,0,0);white-space:nowrap;border:0;";
    form.insertBefore(region, form.firstChild);
    return region;
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
        var liveRegion = getOrCreateLiveRegion(form);
        if (!allValid) {
          e.preventDefault();
          var invalidCount = fields.filter(function (f) {
            return f.input.getAttribute("aria-invalid") === "true";
          }).length;
          liveRegion.textContent =
            "El formulario no se pudo enviar. " +
            invalidCount +
            (invalidCount === 1 ? " campo necesita" : " campos necesitan") +
            " atención. Por favor revise los campos resaltados.";
          if (firstInvalid) firstInvalid.focus();
        } else {
          liveRegion.textContent = "";
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
