/**
 * School of Hope International — contact form email notifications.
 *
 * This is a SEPARATE script from Code.gs (the scholarship one) — different job, different
 * deployment. Supabase (the "leads" table) is the actual record of every contact message;
 * this script's only job is to email your team the moment someone submits, so nobody has
 * to keep checking the Supabase dashboard for new leads.
 *
 * Deploy:
 *  1. script.google.com -> New project (doesn't need to be bound to a Sheet).
 *  2. Delete the placeholder code and paste this file in.
 *  3. Deploy -> New deployment -> type "Web app".
 *     - Execute as: Me
 *     - Who has access: Anyone
 *  4. Copy the Web App URL and paste it into CONTACT_NOTIFY_URL in js/contact.js.
 *  5. Submit the contact form once and confirm an email arrives at NOTIFY_EMAIL.
 */

var NOTIFY_EMAIL = "academy@schoolofhopeinternational.org";

function doPost(e) {
  var p = (e && e.parameter) || {};

  var subjectLine = "Nuevo mensaje de contacto — " + (p.name || "Sitio web");
  var body =
    "Nuevo mensaje desde el formulario de contacto del sitio web:\n\n" +
    "Nombre: " + (p.name || "—") + "\n" +
    "Email: " + (p.email || "—") + "\n" +
    "Teléfono: " + (p.phone || "—") + "\n" +
    "Motivo: " + (p.subject || "—") + "\n\n" +
    "Mensaje:\n" + (p.message || "—");

  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    subject: subjectLine,
    body: body,
    replyTo: p.email || NOTIFY_EMAIL,
  });

  return ContentService
    .createTextOutput(JSON.stringify({ result: "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}
