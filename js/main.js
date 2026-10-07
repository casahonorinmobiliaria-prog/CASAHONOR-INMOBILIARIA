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
    // Muro de reputación (sección Historias): cifras reales desde config, sin inventar
    var repNum = $("[data-rep-num]"); if (repNum && CFG.ratingGoogle) repNum.textContent = CFG.ratingGoogle;
    var repCount = $("[data-rep-count]"); if (repCount && CFG.numeroReseñas) repCount.textContent = CFG.numeroReseñas;
    if (CFG.ratingGoogle) {
      var pct = Math.max(0, Math.min(100, (parseFloat(CFG.ratingGoogle) / 5) * 100));
      var repFill = $("[data-rep-fill]"); if (repFill) repFill.style.setProperty("--fill", pct.toFixed(1) + "%");
      var repMeter = $("[data-rep-meter]"); if (repMeter) repMeter.setAttribute("aria-label", CFG.ratingGoogle + " de 5 estrellas en Google");
    }
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
  var TIPOS = { casa: "Casa", apartamento: "Apartamento", lote: "Lote", local: "Local / Oficina" };
  function val(sel) { var el = $(sel); return el ? el.value : ""; }
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function num(n) { return Number(n).toLocaleString("es-CO"); }
  function plural(n, uno, varios) { return "<b>" + n + "</b> " + (n === 1 ? uno : varios); }

  // Fotos de cada inmueble: img/inmuebles/<código>/01.webp (galería) y 01-800.webp (tarjeta)
  function fotosDe(p) {
    var n = parseInt(p.fotos, 10) || 0, dir = "img/inmuebles/" + String(p.codigo).toLowerCase() + "/", out = [];
    for (var i = 1; i <= n; i++) out.push(dir + (i < 10 ? "0" : "") + i + ".webp");
    return out;
  }
  function thumb(src) { return src.replace(/\.webp$/, "-800.webp"); }
  // URL absoluta: dentro de una variable CSS una ruta relativa se resolvería desde css/
  function absUrl(u) { try { return new URL(u, document.baseURI).href; } catch (e) { return u; } }

  function areaSpec(p) {
    if (!p.area) return "";
    if (p.areaTipo === "terreno" && p.area >= 10000) return "<b>" + num(p.area / 10000) + "</b> ha";
    return "<b>" + num(p.area) + "</b> m²";
  }
  // Solo la primera foto lleva src; las demás se cargan al pasar (data-src)
  function galleryImgs(fotos, name, eager) {
    return fotos.map(function (f, i) {
      var src = (i === 0 ? 'src="' : 'data-src="') + f + '"';
      return '<img ' + src + ' alt="' + esc(name) + ' - foto ' + (i + 1) + '" class="gimg' + (i === 0 ? ' is-active' : '') + '" loading="' + (i === 0 && eager ? "eager" : "lazy") + '" decoding="async">';
    }).join("");
  }
  function galleryNav(n) {
    return n > 1 ? '<button type="button" class="gnav gnav--prev" aria-label="Foto anterior"><svg class="ic"><use href="#ic-chevron-l"/></svg></button><button type="button" class="gnav gnav--next" aria-label="Foto siguiente"><svg class="ic"><use href="#ic-chevron-r"/></svg></button><span class="gcount"><span class="gcount__i">1</span>/' + n + '</span>' : '';
  }
  // Inmueble sin fotos todavía: placa con el nombre del barrio
  function plateHtml(p, cls) {
    var name = String(p.sector || p.ciudad || "");
    return '<div class="plate' + (cls ? " " + cls : "") + '" style="--len:' + Math.max(6, name.length) + '">' +
      '<span class="plate__name" aria-hidden="true">' + esc(name) + '</span>' +
      '<span class="plate__soon"><svg class="ic" aria-hidden="true"><use href="#ic-camera"/></svg>Fotos pronto</span>' +
    '</div>';
  }
  function cardSpecs(p) {
    var s = [];
    if (p.habitaciones) s.push("<li><b>" + p.habitaciones + "</b> hab</li>");
    if (p["baños"]) s.push("<li>" + plural(p["baños"], "baño", "baños") + "</li>");
    var a = areaSpec(p); if (a) s.push("<li>" + a + "</li>");
    if (!s.length) s.push("<li>" + esc(p.tipoLabel || "Inmueble") + " en venta</li>");
    return '<ul class="card__specs">' + s.join("") + "</ul>";
  }
  function featSpecs(p) {
    var s = [];
    if (p.habitaciones) s.push("<li>" + plural(p.habitaciones, "habitación", "habitaciones") + "</li>");
    if (p["baños"]) s.push("<li>" + plural(p["baños"], "baño", "baños") + "</li>");
    var a = areaSpec(p); if (a) s.push("<li>" + a + "</li>");
    return s.length ? '<ul class="pfeat__specs">' + s.join("") + "</ul>" : "";
  }
  function dataAttrs(p) {
    return ' data-codigo="' + p.codigo + '" data-op="' + p.op + '" data-tipo="' + p.tipo + '" data-ciudad="' + esc(p.ciudad) + '" data-precio="' + (p.precio || 0) + '" data-hab="' + (p.habitaciones || 0) + '" data-ba="' + (p["baños"] || 0) + '"';
  }
  function infoMsg(p) { return "Hola, me interesa la propiedad código " + p.codigo + ", ubicada en " + p.sector + ", " + p.ciudad + ". Quiero recibir más información."; }
  function fotosMsg(p) { return "Hola, me interesa la propiedad código " + p.codigo + " en " + p.sector + ", " + p.ciudad + ". ¿Me pueden enviar fotos e información?"; }

  function cardHtml(p) {
    var fotos = fotosDe(p);
    var media = fotos.length
      ? '<div class="card__media gallery" data-gallery style="--gbg:url(' + absUrl(thumb(fotos[0])) + ')">' + galleryImgs(fotos.map(thumb), p.titulo, false) + galleryNav(fotos.length) + '</div>'
      : '<div class="card__media">' + plateHtml(p) + '</div>';
    var wa = fotos.length
      ? '<a class="btn btn--primary" data-wa="' + esc(infoMsg(p)) + '" href="#" target="_blank" rel="noopener">WhatsApp</a>'
      : '<a class="btn btn--primary" data-wa="' + esc(fotosMsg(p)) + '" href="#" target="_blank" rel="noopener"><svg class="ic" aria-hidden="true"><use href="#ic-chat"/></svg>Pedir fotos</a>';
    return '<article class="card' + (fotos.length ? '' : ' card--soon') + '"' + dataAttrs(p) + '>' +
      media +
      '<span class="card__op">Venta</span><span class="card__code">' + p.codigo + '</span>' +
      '<div class="card__b">' +
        '<span class="card__type">' + esc(p.tipoLabel || p.tipo) + ' · ' + esc(p.ciudad) + '</span>' +
        '<h3 class="card__title">' + esc(p.titulo) + '</h3>' +
        '<span class="card__loc">' + esc(p.sector) + ', ' + esc(p.ciudad) + '</span>' +
        '<span class="card__price">' + formatCOP(p.precio) + '</span>' +
        cardSpecs(p) +
        '<div class="card__actions">' +
          '<button type="button" class="btn btn--ghost" data-detail="' + p.codigo + '">Ver propiedad</button>' +
          wa +
        '</div>' +
      '</div>' +
    '</article>';
  }
  function featHtml(p) {
    return '<article class="pfeat"' + dataAttrs(p) + '>' +
      '<div class="pfeat__img"><img src="' + fotosDe(p)[0] + '" alt="' + esc(p.titulo + ", " + p.sector + ", " + p.ciudad) + '" width="1600" height="1200" loading="eager"' + (p.foco ? ' style="object-position:' + esc(p.foco) + '"' : '') + '></div>' +
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
  // Orden de la grilla: vitrina (en su posición), luego con fotos, luego "Fotos pronto"; en esos dos grupos, por precio
  function rango(p) { return p.vitrina ? 0 : (fotosDe(p).length ? 1 : 2); }
  function posVitrina(p) { return typeof p.vitrina === "number" ? p.vitrina : 99; }
  function renderCatalog() {
    var grid = $("#prop-grid"); if (!grid) return;
    var host = $("#prop-feat-host");
    var feat = PROPS.filter(function (p) { return p.destacada && fotosDe(p).length; })[0];
    if (host) host.innerHTML = feat ? featHtml(feat) : "";
    var resto = PROPS.filter(function (p) { return p !== feat; }).sort(function (a, b) {
      return (rango(a) - rango(b)) || (posVitrina(a) - posVitrina(b)) || ((a.precio || 0) - (b.precio || 0));
    });
    grid.innerHTML = resto.map(cardHtml).join("");
  }

  /* ---------- opciones del buscador según el inventario ---------- */
  function buildSearchOptions() {
    if (!PROPS.length) return;
    var ciudades = [], tipos = [];
    PROPS.forEach(function (p) {
      if (p.ciudad && ciudades.indexOf(p.ciudad) < 0) ciudades.push(p.ciudad);
      if (p.tipo && tipos.indexOf(p.tipo) < 0) tipos.push(p.tipo);
    });
    ciudades.sort();
    tipos = Object.keys(TIPOS).filter(function (t) { return tipos.indexOf(t) >= 0; });
    fillOpts("#f-ciudad", "Todo el Huila", ciudades.map(function (c) { return [c, c]; }));
    fillOpts("#f-tipo", "Todos", tipos.map(function (t) { return [t, TIPOS[t]]; }));
  }
  function fillOpts(selId, todos, pares) {
    var sel = $(selId); if (!sel) return;
    var menu = sel.parentNode && $(".hsearch__menu", sel.parentNode);
    sel.innerHTML = '<option value="">' + esc(todos) + '</option>' +
      pares.map(function (o) { return '<option value="' + esc(o[0]) + '">' + esc(o[1]) + '</option>'; }).join("");
    if (menu) menu.innerHTML = '<li class="hsearch__opt is-sel" role="option" aria-selected="true" data-val="">' + esc(todos) + '</li>' +
      pares.map(function (o) { return '<li class="hsearch__opt" role="option" aria-selected="false" data-val="' + esc(o[0]) + '">' + esc(o[1]) + '</li>'; }).join("");
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
    var featMatch = false;
    if (feat) { featMatch = cardMatches(feat); feat.hidden = !featMatch; }
    var cards = $$(".card", grid);
    var matched = cards.filter(cardMatches);
    cards.forEach(function (c) { c.hidden = true; });
    var shown = showingAll ? matched : matched.slice(0, LIMIT);
    shown.forEach(function (c) { c.hidden = false; });
    var empty = $("#prop-empty");
    if (empty) empty.hidden = (matched.length > 0 || featMatch);
    var faltan = matched.length > shown.length;
    $$("[data-ver-todas]").forEach(function (b) { b.hidden = !faltan; });
    var total = $("[data-total]"); if (total) total.textContent = matched.length + (featMatch ? 1 : 0);
  }

  // "Ver todo el inventario": muestra el resto de tarjetas y lleva el foco a la primera nueva
  function verTodas(e) {
    var grid = $("#prop-grid"); if (!grid) return;
    var antes = $$(".card:not([hidden])", grid);
    showingAll = true;
    applyFilters();
    var nuevas = $$(".card:not([hidden])", grid).filter(function (c) { return antes.indexOf(c) < 0; });
    nuevas.forEach(function (c, i) {
      c.classList.remove("is-new"); void c.offsetWidth;
      c.style.setProperty("--i", Math.min(i, 8));
      c.classList.add("is-new");
    });
    var first = nuevas[0] && $("[data-detail]", nuevas[0]);
    if (first) {
      first.focus({ preventScroll: true });
      if (e && e.currentTarget && e.currentTarget.id !== "ver-todas") {
        var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        nuevas[0].scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
      }
    }
    track("ver_todas_propiedades");
  }

  function initCatalog() {
    if (!$("#prop-grid")) return;
    $$("#filters select").forEach(function (s) { s.addEventListener("change", function () { showingAll = false; applyFilters(); }); });
    $$("[data-ver-todas]").forEach(function (b) { b.addEventListener("click", verTodas); });
    // Botones "Ver propiedad" de la destacada y de la grilla
    $$("[data-detail]").forEach(function (b) { b.addEventListener("click", function () { openModal(b.getAttribute("data-detail")); }); });
    applyFilters();
  }
  // Enlace directo a una propiedad: .../#CH-005 abre su ficha
  function openFromHash() {
    var m = /^#(CH-\d+)$/i.exec(location.hash);
    if (!m) return;
    var sec = $("#propiedades"); if (sec) sec.scrollIntoView();
    openModal(m[1].toUpperCase());
  }

  /* ---------- galerías con flechas ---------- */
  function loadImg(im) {
    var s = im && im.getAttribute("data-src");
    if (s) { im.src = s; im.removeAttribute("data-src"); }
  }
  function wireGallery(root, preload) {
    var imgs = $$(".gimg", root), prev = $(".gnav--prev", root), next = $(".gnav--next", root), counter = $(".gcount__i", root);
    if (imgs.length < 2) return;
    var idx = 0;
    function show(i) {
      idx = (i + imgs.length) % imgs.length;
      loadImg(imgs[idx]); loadImg(imgs[(idx + 1) % imgs.length]);
      imgs.forEach(function (im, k) { im.classList.toggle("is-active", k === idx); });
      root.style.setProperty("--gbg", "url(" + absUrl(imgs[idx].getAttribute("src")) + ")");
      if (counter) counter.textContent = (idx + 1);
    }
    // La siguiente foto se pide cuando la persona se acerca a la galería, no antes
    if (preload) loadImg(imgs[1]);
    else {
      root.addEventListener("pointerenter", function () { loadImg(imgs[(idx + 1) % imgs.length]); });
      root.addEventListener("focusin", function () { loadImg(imgs[(idx + 1) % imgs.length]); });
    }
    if (prev) prev.addEventListener("click", function (e) { e.preventDefault(); e.stopPropagation(); show(idx - 1); });
    if (next) next.addEventListener("click", function (e) { e.preventDefault(); e.stopPropagation(); show(idx + 1); });
  }
  function initGalleries() { $$("[data-gallery]").forEach(function (g) { wireGallery(g, false); }); }

  /* ---------- modal de detalle ---------- */
  var lastFocus = null;
  function openModal(code) {
    var p = PROPS.filter(function (x) { return x.codigo === code; })[0];
    var modal = $("#prop-modal"), content = $("#modal-content");
    if (!p || !modal || !content) return;
    var fotos = fotosDe(p);
    var specs = [];
    if (p.habitaciones) specs.push("<li>" + plural(p.habitaciones, "habitación", "habitaciones") + "</li>");
    if (p["baños"]) specs.push("<li>" + plural(p["baños"], "baño", "baños") + "</li>");
    var a = areaSpec(p); if (a) specs.push("<li>" + a + "</li>");
    if (p.parqueadero) specs.push("<li>" + plural(p.parqueadero, "parqueadero", "parqueaderos") + "</li>");
    if (p.estrato) specs.push("<li>Estrato <b>" + p.estrato + "</b></li>");
    var visitaMsg = "Hola, quiero agendar una visita a la propiedad código " + p.codigo + " (" + p.titulo + ", " + p.sector + ").";
    var acciones = fotos.length
      ? '<a class="btn btn--primary" href="' + waLink(visitaMsg) + '" target="_blank" rel="noopener">Agendar visita</a>' +
        '<a class="btn btn--ghost" href="' + waLink(infoMsg(p)) + '" target="_blank" rel="noopener">Consultar por WhatsApp</a>'
      : '<a class="btn btn--primary" href="' + waLink(fotosMsg(p)) + '" target="_blank" rel="noopener">Pedir fotos por WhatsApp</a>' +
        '<a class="btn btn--ghost" href="' + waLink(visitaMsg) + '" target="_blank" rel="noopener">Agendar visita</a>';
    // Similares: mismo tipo, precio más cercano
    var similares = PROPS.filter(function (x) { return x.codigo !== p.codigo && x.tipo === p.tipo; })
      .sort(function (x, y) { return Math.abs((x.precio || 0) - (p.precio || 0)) - Math.abs((y.precio || 0) - (p.precio || 0)); })
      .slice(0, 2);

    content.innerHTML =
      (fotos.length
        ? '<div class="modal__img gallery" data-gallery style="--gbg:url(' + absUrl(fotos[0]) + ')">' + galleryImgs(fotos, p.titulo, true) + galleryNav(fotos.length) + '</div>'
        : plateHtml(p, "plate--modal")) +
      '<div class="modal__body">' +
        '<span class="card__op">Venta</span>' +
        '<h3 id="modal-title">' + esc(p.titulo) + '</h3>' +
        '<p class="card__loc">' + esc(p.sector) + ', ' + esc(p.ciudad) + ' · Código ' + p.codigo + '</p>' +
        '<p class="modal__price">' + formatCOP(p.precio) + '</p>' +
        (specs.length ? '<ul class="modal__specs">' + specs.join("") + '</ul>' : '') +
        (p.detalles ? '<p class="modal__desc">' + esc(p.detalles) + '</p>' : '') +
        '<p class="modal__desc"><b>Formas de pago:</b> recursos propios, crédito hipotecario o Caja Honor (Fuerza Pública), según tu perfil. Te orientamos en el proceso.</p>' +
        '<div class="modal__actions">' + acciones + '</div>' +
        (similares.length ? '<p class="card__type" style="margin-top:1.4rem">Propiedades similares</p>' +
          '<div class="modal__actions">' + similares.map(function (s) {
            return '<button type="button" class="btn btn--ghost" data-sim="' + s.codigo + '">' + esc(s.titulo) + ' · ' + formatCOP(s.precio) + '</button>';
          }).join("") + '</div>' : '') +
      '</div>';

    if (modal.hidden) lastFocus = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    $(".modal__x", modal).focus();
    var mg = $(".gallery", content); if (mg) wireGallery(mg, true);
    $$("[data-sim]", content).forEach(function (b) { b.addEventListener("click", function () { openModal(b.getAttribute("data-sim")); }); });
    // La dirección queda como .../#CH-005 para compartir la ficha
    if (window.history && history.replaceState) history.replaceState(null, "", "#" + p.codigo);
    track("ver_propiedad", { codigo: p.codigo });
  }
  function closeModal() {
    var modal = $("#prop-modal"); if (!modal || modal.hidden) return;
    modal.hidden = true; document.body.style.overflow = "";
    if (/^#CH-\d+$/i.test(location.hash) && window.history && history.replaceState) history.replaceState(null, "", location.pathname + location.search);
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
      (d.sector ? "• Sector / barrio: " + d.sector + "\n" : "") +
      (d.tipo ? "• Tipo de inmueble: " + d.tipo + "\n" : "") +
      (d.area ? "• Área aprox.: " + d.area + " m²\n" : "") +
      (d.precio ? "• Precio esperado: " + d.precio + "\n" : "") +
      "• Interés: Vender";
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
    var els = $$(".route,.svc,.steps li,.rep,.story,.invite,.diff,.ownform");
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
      var item = {
        "@type": "Product",
        "name": p.titulo + " — " + p.sector + ", " + p.ciudad,
        "sku": p.codigo,
        "category": p.tipo,
        "offers": { "@type": "Offer", "price": String(p.precio || 0), "priceCurrency": "COP", "availability": "https://schema.org/InStock", "url": base + "/#" + p.codigo }
      };
      var foto = fotosDe(p)[0]; if (foto) item.image = base + "/" + foto;
      return { "@type": "ListItem", "position": i + 1, "item": item };
    });
    var json = { "@context": "https://schema.org", "@type": "ItemList", "name": "Inmuebles en venta — CASAHONOR", "itemListElement": items };
    var s = document.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(json);
    document.head.appendChild(s);
  }

  /* ---------- init ---------- */
  function boot() {
    [renderCatalog, fillData, initHero, buildSearchOptions, initDropdowns, initMenu, initCatalog, initGalleries, initModal,
     function () { initForm("contact-form", msgContacto); },
     function () { initForm("ownform", msgPropietario); },
     initVideo, initReveal, initSchema, openFromHash
    ].forEach(function (fn) {
      try { fn(); } catch (e) { if (window.console) console.error("[CASAHONOR]", e); }
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
