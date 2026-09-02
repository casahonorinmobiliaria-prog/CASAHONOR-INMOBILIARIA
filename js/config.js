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
   [VERIFICAR] Confirmar datos, códigos y emparejamiento foto↔inmueble
   antes de publicar. Para agregar/editar: copia un objeto y ajusta.
   op: "venta" | "arriendo"
   tipo: "casa" | "apartamento" | "lote" | "local"
   ============================================================ */

window.CASAHONOR_PROPIEDADES = [
  { codigo:"CH-01", titulo:"Conjunto La Orquídea", op:"venta", tipo:"lote", tipoLabel:"Lote", ciudad:"Rivera", sector:"Conjunto La Orquídea", precio:85000000, habitaciones:0, "baños":0, area:0, parqueadero:0, estrato:0, destacada:false, foto:"img/properties/ch-01.jpg", fotos:["img/properties/ch-01.jpg","img/properties/ch-01-2.jpg"], alt:"Conjunto La Orquídea, Rivera", detalles:"Lote en Conjunto La Orquídea, Rivera." },
  { codigo:"CH-02", titulo:"Edificio Quinta Avenida", op:"venta", tipo:"apartamento", tipoLabel:"Apartamento", ciudad:"Neiva", sector:"Centro", precio:250000000, habitaciones:0, "baños":3, area:127, parqueadero:0, estrato:0, destacada:false, foto:"img/properties/ch-02.jpg", fotos:["img/properties/ch-02.jpg"], alt:"Edificio Quinta Avenida, Neiva", detalles:"Apartamento en Centro, Neiva." },
  { codigo:"CH-03", titulo:"San Jorge I", op:"venta", tipo:"casa", tipoLabel:"Casa", ciudad:"Neiva", sector:"San Jorge I", precio:165000000, habitaciones:2, "baños":1, area:84, parqueadero:0, estrato:0, destacada:false, foto:"img/properties/ch-03.jpg", fotos:["img/properties/ch-03.jpg"], alt:"San Jorge I, Neiva", detalles:"Casa en San Jorge I, Neiva." },
  { codigo:"CH-04", titulo:"Chapinero", op:"venta", tipo:"casa", tipoLabel:"Casa", ciudad:"Neiva", sector:"Chapinero", precio:0, habitaciones:3, "baños":1, area:333, parqueadero:0, estrato:0, destacada:false, foto:"img/properties/ch-04.jpg", fotos:["img/properties/ch-04.jpg"], alt:"Chapinero, Neiva", detalles:"Casa en Chapinero, Neiva." },
  { codigo:"CH-05", titulo:"La Libertad", op:"venta", tipo:"casa", tipoLabel:"Casa", ciudad:"Neiva", sector:"La Libertad", precio:250000000, habitaciones:6, "baños":2, area:90, parqueadero:0, estrato:0, destacada:false, foto:"img/properties/ch-05.jpg", fotos:["img/properties/ch-05.jpg"], alt:"La Libertad, Neiva", detalles:"Casa en La Libertad, Neiva." },
  { codigo:"CH-06", titulo:"Timanco 4 Etapa", op:"venta", tipo:"casa", tipoLabel:"Casa", ciudad:"Neiva", sector:"Timanco 4 Etapa", precio:160000000, habitaciones:3, "baños":1, area:75, parqueadero:0, estrato:0, destacada:false, foto:"img/properties/ch-06.jpg", fotos:["img/properties/ch-06.jpg"], alt:"Timanco 4 Etapa, Neiva", detalles:"Casa en Timanco 4 Etapa, Neiva." },
  { codigo:"CH-07", titulo:"Brisas del Sena", op:"venta", tipo:"casa", tipoLabel:"Casa", ciudad:"Neiva", sector:"Brisas del Sena", precio:280000000, habitaciones:6, "baños":4, area:98, parqueadero:0, estrato:0, destacada:false, foto:"img/properties/ch-07.jpg", fotos:["img/properties/ch-07.jpg","img/properties/ch-07-2.jpg","img/properties/ch-07-3.jpg","img/properties/ch-07-4.jpg","img/properties/ch-07-5.jpg"], alt:"Brisas del Sena, Neiva", detalles:"Casa en Brisas del Sena, Neiva." },
  { codigo:"CH-08", titulo:"Villa Cecilia", op:"venta", tipo:"casa", tipoLabel:"Casa", ciudad:"Neiva", sector:"Villa Cecilia", precio:300000000, habitaciones:7, "baños":3, area:78, parqueadero:0, estrato:0, destacada:false, foto:"img/properties/ch-08.jpg", fotos:["img/properties/ch-08.jpg","img/properties/ch-08-2.jpg","img/properties/ch-08-3.jpg","img/properties/ch-08-4.jpg","img/properties/ch-08-5.jpg"], alt:"Villa Cecilia, Neiva", detalles:"Casa en Villa Cecilia, Neiva." },
  { codigo:"CH-09", titulo:"Salamanca La Nueva", op:"venta", tipo:"casa", tipoLabel:"Casa", ciudad:"Palermo", sector:"Salamanca La Nueva", precio:175000000, habitaciones:3, "baños":2, area:132, parqueadero:0, estrato:0, destacada:false, foto:"img/properties/ch-09.jpg", fotos:["img/properties/ch-09.jpg"], alt:"Salamanca La Nueva, Palermo", detalles:"Casa en Salamanca La Nueva, Palermo." },
  { codigo:"CH-10", titulo:"Urb. Hda Santa Bárbara", op:"venta", tipo:"casa", tipoLabel:"Casa", ciudad:"Palermo", sector:"Urb. Hda Santa Bárbara", precio:230000000, habitaciones:4, "baños":3, area:98, parqueadero:0, estrato:0, destacada:false, foto:"img/properties/ch-10.jpg", fotos:["img/properties/ch-10.jpg"], alt:"Urb. Hda Santa Bárbara, Palermo", detalles:"Casa en Urb. Hda Santa Bárbara, Palermo." },
  { codigo:"CH-11", titulo:"Urb. Hda Santa Bárbara", op:"venta", tipo:"casa", tipoLabel:"Casa", ciudad:"Palermo", sector:"Urb. Hda Santa Bárbara", precio:160000000, habitaciones:3, "baños":2, area:98, parqueadero:0, estrato:0, destacada:false, foto:"img/properties/ch-11.jpg", fotos:["img/properties/ch-11.jpg"], alt:"Urb. Hda Santa Bárbara, Palermo", detalles:"Casa en Urb. Hda Santa Bárbara, Palermo." },
  { codigo:"CH-12", titulo:"Vereda Santa Bárbara", op:"venta", tipo:"casa", tipoLabel:"Casa campestre", ciudad:"Íquira", sector:"Vereda Santa Bárbara", precio:500000000, habitaciones:3, "baños":1, area:75000, parqueadero:0, estrato:0, destacada:false, foto:"img/properties/ch-12.jpg", fotos:["img/properties/ch-12.jpg"], alt:"Vereda Santa Bárbara, Íquira", detalles:"Casa campestre en Vereda Santa Bárbara, Íquira." },
  { codigo:"CH-13", titulo:"La Coruña de Berdez III", op:"venta", tipo:"casa", tipoLabel:"Casa", ciudad:"Palermo", sector:"Alcalá, km 1 vía Neiva–Bogotá", precio:330000000, habitaciones:4, "baños":2, area:115, parqueadero:0, estrato:0, destacada:false, foto:"img/properties/ch-13.jpg", fotos:["img/properties/ch-13.jpg","img/properties/ch-13-2.jpg","img/properties/ch-13-3.jpg","img/properties/ch-13-4.jpg","img/properties/ch-13-5.jpg"], alt:"La Coruña de Berdez III, Palermo", detalles:"Casa en Alcalá, km 1 vía Neiva–Bogotá, Palermo." },
  { codigo:"CH-14", titulo:"Las Mercedes", op:"venta", tipo:"casa", tipoLabel:"Casa", ciudad:"Neiva", sector:"Las Mercedes", precio:170000000, habitaciones:4, "baños":2, area:121, parqueadero:0, estrato:0, destacada:false, foto:"img/properties/ch-14.jpg", fotos:["img/properties/ch-14.jpg"], alt:"Las Mercedes, Neiva", detalles:"Casa en Las Mercedes, Neiva." },
  { codigo:"CH-15", titulo:"Colombia, Huila", op:"venta", tipo:"casa", tipoLabel:"Finca", ciudad:"Colombia", sector:"Colombia, Huila", precio:300000000, habitaciones:2, "baños":1, area:100000, parqueadero:0, estrato:0, destacada:false, foto:"img/properties/ch-15.jpg", fotos:["img/properties/ch-15.jpg"], alt:"Colombia, Huila, Colombia", detalles:"Finca en Colombia, Huila, Colombia." },
  { codigo:"CH-16", titulo:"El Juncal", op:"venta", tipo:"lote", tipoLabel:"Lote", ciudad:"Huila", sector:"El Juncal", precio:75000000, habitaciones:0, "baños":0, area:1000, parqueadero:0, estrato:0, destacada:false, foto:"img/properties/ch-16.jpg", fotos:["img/properties/ch-16.jpg"], alt:"El Juncal, Huila", detalles:"Lote en El Juncal, Huila." },
  { codigo:"CH-17", titulo:"Conjunto Monteloma #4", op:"venta", tipo:"casa", tipoLabel:"Casa campestre", ciudad:"Rivera", sector:"Conjunto Monteloma", precio:450000000, habitaciones:4, "baños":4, area:300, parqueadero:0, estrato:0, destacada:false, foto:"img/properties/ch-17.jpg", fotos:["img/properties/ch-17.jpg","img/properties/ch-17-2.jpg","img/properties/ch-17-3.jpg","img/properties/ch-17-4.jpg","img/properties/ch-17-5.jpg"], alt:"Conjunto Monteloma #4, Rivera", detalles:"Casa campestre en Conjunto Monteloma, Rivera." },
  { codigo:"CH-18", titulo:"Conjunto Monteloma #5", op:"venta", tipo:"casa", tipoLabel:"Casa campestre", ciudad:"Rivera", sector:"Conjunto Monteloma", precio:450000000, habitaciones:4, "baños":4, area:300, parqueadero:0, estrato:0, destacada:true, foto:"img/properties/ch-18.jpg", fotos:["img/properties/ch-18.jpg","img/properties/ch-18-2.jpg","img/properties/ch-18-3.jpg","img/properties/ch-18-4.jpg","img/properties/ch-18-5.jpg"], alt:"Conjunto Monteloma #5, Rivera", detalles:"Casa campestre en Conjunto Monteloma, Rivera." }
];
