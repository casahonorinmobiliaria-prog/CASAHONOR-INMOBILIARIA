# CASAHONOR — Datos a verificar antes de publicar

Todo lo editable está centralizado en **`js/config.js`**. Antes de publicar, confirma
cada dato. **No publicar cifras ni afirmaciones sin verificar.**

## 1. Cifras de confianza (`js/config.js`)
- [ ] `ratingGoogle` — hoy "4.8" (verificado en Google, ago 2026). Reconfirmar.
- [ ] `numeroReseñas` — hoy "18". Reconfirmar.
- [ ] `añosExperiencia` — **vacío** por dato inconsistente (4+ vs 5+). Definir el correcto.
- [ ] `numeroPropiedades` — vacío. Definir si se muestra y mantenerlo actualizado.

## 2. Contacto (`js/config.js`)
- [ ] Teléfonos (3 números) — aclarar para qué sirve cada uno o dejar solo los vigentes.
- [ ] Correo `clientes@…` (el sitio anterior también usaba `gerencia@…`). Confirmar cuál va.
- [ ] Dirección exacta y `mapsEmbed` (que el pin caiga en la oficina real).
- [ ] Horario de atención.
- [ ] Usuario real de **TikTok** (`tiktok`).

## 3. Caja Honor / Fuerza Pública
- [ ] **No** se usa "socio estratégico" ni "aliado oficial" (retirado por indicación).
      Si existe un convenio formal comprobable, indicar su denominación exacta y activarlo.
- [ ] Textos ya redactados de forma responsable (orientación, no aprobación garantizada).

## 4. Propiedades (`js/config.js` → `CASAHONOR_PROPIEDADES`)
- Cargadas **18 propiedades reales** traídas del sitio actual (fotos, precios y specs).
- [ ] Códigos CH-01…CH-18 son **provisionales**: reemplazar por los códigos reales.
- [ ] Datos tomados tal cual del catálogo actual; confirmar precios/áreas/disponibilidad.
- [ ] Algunos datos no venían en el sitio y quedaron así: **CH-04 (Chapinero) sin precio → "Consultar"**;
      **CH-02 (Quinta Avenida) sin n.º de habitaciones** (solo 3 baños/127 m²).
- [ ] Ciudad asumida en 3 casos (confirmar): CH-16 El Juncal → "Huila"; CH-15 Finca → "Colombia";
      CH-17/CH-18 Monteloma → "Rivera".
- [ ] Destacada actual: **CH-18 (Casa campestre Monteloma #5)** por ser la foto más atractiva. Cambiable con `destacada:true`.

## 5. Testimonios
- [ ] Solo se incluyen reales verificados (Víctor Castaño y Josse, de Google).
      Agregar más con autorización: foto/miniatura, nombre, tipo de proceso, año y enlace.
- [ ] No usar nombres genéricos ("Cliente CASAHONOR").

## 6. Quiénes somos
- [ ] Sección **institucional sin nombres** (se retiró "Zoraida Fierro García": NO es la gerente).
      Cuando tengan el nombre real y autorizado de la gerencia, agregarlo en `js/config.js`
      (`gerenteNombre`/`gerenteCargo`) y en la sección, con foto y firma reales.
- [ ] Reemplazar imágenes de referencia por **fotografías reales**: oficina, equipo,
      entregas, actividades con Fuerza Pública, propiedades.

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
- [ ] Crear imagen Open Graph `img/og-casahonor.jpg` (1200×630).
- [ ] Optimizar imágenes a **WebP/AVIF** y generar versiones responsivas.
- [ ] Foto profesional real para el hero (propiedad o entrega de llaves).
- [ ] `img/stock/*.jpg` son **fotos stock provisionales** (Pexels, licencia libre sin
      atribución obligatoria) para que "Quiénes somos" no quede vacío. Reemplazar por
      fotografías reales del equipo, oficina y entregas apenas estén disponibles.
