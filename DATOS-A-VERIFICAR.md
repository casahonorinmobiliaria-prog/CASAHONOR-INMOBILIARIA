# CASAHONOR — Datos a verificar antes de publicar

Todo lo editable está centralizado en **`js/config.js`**. Antes de publicar, confirma
cada dato. **No publicar cifras ni afirmaciones sin verificar.**

## 1. Cifras de confianza (`js/config.js`)
- [ ] `ratingGoogle` — hoy "4.8" (verificado en Google, ago 2026). Reconfirmar.
- [ ] `numeroReseñas` — hoy "18". Reconfirmar.
- [ ] `añosExperiencia` — **vacío** por dato inconsistente (4+ vs 5+). Definir el correcto.
- [ ] `numeroPropiedades` — vacío. Definir si se muestra y mantenerlo actualizado.

## 2. Contacto (`js/config.js`)
- [x] Teléfonos: los 3 números (313 644 2894, 314 590 5245, 608 863 5218) están activos (confirmado oct 2026).
- [ ] Correo `clientes@…` (el sitio anterior también usaba `gerencia@…`). Confirmar cuál va.
- [ ] Dirección exacta y `mapsEmbed` (que el pin caiga en la oficina real).
- [ ] Horario de atención.
- [ ] Usuario real de **TikTok** (`tiktok`).

## 3. Caja Honor / Fuerza Pública
- [ ] **No** se usa "socio estratégico" ni "aliado oficial" (retirado por indicación).
      Si existe un convenio formal comprobable, indicar su denominación exacta y activarlo.
- [ ] Textos ya redactados de forma responsable (orientación, no aprobación garantizada).

## 4. Propiedades (`js/config.js` → `CASAHONOR_PROPIEDADES`)
- [x] (oct 2026) El inventario sale de la hoja **"Inventario"** de Google Drive (carpeta
      "CASAHONOR – Inventario"), con los códigos reales CH-001…CH-032. Se retiraron las 18
      propiedades copiadas del sitio anterior.
- Se publican las filas con Disponible = "sí". Fuera por ahora: **CH-010** y **CH-018**
  (suspendidas). CH-024 dice "revisar" pero se publica por indicación (oct 2026). Las notas internas no se publican.
- Las que aún no tienen fotos salen con la placa **"Fotos pronto"** y el botón "Pedir fotos" por WhatsApp.
- Cada ficha tiene enlace propio para compartir: `https://www.casahonorinmobiliaria.com/#CH-005`.
- Fotos nuevas: carpeta de Drive → `herramientas/hoja-contactos.ps1` (revisar y escoger portada)
  → `herramientas/fotos-web.ps1` (WebP en `img/inmuebles/<código>/`) → `fotos: N` en `js/config.js`.
- [ ] Datos de la hoja que no cuadran. Los dos primeros **no se publican** hasta confirmarlos:
      - CH-011 Coruña de Berdez: 7.500 m² y ciudad Neiva (en la web anterior: 115 m², Palermo).
      - CH-017 San Valentín: 45,8 m² por $300M (la CH-014 del mismo conjunto: 105 m² por $260M).
      - CH-026 Hacienda Santa Bárbara: ciudad Neiva; antes figuraba en Palermo (se publica Neiva).
- [ ] La columna de precio de la hoja tiene formato de euros (€); los valores son pesos.
- [x] (oct 2026) Precios cotejados con la hoja **"INVENTARIO VENTA CASA HONOR"** (columna "Precio de venta";
      el "Precio PVF" es lo que recibe el propietario y no se publica). Cambiaron: CH-002 $110M,
      CH-008 $205M, CH-025 $95M, CH-030 $205M, CH-032 $95M. CH-024 toma el área de esa hoja (72 m²).
      Salen de la web: CH-003 Villa Amarilla (vendida) y CH-001 4to Centenario (suspendida, sin precio de venta).
- [x] (oct 2026) Fotos publicadas de 17 inmuebles (129 fotos). Destacada: CH-024 Luis Ignacio Andrade.
      Vitrina en este orden: CH-002, CH-032, CH-025 (los tres de Bosques de San Luis), CH-030, CH-031, CH-011.
      CH-025 se publica como apartamento (la hoja decía casa).
