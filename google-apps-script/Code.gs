/**
 * School of Hope International — scholarship application intake.
 *
 * Deploy:
 *  1. Create a new Google Sheet (this is where applications will land).
 *  2. Extensions -> Apps Script. Delete the placeholder code and paste this file in.
 *  3. Deploy -> New deployment -> type "Web app".
 *     - Execute as: Me
 *     - Who has access: Anyone
 *  4. Copy the Web App URL and paste it into SCHOLARSHIP_SCRIPT_URL in js/becas.js.
 *  5. Submit the form once and confirm a row appears in the sheet.
 *
 * Each submission appends one row; the header row is created automatically on first run.
 */

var HEADERS = [
  "Fecha de envío", "Nombre", "Apellido", "Fecha de nacimiento", "Edad", "Ciudad", "País",
  "Teléfono", "Email", "Nivel educativo actual", "Último grado aprobado",
  "¿Repitió grado por dificultades económicas?", "Por qué no puede culminar sin apoyo",
  "Con quién vive", "Personas en el hogar", "Fuente de ingresos", "Ingreso mensual aproximado",
  "¿Cubre necesidades básicas?", "Dispositivos digitales", "Acceso a internet", "Espacio para estudiar",
  "Por qué desea culminar el bachillerato", "Metas a futuro", "¿Dispuesto a comprometerse?",
  "Declaración aceptada", "Nombre (declaración)", "Apellido (declaración)", "Fecha (declaración)"
];

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var params = (e && e.parameter) || {};
  var multi = (e && e.parameters) || {};

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
  }

  var dispositivos = (multi.dispositivos || []).join(", ");

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
    params.nombreDeclaracion || "", params.apellidoDeclaracion || "", params.fechaDeclaracion || ""
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ result: "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}
