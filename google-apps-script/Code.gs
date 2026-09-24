/**
 * School of Hope International — scholarship application intake.
 *
 * On every submission this script:
 *  1. Appends a row to this spreadsheet (same sheet the script is bound to).
 *  2. Generates a one-page PDF summary of that submission and saves it into a Drive
 *     folder you choose — one PDF per submission, plus the sheet row as the searchable
 *     record. The sheet's "PDF" column links straight to each file.
 *  3. Emails NOTIFY_EMAIL a heads-up with the key details, reply-to set to the
 *     applicant's own email so you can just hit reply.
 *
 * Deploy:
 *  1. Create a new Google Sheet (this is where applications will land).
 *  2. Extensions -> Apps Script. Delete the placeholder code and paste this file in.
 *  3. In Google Drive, create (or pick) a folder for the PDFs, open it, and copy the
 *     folder ID out of its URL — the part after /folders/, e.g.
 *     drive.google.com/drive/folders/<THIS PART>. Paste it into FOLDER_ID below.
 *  4. Deploy -> New deployment -> type "Web app".
 *     - Execute as: Me
 *     - Who has access: Anyone
 *  5. Copy the Web App URL and paste it into SCHOLARSHIP_SCRIPT_URL in js/becas.js.
 *  6. Submit the form once and confirm a row appears in the sheet AND a PDF appears in
 *     the Drive folder.
 *
 * Each submission appends one row and creates one PDF; the header row is created
 * automatically on first run. If the PDF step fails for any reason (e.g. FOLDER_ID
 * hasn't been set yet), the sheet row still gets saved — the "PDF" column just shows
 * the error instead of a link, so no submission is ever lost even if Drive misbehaves.
 */

var FOLDER_ID = "1ZmMH-YvD-JAYSrek7kXzLuaI_3ESmTv6";
var NOTIFY_EMAIL = "academy@schoolofhopeinternational.org";

