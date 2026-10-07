/* ============================================================
   CASAHONOR — CONFIGURACIÓN EDITABLE
   ------------------------------------------------------------
   Edita AQUÍ los datos del negocio y las propiedades.
   Los valores marcados con [VERIFICAR] deben confirmarse antes
   de publicar (ver DATOS-A-VERIFICAR.md). No inventes cifras:
   si un dato no está confirmado, déjalo vacío o como marcador.
   ============================================================ */

window.CASAHONOR = {
  /* ---- Contacto (confirmado en el sitio actual / Google) ---- */
  whatsapp: "573136442894",            // número internacional sin "+"
  telefonos: ["+57 313 644 2894", "+57 314 590 5245", "+57 608 863 5218"],
  correo: "clientes@casahonorinmobiliaria.com",
  direccion: "Calle 21 No. 8A-25, Av. Tenerife, Neiva, Huila",
  horario: "Lun–Vie 8:00am–12:00m y 2:00pm–6:00pm · Sáb 8:00am–12:00m",
  mapsEmbed: "https://www.google.com/maps?q=Calle%2021%20No.%208A-25%20Neiva%20Huila&output=embed",
  mapsLink:  "https://www.google.com/maps/search/?api=1&query=Calle+21+No+8A-25+Neiva+Huila",

  /* ---- Redes ---- */
  facebook:  "https://www.facebook.com/Casahonorinmobiliaria",
  instagram: "https://www.instagram.com/casahonorinmobiliaria/",
  tiktok:    "https://www.tiktok.com/@casahonorinmobiliaria",   // [VERIFICAR] usuario exacto
  googleReseñas: "https://www.google.com/search?q=Casa+Honor+Inmobiliaria",

  /* ---- Cifras de confianza ----
     Muestra un dato SOLO si está confirmado. Deja "" para ocultarlo. */
  ratingGoogle:   "4.8",   // verificado en Google (ago 2026) — reconfirmar periódicamente
  numeroReseñas:  "18",    // verificado en Google (ago 2026)
  añosExperiencia:"",      // [VERIFICAR] dato inconsistente (4+ vs 5+) — dejar vacío hasta confirmar
  numeroPropiedades:"",    // [VERIFICAR] varía — dejar vacío o actualizar

  /* ---- Dirección/Gerencia ----
     [VERIFICAR] Dejar vacío hasta tener el nombre real autorizado.
     (Zoraida Fierro García NO es la gerente; no usar ese nombre.) */
  gerenteNombre: "",
  gerenteCargo:  "",

  /* ---- Analítica (rellenar cuando existan) ---- */
  gaId:        "[ID_GOOGLE_ANALYTICS]",
  metaPixelId: "[ID_META_PIXEL]",

  /* ---- Endpoint del formulario ----
     Reemplaza por tu endpoint real (Formspree, CRM, función serverless…).
     Mientras esté vacío o como marcador, el formulario usa WhatsApp como
     respaldo y NO se pierde la información. */
  formEndpoint: "[ENDPOINT_FORMULARIO]"
};

/* ============================================================
   INVENTARIO DE PROPIEDADES
   ------------------------------------------------------------
   Fuente: hoja "Inventario" en Google Drive (carpeta
   "CASAHONOR – Inventario"), una fila y una carpeta de fotos por código.
   Solo van las que dicen Disponible = "sí". Las notas internas no se publican.

   op: "venta"  (no trabajamos arriendos)
   tipo: "casa" | "apartamento" | "lote" | "local"
   destacada: true → la grande de la portada (solo una, debe tener fotos).
   foco: "72% 62%" → qué parte de la foto se ve en la destacada (horizontal vertical).
   vitrina: 1…6    → posición en la grilla de la portada (las demás van después).
   fotos: N        → cuántas fotos hay en img/inmuebles/<código>/01.webp…
                     (las prepara herramientas/fotos-web.ps1). 0 = "Fotos pronto".
   area / parqueadero / estrato: 0 = no se muestra.
   [VERIFICAR] marca datos de la hoja que no cuadran y que no se publican
   hasta confirmarlos.
   ============================================================ */

