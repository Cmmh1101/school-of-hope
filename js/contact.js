// Contact form: saves each submission as a lead in Supabase (see supabase/leads-schema.sql).
// Public visitors can only INSERT — RLS blocks reading other people's leads — so it's safe
// to run this without any login.
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
        formCard.hidden = true;
        successBox.hidden = false;
        successBox.scrollIntoView({ behavior: "smooth", block: "center" });
      });
  });
});
