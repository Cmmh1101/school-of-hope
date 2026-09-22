// Contact form: saves each submission as a lead in Supabase (see supabase/leads-schema.sql).
// Public visitors can only INSERT — RLS blocks reading other people's leads — so it's safe
// to run this without any login.
//
// After a successful save, this also pings a Google Apps Script that emails the team —
// see google-apps-script/NotifyContactLead.gs. That step is best-effort: if it fails, the
// lead is already safely in Supabase, so the visitor still sees a normal success message.
var CONTACT_NOTIFY_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";

document.addEventListener("DOMContentLoaded", function () {
  var form = document.querySelector("#contact-form");
  if (!form) return;

  var successBox = document.querySelector("#contact-success");
  var errorBox = document.querySelector("#contact-error");
  var formCard = document.querySelector("#contact-form-card");
  var submitBtn = document.querySelector("#contact-submit");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    errorBox.hidden = true;

    var formData = new FormData(form);
    var payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone") || null,
      subject: formData.get("subject") || null,
      message: formData.get("message"),
      source_page: "contacto.html",
    };

    submitBtn.disabled = true;

    sb.from("leads")
      .insert(payload)
      .then(function (res) {
        submitBtn.disabled = false;
        if (res.error) {
          errorBox.hidden = false;
          errorBox.scrollIntoView({ behavior: "smooth", block: "center" });
          return;
        }

        if (CONTACT_NOTIFY_URL && CONTACT_NOTIFY_URL.indexOf("PASTE_YOUR") !== 0) {
          fetch(CONTACT_NOTIFY_URL, { method: "POST", mode: "no-cors", body: formData }).catch(function () {});
        }

        formCard.hidden = true;
        successBox.hidden = false;
        successBox.scrollIntoView({ behavior: "smooth", block: "center" });
      });
  });
});
