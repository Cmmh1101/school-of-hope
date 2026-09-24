// Scholarship application form: submits to a Google Apps Script Web App, which appends
// a row to a Google Sheet you own. See google-apps-script/Code.gs in this repo for the
// script to deploy, and paste your deployed Web App URL below.
var SCHOLARSHIP_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyGWoHtgGC9IdaiVzyd76lRpZOJw9Ts5wrePdDybcjgUAxvKcAQtCd8YWaa0eGQtS4r3w/exec";

document.addEventListener("DOMContentLoaded", function () {
  var form = document.querySelector("#scholarship-form");
  if (!form) return;

  var successBox = document.querySelector("#scholarship-success");
  var errorBox = document.querySelector("#scholarship-error");
  var submitBtn = document.querySelector("#scholarship-submit");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    errorBox.hidden = true;

    if (!SCHOLARSHIP_SCRIPT_URL || SCHOLARSHIP_SCRIPT_URL.indexOf("PASTE_YOUR") === 0) {
      errorBox.querySelector("p").textContent =
        "El formulario aún no está conectado. Escríbenos directamente a academy@schoolofhopeinternational.org mientras lo configuramos.";
      errorBox.hidden = false;
      errorBox.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Enviando...";

    var formData = new FormData(form);

    fetch(SCHOLARSHIP_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      body: formData,
    })
      .then(function () {
        // Apps Script Web Apps don't send CORS headers back to a plain fetch, so the
        // response body/status can't be read in "no-cors" mode — a resolved promise
        // here means the request reached Google without a network-level failure.
        form.hidden = true;
        successBox.hidden = false;
        successBox.scrollIntoView({ behavior: "smooth", block: "center" });
      })
      .catch(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = "Enviar solicitud";
        errorBox.querySelector("p").innerHTML =
          'No pudimos enviar tu solicitud. Por favor intenta de nuevo, o escríbenos directamente a <a href="mailto:academy@schoolofhopeinternational.org" style="color:#be5a34; font-weight:600;">academy@schoolofhopeinternational.org</a>.';
        errorBox.hidden = false;
        errorBox.scrollIntoView({ behavior: "smooth", block: "center" });
      });
  });
});
