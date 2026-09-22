// Contact form: saves each submission as a lead in Supabase (see supabase/leads-schema.sql)
// — that's the permanent record. Public visitors can only INSERT — RLS blocks reading
// other people's leads — so it's safe to run this without any login.
//
// It also submits to Netlify Forms (the <form data-netlify="true"> in contacto.html),
// purely so Netlify can send an email notification — configure that under the site's
// Netlify dashboard: Forms -> (the "contact" form) -> Settings & usage -> Form
// notifications -> Add notification -> Email notification. That step only works once
// this site is actually deployed on Netlify; it fails silently (and harmlessly) anywhere
// else, since Supabase already has the lead saved regardless.
document.addEventListener("DOMContentLoaded", function () {
  var form = document.querySelector("#contact-form");
  if (!form) return;

  var successBox = document.querySelector("#contact-success");
  var errorBox = document.querySelector("#contact-error");
  var formCard = document.querySelector("#contact-form-card");
  var submitBtn = document.querySelector("#contact-submit");

  function encodeFormData(data) {
    return Object.keys(data)
      .map(function (key) {
        return encodeURIComponent(key) + "=" + encodeURIComponent(data[key] == null ? "" : data[key]);
      })
      .join("&");
  }

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

        // Best-effort — only succeeds once this site is live on Netlify.
        fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: encodeFormData({
            "form-name": "contact",
            name: payload.name,
            email: payload.email,
            phone: payload.phone || "",
            subject: payload.subject || "",
            message: payload.message,
          }),
        }).catch(function () {});

        formCard.hidden = true;
        successBox.hidden = false;
        successBox.scrollIntoView({ behavior: "smooth", block: "center" });
      });
  });
});