window.CASAHONOR_PROPIEDADES = [
  { codigo:"CH-002", titulo:"Apartamento en Bosques de San Luis, Torres Azules", op:"venta", tipo:"apartamento", tipoLabel:"Apartamento", ciudad:"Neiva", sector:"Bosques de San Luis", precio:110000000, habitaciones:3, "baños":1, area:48.8, parqueadero:1, estrato:2, vitrina:1, fotos:8 },
  { codigo:"CH-004", titulo:"Apartamento en Bosques de Ciprés", op:"venta", tipo:"apartamento", tipoLabel:"Apartamento", ciudad:"Neiva", sector:"Bosques de Ciprés", precio:100000000, habitaciones:3, "baños":1, area:46.5, parqueadero:0, estrato:2, fotos:0 },
  { codigo:"CH-005", titulo:"Casa en Oasis", op:"venta", tipo:"casa", tipoLabel:"Casa", ciudad:"Neiva", sector:"Oasis", precio:150000000, habitaciones:3, "baños":1, area:78, parqueadero:1, estrato:2, fotos:8 },
  { codigo:"CH-006", titulo:"Casa en Acacias 2ª etapa", op:"venta", tipo:"casa", tipoLabel:"Casa", ciudad:"Neiva", sector:"Acacias 2ª etapa", precio:165000000, habitaciones:4, "baños":2, area:63, parqueadero:1, estrato:2, fotos:7 },
  { codigo:"CH-007", titulo:"Casa en Acacias 1ª etapa", op:"venta", tipo:"casa", tipoLabel:"Casa", ciudad:"Neiva", sector:"Acacias 1ª etapa", precio:180000000, habitaciones:9, "baños":3, area:84, parqueadero:1, estrato:2, fotos:5 },
  { codigo:"CH-008", titulo:"Casa en San Jorge 2ª etapa", op:"venta", tipo:"casa", tipoLabel:"Casa", ciudad:"Neiva", sector:"San Jorge 2ª etapa", precio:205000000, habitaciones:3, "baños":2, area:84, parqueadero:1, estrato:2, fotos:8 },
  { codigo:"CH-009", titulo:"Casa en Cámbulos", op:"venta", tipo:"casa", tipoLabel:"Casa", ciudad:"Neiva", sector:"Cámbulos", precio:220000000, habitaciones:3, "baños":2, area:0, parqueadero:0, estrato:2, fotos:8 },
  // [VERIFICAR] La hoja dice 7.500 m²; en la web anterior figuraba con 115 m² y en Palermo.
  { codigo:"CH-011", titulo:"Casa en Coruña de Berdez", op:"venta", tipo:"casa", tipoLabel:"Casa", ciudad:"Neiva", sector:"Coruña de Berdez", precio:245000000, habitaciones:3, "baños":3, area:0, parqueadero:1, estrato:0, vitrina:6, fotos:6 },
  { codigo:"CH-012", titulo:"Casa en Villa Milena", op:"venta", tipo:"casa", tipoLabel:"Casa", ciudad:"Neiva", sector:"Villa Milena", precio:250000000, habitaciones:3, "baños":1, area:79, parqueadero:0, estrato:2, fotos:6 },
  { codigo:"CH-013", titulo:"Casa en Jardín / Villa Vieja", op:"venta", tipo:"casa", tipoLabel:"Casa", ciudad:"Neiva", sector:"Jardín / Villa Vieja", precio:250000000, habitaciones:7, "baños":7, area:175, parqueadero:0, estrato:2, fotos:6 },
  { codigo:"CH-014", titulo:"Casa en Conjunto San Valentín", op:"venta", tipo:"casa", tipoLabel:"Casa", ciudad:"Neiva", sector:"Conjunto San Valentín", precio:260000000, habitaciones:3, "baños":2, area:105, parqueadero:1, estrato:2, fotos:5 },
  { codigo:"CH-015", titulo:"Casa en Salamanca", op:"venta", tipo:"casa", tipoLabel:"Casa", ciudad:"Neiva", sector:"Salamanca", precio:260000000, habitaciones:3, "baños":2, area:0, parqueadero:0, estrato:2, fotos:0 },
  { codigo:"CH-016", titulo:"Casa en La Gaitana", op:"venta", tipo:"casa", tipoLabel:"Casa", ciudad:"Neiva", sector:"La Gaitana", precio:270000000, habitaciones:5, "baños":3, area:119, parqueadero:1, estrato:3, fotos:8 },
  // [VERIFICAR] La hoja dice 45,8 m²; la CH-014 del mismo conjunto tiene 105 m² por menos precio.
  { codigo:"CH-017", titulo:"Casa en Conjunto San Valentín", op:"venta", tipo:"casa", tipoLabel:"Casa", ciudad:"Neiva", sector:"Conjunto San Valentín", precio:300000000, habitaciones:3, "baños":2, area:0, parqueadero:0, estrato:2, fotos:0 },
  { codigo:"CH-019", titulo:"Casa en Tesoro", op:"venta", tipo:"casa", tipoLabel:"Casa", ciudad:"Neiva", sector:"Tesoro", precio:320000000, habitaciones:3, "baños":3, area:0, parqueadero:0, estrato:2, fotos:0 },
  { codigo:"CH-020", titulo:"Casa en Sendero del Río", op:"venta", tipo:"casa", tipoLabel:"Casa", ciudad:"Neiva", sector:"Sendero del Río", precio:340000000, habitaciones:3, "baños":3, area:0, parqueadero:2, estrato:3, fotos:8 },
  { codigo:"CH-021", titulo:"Casa en La Arboleda", op:"venta", tipo:"casa", tipoLabel:"Casa", ciudad:"Neiva", sector:"La Arboleda", precio:350000000, habitaciones:4, "baños":3, area:0, parqueadero:0, estrato:3, fotos:0 },
  { codigo:"CH-022", titulo:"Casa en Yahaira", op:"venta", tipo:"casa", tipoLabel:"Casa", ciudad:"Neiva", sector:"Yahaira", precio:450000000, habitaciones:5, "baños":3, area:84, parqueadero:0, estrato:2, fotos:10 },
  { codigo:"CH-023", titulo:"Casa en Villa Milena", op:"venta", tipo:"casa", tipoLabel:"Casa", ciudad:"Neiva", sector:"Villa Milena", precio:450000000, habitaciones:7, "baños":4, area:90, parqueadero:2, estrato:2, fotos:0 },
  { codigo:"CH-024", titulo:"Casa en Luis Ignacio Andrade", op:"venta", tipo:"casa", tipoLabel:"Casa", ciudad:"Neiva", sector:"Luis Ignacio Andrade", precio:145000000, habitaciones:3, "baños":1, area:72, parqueadero:0, estrato:0, destacada:true, foco:"60% 58%", fotos:10 },
  { codigo:"CH-025", titulo:"Apartamento en Bosques de San Luis, Torres Azules", op:"venta", tipo:"apartamento", tipoLabel:"Apartamento", ciudad:"Neiva", sector:"Bosques de San Luis", precio:95000000, habitaciones:3, "baños":1, area:0, parqueadero:0, estrato:2, vitrina:3, fotos:0 },
  // [VERIFICAR] La hoja dice Neiva; en la web anterior la urbanización figuraba en Palermo.
  { codigo:"CH-026", titulo:"Casa en Hacienda Santa Bárbara", op:"venta", tipo:"casa", tipoLabel:"Casa", ciudad:"Neiva", sector:"Hacienda Santa Bárbara", precio:270000000, habitaciones:3, "baños":3, area:98.4, parqueadero:1, estrato:0, fotos:0 },
  { codigo:"CH-027", titulo:"Casa en Prados del Sauce", op:"venta", tipo:"casa", tipoLabel:"Casa", ciudad:"Neiva", sector:"Prados del Sauce", precio:148000000, habitaciones:3, "baños":1, area:50.32, parqueadero:1, estrato:2, fotos:10 },
  { codigo:"CH-028", titulo:"Casa en San Luis de la Paz", op:"venta", tipo:"casa", tipoLabel:"Casa", ciudad:"Neiva", sector:"San Luis de la Paz", precio:155000000, habitaciones:3, "baños":1, area:84, parqueadero:0, estrato:2, fotos:0 },
  { codigo:"CH-029", titulo:"Apartamento en Altico, edificio El Mundo", op:"venta", tipo:"apartamento", tipoLabel:"Apartamento", ciudad:"Neiva", sector:"Altico", precio:320000000, habitaciones:4, "baños":1, area:80, parqueadero:0, estrato:4, fotos:0 },
  { codigo:"CH-030", titulo:"Casa en San Jorge 1ª etapa", op:"venta", tipo:"casa", tipoLabel:"Casa", ciudad:"Neiva", sector:"San Jorge 1ª etapa", precio:205000000, habitaciones:3, "baños":1, area:84, parqueadero:0, estrato:2, vitrina:4, fotos:8 },
  { codigo:"CH-031", titulo:"Casa en San Jorge 1ª etapa", op:"venta", tipo:"casa", tipoLabel:"Casa", ciudad:"Neiva", sector:"San Jorge 1ª etapa", precio:220000000, habitaciones:3, "baños":1, area:84, parqueadero:0, estrato:2, vitrina:5, fotos:8 },
  { codigo:"CH-032", titulo:"Apartamento en Bosques de San Luis, 5º piso", op:"venta", tipo:"apartamento", tipoLabel:"Apartamento", ciudad:"Neiva", sector:"Bosques de San Luis", precio:95000000, habitaciones:3, "baños":1, area:43.88, parqueadero:2, estrato:2, vitrina:2, fotos:0 }
];
