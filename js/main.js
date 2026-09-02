/* ============================================================
   CASAHONOR — main.js
   Rellena datos desde js/config.js, arma enlaces de WhatsApp,
   renderiza el catálogo con filtros y modal, gestiona formularios
   funcionales (validación, consentimiento, anti-spam, respaldo por
   WhatsApp), menú móvil, medición y animaciones discretas.
   ============================================================ */
(function () {
  "use strict";
  var CFG = window.CASAHONOR || {};
  var PROPS = window.CASAHONOR_PROPIEDADES || [];
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- utilidades ---------- */
  function waLink(msg) {
    return "https://wa.me/" + (CFG.whatsapp || "") + "?text=" + encodeURIComponent(msg || "Hola, quiero información.");
  }
  function formatCOP(n) {
    if (!n) return "Consultar";
    return "$" + n.toLocaleString("es-CO");
  }
  function track(event, data) {
    // Medición: se integra con GA/Meta cuando existan (ver [ID_*] en config.js)
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: event }, data || {}));
  }

  /* ---------- inyección de datos de contacto ---------- */
  function fillData() {
    $$("[data-wa]").forEach(function (el) {
      el.setAttribute("href", waLink(el.getAttribute("data-wa")));
      el.addEventListener("click", function () { track("whatsapp_click", { origen: el.getAttribute("data-wa").slice(0, 40) }); });
    });
    var tel = (CFG.telefonos && CFG.telefonos[0]) ? CFG.telefonos[0].replace(/[^0-9+]/g, "") : "";
    $$("[data-tel]").forEach(function (el) { el.setAttribute("href", "tel:" + tel); });
    var pMain = $("[data-phone-main]"); if (pMain && CFG.telefonos) pMain.textContent = CFG.telefonos[0];
    var phones = $("[data-phones]"); if (phones && CFG.telefonos) phones.textContent = CFG.telefonos.join(" · ");
    var email = $("[data-email]"); if (email && CFG.correo) { email.textContent = CFG.correo; email.setAttribute("href", "mailto:" + CFG.correo); }
    var addr = $("[data-address]"); if (addr) addr.textContent = CFG.direccion || "";
    var hours = $("[data-hours]"); if (hours) hours.textContent = CFG.horario || "";
    setHref("[data-fb]", CFG.facebook); setHref("[data-ig]", CFG.instagram); setHref("[data-tk]", CFG.tiktok);
    var map = $("[data-map]"); if (map && CFG.mapsEmbed) map.setAttribute("src", CFG.mapsEmbed);
    var year = $("[data-year]"); if (year) year.textContent = new Date().getFullYear();

    // Reseñas de Google (solo si hay dato confirmado)
    var rTxt = CFG.ratingGoogle
      ? "★ " + CFG.ratingGoogle + (CFG.numeroReseñas ? " · " + CFG.numeroReseñas + " reseñas en Google" : " en Google")
      : "Ver nuestras reseñas en Google";
    $$("[data-google-reviews]").forEach(function (el) {
      el.textContent = rTxt;
      if (CFG.googleReseñas) el.setAttribute("href", CFG.googleReseñas);
    });
    // Tarjeta de rating del hero (solo href + cifras, sin reemplazar el bloque)
    $$("[data-reviews-link]").forEach(function (el) { if (CFG.googleReseñas) el.setAttribute("href", CFG.googleReseñas); });
    var rat = $("[data-rating]"); if (rat && CFG.ratingGoogle) rat.textContent = CFG.ratingGoogle + "★";
    var rsub = $("[data-reviews-sub]"); if (rsub) rsub.textContent = CFG.numeroReseñas ? CFG.numeroReseñas + " reseñas verificadas" : "Reseñas de clientes reales";
    var rcount = $("[data-reviews-count]"); if (rcount) rcount.textContent = (CFG.numeroReseñas ? CFG.numeroReseñas + " reseñas · " : "") + "Google";
    // Sello de oficina del hero → Google Maps (cómo llegar)
    $$("[data-map-link]").forEach(function (el) { if (CFG.mapsLink) el.setAttribute("href", CFG.mapsLink); });
  }
  function setHref(sel, url) { var el = $(sel); if (el && url) el.setAttribute("href", url); }

  /* ---------- rotación de fondo del hero ---------- */
  function initHero() {
    var wrap = $("[data-hero-rotate]"); if (!wrap) return;
    var slides = $$(".hero__slide", wrap); if (slides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var i = 0;
    setInterval(function () {
      slides[i].classList.remove("is-active");
      i = (i + 1) % slides.length;
      slides[i].classList.add("is-active");
    }, 6000);
  }

  /* ---------- desplegables personalizados del buscador ---------- */
  function initDropdowns() {
    var dds = $$(".hsearch__field[data-dd]");
    if (!dds.length) return;
    function closeAll(except) {
      dds.forEach(function (dd) {
        if (dd === except) return;
        var m = $(".hsearch__menu", dd), b = $(".hsearch__btn", dd);
        if (m) m.hidden = true;
        if (b) b.setAttribute("aria-expanded", "false");
        dd.classList.remove("is-open");
      });
    }
    dds.forEach(function (dd) {
      var btn = $(".hsearch__btn", dd), menu = $(".hsearch__menu", dd),
          val = $("[data-dd-val]", dd), sel = $("select", dd), opts = $$(".hsearch__opt", dd);
      if (!btn || !menu || !sel) return;
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var willOpen = menu.hidden;
        closeAll(dd);
        menu.hidden = !willOpen;
        btn.setAttribute("aria-expanded", willOpen ? "true" : "false");
        dd.classList.toggle("is-open", willOpen);
      });
      opts.forEach(function (op) {
        op.addEventListener("click", function (e) {
          e.stopPropagation();
          opts.forEach(function (o) { o.classList.remove("is-sel"); o.setAttribute("aria-selected", "false"); });
          op.classList.add("is-sel"); op.setAttribute("aria-selected", "true");
          if (val) val.textContent = op.textContent;
          sel.value = op.getAttribute("data-val");
          sel.dispatchEvent(new Event("change", { bubbles: true }));
          menu.hidden = true; btn.setAttribute("aria-expanded", "false"); dd.classList.remove("is-open");
        });
      });
    });
    document.addEventListener("click", function () { closeAll(null); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeAll(null); });
  }

  /* ---------- menú móvil ---------- */
  function initMenu() {
    var toggle = $(".hd__toggle"), menu = $("#mobile-menu");
    if (!toggle || !menu) return;
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      menu.hidden = !open;
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    $$("a", menu).forEach(function (a) {
      a.addEventListener("click", function () {
        menu.classList.remove("is-open"); menu.hidden = true; toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- catálogo de propiedades (render dinámico desde el inventario) ---------- */
  var LIMIT = 6, showingAll = false;
  function val(sel) { var el = $(sel); return el ? el.value : ""; }
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

  function areaSpec(p) {
    if (!p.area) return "";
    if (p.areaTipo === "terreno" && p.area >= 10000) return "<b>" + (p.area / 10000).toLocaleString("es-CO") + "</b> ha";
    return "<b>" + p.area.toLocaleString("es-CO") + "</b> m²";
  }
  function galleryHtmlCard(p) {
    var fotos = p.fotos || [p.foto];
    var imgs = fotos.map(function (f, i) {
      return '<img src="' + f + '" alt="' + esc(p.titulo) + ' - foto ' + (i + 1) + '" class="gimg' + (i === 0 ? ' is-active' : '') + '" loading="' + (i === 0 ? 'eager' : 'lazy') + '" width="1100" height="800">';
    }).join("");
    var nav = fotos.length > 1 ? '<button type="button" class="gnav gnav--prev" aria-label="Foto anterior"><svg class="ic"><use href="#ic-chevron-l"/></svg></button><button type="button" class="gnav gnav--next" aria-label="Foto siguiente"><svg class="ic"><use href="#ic-chevron-r"/></svg></button><span class="gcount"><span class="gcount__i">1</span>/' + fotos.length + '</span>' : '';
    return '<div class="card__media gallery" data-gallery>' + imgs + nav + '</div>';
  }
  function cardSpecs(p) {
    var s = [];
    if (p.habitaciones) s.push("<li><b>" + p.habitaciones + "</b> hab</li>");
    if (p["baños"]) s.push("<li><b>" + p["baños"] + "</b> baños</li>");
    var a = areaSpec(p); if (a) s.push("<li>" + a + "</li>");
    if (!s.length) s.push("<li>" + esc(p.tipoLabel || "Inmueble") + " en venta</li>");
    return '<ul class="card__specs">' + s.join("") + "</ul>";
  }
  function featSpecs(p) {
    var s = [];
    if (p.habitaciones) s.push("<li><b>" + p.habitaciones + "</b> habitaciones</li>");
    if (p["baños"]) s.push("<li><b>" + p["baños"] + "</b> baños</li>");
    var a = areaSpec(p); if (a) s.push("<li>" + a + "</li>");
    return s.length ? '<ul class="pfeat__specs">' + s.join("") + "</ul>" : "";
  }
  function dataAttrs(p) {
    return ' data-codigo="' + p.codigo + '" data-op="' + p.op + '" data-tipo="' + p.tipo + '" data-ciudad="' + esc(p.ciudad) + '" data-precio="' + (p.precio || 0) + '" data-hab="' + (p.habitaciones || 0) + '" data-ba="' + (p["baños"] || 0) + '"';
  }
  function infoMsg(p) { return "Hola, me interesa la propiedad código " + p.codigo + ", ubicada en " + p.sector + ", " + p.ciudad + ". Quiero recibir más información."; }

  function cardHtml(p) {
    return '<article class="card"' + dataAttrs(p) + '>' +
      galleryHtmlCard(p) +
      '<span class="card__op">Venta</span><span class="card__code">' + p.codigo + '</span>' +
      '<div class="card__b">' +
        '<span class="card__type">' + esc(p.tipoLabel || p.tipo) + ' · ' + esc(p.ciudad) + '</span>' +
        '<h3 class="card__title">' + esc(p.titulo) + '</h3>' +
        '<span class="card__loc">' + esc(p.sector) + ', ' + esc(p.ciudad) + '</span>' +
        '<span class="card__price">' + formatCOP(p.precio) + '</span>' +
        cardSpecs(p) +
        '<div class="card__actions">' +
          '<button type="button" class="btn btn--ghost" data-detail="' + p.codigo + '">Ver propiedad</button>' +
          '<a class="btn btn--primary" data-wa="' + esc(infoMsg(p)) + '" href="#" target="_blank" rel="noopener">WhatsApp</a>' +
        '</div>' +
      '</div>' +
    '</article>';
  }
  function featHtml(p) {
    return '<article class="pfeat"' + dataAttrs(p) + '>' +
      '<div class="pfeat__img"><img src="' + (p.foto || (p.fotos && p.fotos[0])) + '" alt="' + esc(p.alt || (p.titulo + ", " + p.ciudad)) + '" width="1200" height="800" loading="eager"></div>' +
      '<div class="pfeat__scrim" aria-hidden="true"></div>' +
      '<span class="pfeat__flag">Destacada</span>' +
      '<div class="pfeat__panel glass">' +
        '<span class="ptype">Venta · ' + esc(p.tipoLabel || p.tipo) + ' · Cód. ' + p.codigo + '</span>' +
        '<h3>' + esc(p.titulo) + '</h3>' +
        '<p class="pfeat__loc">' + esc(p.sector) + ', ' + esc(p.ciudad) + '</p>' +
        '<p class="pfeat__price">' + formatCOP(p.precio) + '</p>' +
        featSpecs(p) +
        '<div class="pfeat__actions">' +
          '<button type="button" class="btn btn--primary" data-detail="' + p.codigo + '">Ver propiedad</button>' +
          '<a class="btn btn--glass" data-wa="' + esc(infoMsg(p)) + '" href="#" target="_blank" rel="noopener">Consultar por WhatsApp</a>' +
        '</div>' +
      '</div>' +
    '</article>';
  }
  function renderCatalog() {
    var grid = $("#prop-grid"); if (!grid) return;
    var host = $("#prop-feat-host");
    var feat = PROPS.filter(function (p) { return p.destacada; })[0];
    if (host) host.innerHTML = feat ? featHtml(feat) : "";
    var rest = PROPS.filter(function (p) { return !p.destacada; });
    var vitrina = rest.filter(function (p) { return p.vitrina; });
    var otras = rest.filter(function (p) { return !p.vitrina; });
    grid.innerHTML = vitrina.concat(otras).map(cardHtml).join("");
  }

  function cardMatches(card) {
    var tipo = val("#f-tipo"), ciudad = val("#f-ciudad"),
        precio = parseInt(val("#f-precio") || "0", 10);
    var d = card.dataset;
    if (tipo && d.tipo !== tipo) return false;
    if (ciudad && d.ciudad !== ciudad) return false;
    if (precio && parseInt(d.precio || "0", 10) > precio) return false;
    return true;
  }

  function applyFilters() {
    var grid = $("#prop-grid"); if (!grid) return;
    // Destacada (fuera de la grilla): se oculta si no coincide con el filtro
    var feat = $(".pfeat");
    var featMatch = true;
    if (feat) { featMatch = cardMatches(feat); feat.hidden = !featMatch; }
    var cards = $$(".card", grid);
    var matched = cards.filter(cardMatches);
    cards.forEach(function (c) { c.hidden = true; });
    var shown = showingAll ? matched : matched.slice(0, LIMIT);
    shown.forEach(function (c) { c.hidden = false; });
    var empty = $("#prop-empty");
    if (empty) empty.hidden = (matched.length > 0 || featMatch);
    var btn = $("#ver-todas");
    if (btn) btn.style.display = (matched.length > LIMIT && !showingAll) ? "" : "none";
  }

  function initCatalog() {
    if (!$("#prop-grid")) return;
    $$("#filters select").forEach(function (s) { s.addEventListener("change", function () { showingAll = false; applyFilters(); }); });
    var btn = $("#ver-todas");
    if (btn) btn.addEventListener("click", function () { showingAll = true; applyFilters(); track("ver_todas_propiedades"); });
    // Botones "Ver propiedad" de la destacada y de la grilla
    $$("[data-detail]").forEach(function (b) { b.addEventListener("click", function () { openModal(b.getAttribute("data-detail")); }); });
    applyFilters();
  }

  /* ---------- galerías con flechas ---------- */
  function wireGallery(root) {
    var imgs = $$(".gimg", root), prev = $(".gnav--prev", root), next = $(".gnav--next", root), counter = $(".gcount__i", root);
    if (imgs.length < 2) return;
    var idx = 0;
    function show(i) {
      idx = (i + imgs.length) % imgs.length;
      imgs.forEach(function (im, k) { im.classList.toggle("is-active", k === idx); });
      if (counter) counter.textContent = (idx + 1);
    }
    if (prev) prev.addEventListener("click", function (e) { e.preventDefault(); e.stopPropagation(); show(idx - 1); });
    if (next) next.addEventListener("click", function (e) { e.preventDefault(); e.stopPropagation(); show(idx + 1); });
  }
  function initGalleries() { $$("[data-gallery]").forEach(wireGallery); }
  function galleryHTML(fotos, name) {
    if (!fotos || !fotos.length) return "";
    var imgs = fotos.map(function (f, i) { return '<img src="' + f + '" alt="' + name + ' - foto ' + (i + 1) + '" class="gimg' + (i === 0 ? ' is-active' : '') + '" loading="' + (i === 0 ? 'eager' : 'lazy') + '">'; }).join("");
    var nav = fotos.length > 1 ? '<button type="button" class="gnav gnav--prev" aria-label="Foto anterior"><svg class="ic"><use href="#ic-chevron-l"/></svg></button><button type="button" class="gnav gnav--next" aria-label="Foto siguiente"><svg class="ic"><use href="#ic-chevron-r"/></svg></button><span class="gcount"><span class="gcount__i">1</span>/' + fotos.length + '</span>' : '';
    return '<div class="modal__img gallery" data-gallery>' + imgs + nav + '</div>';
  }

  /* ---------- modal de detalle ---------- */
  var lastFocus = null;
  function openModal(code) {
    var p = PROPS.filter(function (x) { return x.codigo === code; })[0];
    var modal = $("#prop-modal"), content = $("#modal-content");
    if (!p || !modal || !content) return;
    var specs = [];
    if (p.habitaciones) specs.push("<li><b>" + p.habitaciones + "</b> habitaciones</li>");
    if (p.baños) specs.push("<li><b>" + p.baños + "</b> baños</li>");
    if (p.area) specs.push("<li><b>" + p.area + "</b> m²</li>");
    if (p.parqueadero) specs.push("<li><b>" + p.parqueadero + "</b> parqueadero</li>");
    if (p.estrato) specs.push("<li>Estrato <b>" + p.estrato + "</b></li>");
    var visitaMsg = "Hola, quiero agendar una visita a la propiedad código " + p.codigo + " (" + p.titulo + ", " + p.sector + ").";
    var infoMsg = "Hola, me interesa la propiedad código " + p.codigo + ", ubicada en " + p.sector + ", " + p.ciudad + ". Quiero recibir más información.";
    var similares = PROPS.filter(function (x) { return x.codigo !== p.codigo && (x.tipo === p.tipo || x.op === p.op); }).slice(0, 2);

    content.innerHTML =
      galleryHTML(p.fotos || [p.foto], p.titulo) +
      '<div class="modal__body">' +
        '<span class="card__op">' + (p.op === "venta" ? "Venta" : "Arriendo") + '</span>' +
        '<h3 id="modal-title">' + p.titulo + '</h3>' +
        '<p class="card__loc">' + p.sector + ', ' + p.ciudad + ' · Código ' + p.codigo + '</p>' +
        '<p class="modal__price">' + formatCOP(p.precio) + '</p>' +
        (specs.length ? '<ul class="modal__specs">' + specs.join("") + '</ul>' : '') +
        '<p class="modal__desc">' + (p.detalles || "") + '</p>' +
        '<p class="modal__desc"><b>Formas de pago:</b> recursos propios, crédito hipotecario o Caja Honor (Fuerza Pública), según tu perfil. Te orientamos en el proceso.</p>' +
        '<div class="modal__actions">' +
          '<a class="btn btn--primary" href="' + waLink(visitaMsg) + '" target="_blank" rel="noopener">Agendar visita</a>' +
          '<a class="btn btn--ghost" href="' + waLink(infoMsg) + '" target="_blank" rel="noopener">Consultar por WhatsApp</a>' +
        '</div>' +
        (similares.length ? '<p class="card__type" style="margin-top:1.4rem">Propiedades similares</p>' +
          '<div class="modal__actions">' + similares.map(function (s) {
            return '<button type="button" class="btn btn--ghost" data-sim="' + s.codigo + '">' + s.titulo + ' · ' + formatCOP(s.precio) + '</button>';
          }).join("") + '</div>' : '') +
      '</div>';

    lastFocus = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    $(".modal__x", modal).focus();
    var mg = $(".gallery", content); if (mg) wireGallery(mg);
    $$("[data-sim]", content).forEach(function (b) { b.addEventListener("click", function () { openModal(b.getAttribute("data-sim")); }); });
    track("ver_propiedad", { codigo: p.codigo });
  }
  function closeModal() {
    var modal = $("#prop-modal"); if (!modal || modal.hidden) return;
    modal.hidden = true; document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }
  function initModal() {
    var modal = $("#prop-modal"); if (!modal) return;
    $$("[data-close]", modal).forEach(function (el) { el.addEventListener("click", closeModal); });
    document.addEventListener("keydown", function (e) {
      if (modal.hidden) return;
      if (e.key === "Escape") { closeModal(); return; }
      if (e.key !== "Tab") return;
      // focus-trap: mantener el foco dentro del modal mientras está abierto
      var f = $$('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])', modal)
        .filter(function (el) { return !el.disabled && el.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* ---------- formularios ---------- */
  function initForm(id, buildMessage) {
    var form = $("#" + id); if (!form) return;
    var note = $(".formnote", form);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      // anti-spam (honeypot): si está lleno, simulamos éxito y no enviamos
      var hp = $(".hp", form);
      if (hp && hp.value) { done(); return; }
      if (!form.checkValidity()) {
        var bad = $(":invalid", form); if (bad) bad.focus();
        setNote("Revisa los campos obligatorios.", "err"); return;
      }
      var data = collect(form);
      track("form_submit", { formulario: id, necesidad: data.necesidad || data.intencion || "" });
      var msg = buildMessage(data);
      var endpoint = CFG.formEndpoint || "";
      if (/^https?:\/\//.test(endpoint)) {
        setNote("Enviando…", "");
        fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.assign({ origen: id }, data)) })
          .then(function (r) { if (!r.ok) throw new Error("bad"); done(); form.reset(); })
          .catch(function () { fallbackWA(msg); });
      } else {
        fallbackWA(msg);
      }
    });
    function fallbackWA(msg) {
      // Respaldo garantizado: no se pierde la información, se envía por WhatsApp
      window.open(waLink(msg), "_blank", "noopener");
      setNote("Te estamos abriendo WhatsApp con tu mensaje. Si no se abre, escríbenos directamente.", "ok");
    }
    function done() { setNote("¡Gracias! Recibimos tu solicitud. Un asesor te contactará pronto.", "ok"); }
    function setNote(t, cls) { if (note) { note.textContent = t; note.className = "formnote " + (cls || ""); } }
  }
  function collect(form) {
    var o = {};
    $$("input,select,textarea", form).forEach(function (el) {
      if (!el.name || el.type === "checkbox") return;
      o[el.name] = el.value.trim();
    });
    return o;
  }

  function msgContacto(d) {
    return "Nueva solicitud desde la web (Contacto):\n" +
      "• Nombre: " + (d.nombre || "") + "\n" +
      "• WhatsApp: " + (d.whatsapp || "") + "\n" +
      (d.email ? "• Correo: " + d.email + "\n" : "") +
      (d.ciudad ? "• Ciudad: " + d.ciudad + "\n" : "") +
      "• Necesita: " + (d.necesidad || "") + "\n" +
      (d.presupuesto ? "• Presupuesto: " + d.presupuesto + "\n" : "") +
      (d.mensaje ? "• Mensaje: " + d.mensaje + "\n" : "");
  }
  function msgPropietario(d) {
    return "Nueva solicitud de valoración (Propietarios):\n" +
      "• Nombre: " + (d.nombre || "") + "\n" +
      "• WhatsApp: " + (d.whatsapp || "") + "\n" +
      (d.ciudad ? "• Ciudad: " + d.ciudad + "\n" : "") +
      (d.sector ? "• Sector: " + d.sector + "\n" : "") +
      (d.tipo ? "• Tipo: " + d.tipo + "\n" : "") +
      "• Intención: " + (d.intencion || "") + "\n" +
      (d.precio ? "• Precio esperado: " + d.precio + "\n" : "") +
      (d.mensaje ? "• Mensaje: " + d.mensaje + "\n" : "");
  }

  /* ---------- video testimonial (Fuerza Pública) ---------- */
  function initVideo() {
    $$("[data-video]").forEach(function (wrap) {
      var vid = $("video", wrap), btn = $("[data-video-play]", wrap);
      if (!vid || !btn) return;
      function play() {
        wrap.classList.add("is-playing");
        vid.setAttribute("controls", "");
        var p = vid.play();
        if (p && p.catch) p.catch(function () {});
        track("video_play", { origen: "fuerza_publica" });
      }
      btn.addEventListener("click", play);
      vid.addEventListener("play", function () { wrap.classList.add("is-playing"); });
      vid.addEventListener("pause", function () { if (vid.currentTime === 0 || vid.ended) wrap.classList.remove("is-playing"); });
    });
  }

  /* ---------- animaciones discretas ---------- */
  function initReveal() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    var els = $$(".route,.svc,.steps li,.tcard,.diff,.ownform");
    try {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
      }, { threshold: .12 });
      els.forEach(function (el) { el.classList.add("reveal"); io.observe(el); });
      // Seguridad: si algo impide que el observer dispare, revela todo pasado 1.5s
      setTimeout(function () { els.forEach(function (el) { el.classList.add("is-in"); }); }, 1500);
    } catch (e) {
      els.forEach(function (el) { el.classList.remove("reveal"); });
    }
  }

  /* ---------- datos estructurados por propiedad (SEO) ---------- */
  function initSchema() {
    if (!PROPS.length) return;
    var base = (location.origin && location.origin.indexOf("http") === 0) ? location.origin : "https://www.casahonorinmobiliaria.com";
    var items = PROPS.map(function (p, i) {
      return {
        "@type": "ListItem", "position": i + 1,
        "item": {
          "@type": "Product",
          "name": p.titulo + " — " + p.sector + ", " + p.ciudad,
          "image": base + "/" + p.foto,
          "sku": p.codigo,
          "category": p.tipo,
          "offers": { "@type": "Offer", "price": String(p.precio || 0), "priceCurrency": "COP", "availability": "https://schema.org/InStock", "url": base + "/#propiedades" }
        }
      };
    });
    var json = { "@context": "https://schema.org", "@type": "ItemList", "name": "Propiedades destacadas — CASAHONOR", "itemListElement": items };
    var s = document.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(json);
    document.head.appendChild(s);
  }

  /* ---------- init ---------- */
  function boot() {
    [renderCatalog, fillData, initHero, initDropdowns, initMenu, initCatalog, initGalleries, initModal,
     function () { initForm("contact-form", msgContacto); },
     function () { initForm("ownform", msgPropietario); },
     initVideo, initReveal, initSchema
    ].forEach(function (fn) {
      try { fn(); } catch (e) { if (window.console) console.error("[CASAHONOR]", e); }
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