- [ ] CH-024: la hoja dice "Parqueadero: 1 moto"; no se publica parqueadero para no confundir con carro.
- [ ] CH-032 y CH-025 van en primera fila con la placa "Fotos pronto": faltan sus fotos en Drive.
- [ ] Revisar en Drive (lo vi al ordenar las fotos):
      - Las carpetas CH-007 y CH-010 tienen 5 fotos idénticas de una casa nueva con garaje. En la web,
        CH-007 lleva solo sus fotos propias (fachada, pasillo, cocina, habitación y balcón); confirmar.
      - CH-027 "Casa en Prados del Sauce": las fotos muestran un apartamento en torres. ¿Es apartamento?
      - CH-013 "Jardín / Villa Vieja": las fotos son de un hostal; ¿queda en Villavieja y no en Neiva?
      - Se pixelaron las placas de carros en CH-014 y CH-016; se descartó una foto de parqueadero de CH-027.

## 5. Testimonios
- [x] (oct 2026) Se retiró la sección propia de reseñas: con 2 testimonios y 18 reseñas se veía escasa.
      Víctor Castaño va bajo el video de Fuerza Pública y Josse en Nosotros, junto al 4.8 de Google.
      Cuando haya 6+ testimonios con foto o video, se puede volver a armar una sección.
- [ ] Solo se incluyen reales verificados (Víctor Castaño y Josse, de Google).
      Agregar más con autorización: foto/miniatura, nombre, tipo de proceso, año y enlace.
- [ ] No usar nombres genéricos ("Cliente CASAHONOR").

## 6. Quiénes somos
- [ ] Sección **institucional sin nombres** (se retiró "Zoraida Fierro García": NO es la gerente).
      Cuando tengan el nombre real y autorizado de la gerencia, agregarlo en `js/config.js`
      (`gerenteNombre`/`gerenteCargo`) y en la sección, con foto y firma reales.
- [x] Oficina y equipo con **fotos reales** (oct 2026): fachada, sala de asesores y 5 retratos
      en `img/casahonor/`. Los tableros con nombres y teléfonos de clientes se desenfocaron.
- [ ] Pedir a cada persona del equipo **autorización escrita de uso de imagen** antes de publicar.
- [ ] Faltan fotos reales de entregas, actividades con Fuerza Pública y propiedades.

## 7. Legales (`/legal/*.html`)
- [ ] Completar razón social, NIT, matrícula/registro y fechas.
- [ ] **Revisión jurídica** de las 4 plantillas antes de publicar.

## 8. Formulario (`js/config.js` → `formEndpoint`)
- [ ] Configurar endpoint real (Formspree, CRM o función serverless).
      Mientras esté como `[ENDPOINT_FORMULARIO]`, el formulario usa **WhatsApp como
      respaldo** (no se pierde la información).

## 9. Medición (`js/config.js`)
- [ ] `gaId` → `[ID_GOOGLE_ANALYTICS]` y `metaPixelId` → `[ID_META_PIXEL]`.
- [ ] Pegar los snippets en el `<head>` de `index.html` (marcado con `<!-- [ANALÍTICA] -->`).
- [ ] Ya hay eventos preparados (`whatsapp_click`, `form_submit`, `ver_propiedad`, etc.)
      vía `window.dataLayer`.

## 10. Activos
- [x] Imagen Open Graph `img/og-casahonor.jpg` (1200×630).
- [x] (oct 2026) Fotos del inventario en **WebP** con versión de 800 px para tarjetas (`img/inmuebles/`).
- [ ] Pasar a WebP las fotos del hero (`img/hero/`) y del equipo (`img/casahonor/`).
- [ ] Foto profesional real para el hero (propiedad o entrega de llaves).
- [x] `img/stock/*.jpg` ya no se usan en la página (reemplazadas por fotos reales en oct 2026).
      Se pueden borrar de la carpeta cuando se confirme.