var HEADERS = [
  "Fecha de envío", "Nombre", "Apellido", "Fecha de nacimiento", "Edad", "Ciudad", "País",
  "Teléfono", "Email", "Nivel educativo actual", "Último grado aprobado",
  "¿Repitió grado por dificultades económicas?", "Por qué no puede culminar sin apoyo",
  "Con quién vive", "Personas en el hogar", "Fuente de ingresos", "Ingreso mensual aproximado",
  "¿Cubre necesidades básicas?", "Dispositivos digitales", "Acceso a internet", "Espacio para estudiar",
  "Por qué desea culminar el bachillerato", "Metas a futuro", "¿Dispuesto a comprometerse?",
  "Declaración aceptada", "Nombre (declaración)", "Apellido (declaración)", "Fecha (declaración)",
  "PDF"
];

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var params = (e && e.parameter) || {};
  var multi = (e && e.parameters) || {};

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
  }

  var dispositivos = (multi.dispositivos || []).join(", ");

  var pdfLink;
  try {
    pdfLink = createSubmissionPdf(params, dispositivos);
  } catch (err) {
    pdfLink = "Error al generar PDF: " + err.message;
  }

  sheet.appendRow([
    new Date(),
    params.nombre || "", params.apellido || "", params.fechaNacimiento || "", params.edad || "",
    params.ciudad || "", params.pais || "",
    params.telefono || "", params.email || "", params.nivelEducativo || "", params.ultimoGrado || "",
    params.repitioGrado || "", params.porQueNoPuede || "",
    params.conQuienVive || "", params.personasHogar || "", params.fuenteIngresos || "", params.ingresoMensual || "",
    params.cubreNecesidades || "", dispositivos, params.accesoInternet || "", params.espacioEstudio || "",
    params.porQueDesea || "", params.metasFuturo || "", params.dispuestoComprometerse || "",
    params.declaracionAceptada ? "Sí" : "No",
    params.nombreDeclaracion || "", params.apellidoDeclaracion || "", params.fechaDeclaracion || "",
    pdfLink
  ]);

  try {
    notifyTeam(params, pdfLink);
  } catch (err) {
    // The application is already safely saved above — a failed notification email
    // should never make the applicant see an error.
  }

  return ContentService
    .createTextOutput(JSON.stringify({ result: "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Emails NOTIFY_EMAIL a short heads-up about a new scholarship application.
 */
function notifyTeam(p, pdfLink) {
  var studentName = ((p.nombre || "") + " " + (p.apellido || "")).trim() || "Sin nombre";
  var subjectLine = "Nueva solicitud de beca — " + studentName;
  var body =
    "Se recibió una nueva solicitud de beca:\n\n" +
    "Nombre: " + (p.nombre || "—") + " " + (p.apellido || "—") + "\n" +
    "Email: " + (p.email || "—") + "\n" +
    "Teléfono: " + (p.telefono || "—") + "\n" +
    "País: " + (p.pais || "—") + "\n" +
    "Nivel educativo actual: " + (p.nivelEducativo || "—") + "\n\n" +
    "PDF de la solicitud: " + (pdfLink || "—") + "\n\n" +
    "Revisa la fila completa en la hoja de cálculo para el resto de los detalles.";

  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    subject: subjectLine,
    body: body,
    replyTo: p.email || NOTIFY_EMAIL,
  });
}

/**
 * Builds a one-page PDF summary of a single submission and saves it into FOLDER_ID.
 * Returns the PDF file's Drive URL.
 */
function createSubmissionPdf(p, dispositivosText) {
  var folder = DriveApp.getFolderById(FOLDER_ID);
  var studentName = ((p.nombre || "") + " " + (p.apellido || "")).trim() || "Sin nombre";
  var timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm");
  var fileName = "Solicitud de beca - " + studentName + " - " + timestamp;

  var doc = DocumentApp.create(fileName);
  var body = doc.getBody();

  body.appendParagraph("Solicitud de Beca — School of Hope International")
    .setHeading(DocumentApp.ParagraphHeading.TITLE);
  body.appendParagraph("Enviado: " + timestamp).setItalic(true);

  addSection(body, "1. Información del estudiante", [
    ["Nombre", p.nombre], ["Apellido", p.apellido], ["Fecha de nacimiento", p.fechaNacimiento],
    ["Edad", p.edad], ["Ciudad de residencia", p.ciudad], ["País", p.pais],
    ["Teléfono", p.telefono], ["Email", p.email]
  ]);

  addSection(body, "2. Información académica", [
    ["Nivel educativo actual", p.nivelEducativo], ["Último grado aprobado", p.ultimoGrado],
    ["¿Repitió grado por dificultades económicas?", p.repitioGrado],
    ["Por qué no puede culminar sin apoyo", p.porQueNoPuede]
  ]);

  addSection(body, "3. Acceso digital y conectividad", [
    ["Con quién vive", p.conQuienVive], ["Personas en el hogar", p.personasHogar],
    ["Fuente de ingresos", p.fuenteIngresos], ["Ingreso mensual aproximado", p.ingresoMensual],
    ["¿Cubre necesidades básicas?", p.cubreNecesidades]
  ]);

  addSection(body, "4. Información socioeconómica", [
    ["Dispositivos digitales", dispositivosText], ["Acceso a internet", p.accesoInternet],
    ["Espacio para estudiar", p.espacioEstudio]
  ]);

  addSection(body, "5. Motivación y compromiso", [
    ["Por qué desea culminar el bachillerato", p.porQueDesea], ["Metas a futuro", p.metasFuturo],
    ["¿Dispuesto a comprometerse?", p.dispuestoComprometerse]
  ]);

  addSection(body, "6. Declaración del estudiante", [
    ["Declaración aceptada", p.declaracionAceptada ? "Sí" : "No"],
    ["Nombre", p.nombreDeclaracion], ["Apellido", p.apellidoDeclaracion], ["Fecha", p.fechaDeclaracion]
  ]);

  doc.saveAndClose();

  var pdfBlob = DriveApp.getFileById(doc.getId()).getAs("application/pdf");
  pdfBlob.setName(fileName + ".pdf");
  var pdfFile = folder.createFile(pdfBlob);

  // The intermediate Google Doc was only a stepping stone to the PDF — discard it.
  DriveApp.getFileById(doc.getId()).setTrashed(true);

  return pdfFile.getUrl();
}

function addSection(body, title, rows) {
  body.appendParagraph(title).setHeading(DocumentApp.ParagraphHeading.HEADING2);
  rows.forEach(function (row) {
    var label = row[0];
    var value = String(row[1] || "—");
    var p = body.appendParagraph(label + ": " + value);
    p.editAsText().setBold(0, label.length - 1, true);
  });
}
