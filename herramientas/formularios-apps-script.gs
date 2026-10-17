/**
 * CASAHONOR · Receptor de los formularios de la web
 * ---------------------------------------------------------------
 * Cada solicitud de www.casahonorinmobiliaria.com:
 *   1. llega como correo a CORREO_DESTINO
 *   2. queda guardada como una fila en esta hoja de cálculo
 *
 * Instalación (una sola vez):
 *   1. Crear una hoja de Google llamada "Solicitudes web CasaHonor" y poner su ID en ID_LIBRO.
 *   2. script.google.com → Nuevo proyecto → pegar este archivo → Guardar.
 *      (Con varias cuentas abiertas en Chrome, entrar por script.google.com/u/N/ con la cuenta correcta.)
 *   3. Implementar → Nueva implementación → tipo "Aplicación web".
 *        Ejecutar como: Yo        Quién tiene acceso: Cualquier usuario
 *   4. Autorizar los permisos que pide Google (enviar correo y editar la hoja).
 *   5. Copiar la URL que termina en /exec y ponerla en js/config.js → formEndpoint.
 *
 * Si se cambia este código, hay que hacer Implementar → Gestionar implementaciones
 * → editar → Versión: nueva. La URL se mantiene.
 */

var CORREO_DESTINO = "administracioncasahonor@gmail.com";
// Hoja "Solicitudes web CasaHonor" (Drive de casahonorinmobiliaria@gmail.com)
var ID_LIBRO = "14Et9xpPOUUedqaExdW6xxo37Gs0b8wHeB4OkMUR0Mws";
var NOMBRE_HOJA = "Solicitudes";

var ETIQUETAS = {
  nombre: "Nombre",
  whatsapp: "WhatsApp",
  email: "Correo",
  ciudad: "Ciudad",
  necesidad: "Necesita",
  mensaje: "Mensaje",
  sector: "Sector / barrio",
  tipo: "Tipo de inmueble",
  area: "Área aprox. (m²)",
  precio: "Precio esperado"
};
var COLUMNAS = ["Fecha", "Formulario", "nombre", "whatsapp", "email", "ciudad", "necesidad", "tipo", "sector", "area", "precio", "mensaje"];

function doPost(e) {
  try {
    var d = JSON.parse((e && e.postData && e.postData.contents) || "{}");

    // Anti-spam: el campo oculto "empresa" solo lo llenan los robots
    if (d.empresa) return respuesta({ ok: true });

    // Recorta todo a 1.000 caracteres para evitar abusos
    Object.keys(d).forEach(function (k) { d[k] = String(d[k] == null ? "" : d[k]).slice(0, 1000); });
    if (!d.nombre || !d.whatsapp) return respuesta({ ok: false, error: "faltan datos" });

    var formulario = d.origen === "ownform" ? "Propietarios (quiere vender)" : "Contacto";
    guardarFila(formulario, d);
    enviarCorreo(formulario, d);
    return respuesta({ ok: true });
  } catch (err) {
    return respuesta({ ok: false, error: String(err) });
  }
}

// Permite abrir la URL en el navegador para comprobar que está activa
function doGet() {
  return respuesta({ ok: true, servicio: "formularios CASAHONOR" });
}

function guardarFila(formulario, d) {
  var libro = SpreadsheetApp.openById(ID_LIBRO);
  var hoja = libro.getSheetByName(NOMBRE_HOJA) || libro.insertSheet(NOMBRE_HOJA);
  if (hoja.getLastRow() === 0) {
    hoja.appendRow(COLUMNAS.map(function (c) { return ETIQUETAS[c] || c; }));
    hoja.setFrozenRows(1);
  }
  var fila = COLUMNAS.map(function (c) {
    if (c === "Fecha") return new Date();
    if (c === "Formulario") return formulario;
    return d[c] || "";
  });
  hoja.appendRow(fila);
}

function enviarCorreo(formulario, d) {
  var filas = Object.keys(ETIQUETAS)
    .filter(function (k) { return d[k]; })
    .map(function (k) {
      return "<tr><td style='padding:6px 12px 6px 0;color:#666;vertical-align:top'>" + ETIQUETAS[k] +
        "</td><td style='padding:6px 0'><b>" + escapar(d[k]).replace(/\n/g, "<br>") + "</b></td></tr>";
    }).join("");

  var tel = String(d.whatsapp).replace(/\D/g, "");
  if (tel.length === 10) tel = "57" + tel;
  var botonWa = tel
    ? "<p><a href='https://wa.me/" + tel + "' style='background:#ff8e00;color:#16171a;padding:10px 16px;border-radius:8px;text-decoration:none;font-weight:bold'>Responder por WhatsApp</a></p>"
    : "";

  var html = "<div style='font-family:Arial,sans-serif;font-size:15px;color:#16171a'>" +
    "<p>Llegó una solicitud nueva desde la web (<b>" + formulario + "</b>):</p>" +
    "<table>" + filas + "</table>" + botonWa +
    "<p style='color:#888;font-size:12px'>También quedó guardada en la hoja \"Solicitudes web CasaHonor\".</p></div>";

  var opciones = { htmlBody: html, name: "Web CASAHONOR" };
  if (d.email && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email)) opciones.replyTo = d.email;

  MailApp.sendEmail(CORREO_DESTINO, "Web · " + formulario + " · " + d.nombre, "Solicitud nueva de " + d.nombre + " (" + d.whatsapp + ")", opciones);
}

function escapar(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function respuesta(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
