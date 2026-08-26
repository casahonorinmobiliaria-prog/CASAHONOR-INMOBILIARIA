// ===== Menú móvil =====
const toggle = document.querySelector('.nav__toggle');
const menu = document.getElementById('mobile-menu');
if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    menu.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
  });
  menu.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      menu.classList.remove('is-open');
      menu.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
    })
  );
}

// ===== Buscador (envía a WhatsApp con el criterio) =====
const search = document.getElementById('search');
if (search) {
  search.addEventListener('submit', (e) => {
    e.preventDefault();
    const tipo = search.tipo.value || 'cualquier tipo';
    const op = search.operacion.value || 'venta o arriendo';
    const zona = search.zona.value || 'el Huila';
    const msg = `Hola, busco ${tipo} en ${op} en ${zona}. ¿Qué opciones tienen?`;
    window.open(`https://wa.me/573136442894?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
  });
}

// ===== Formulario de contacto =====
const form = document.getElementById('contact-form');
const note = document.getElementById('cform-note');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const nombre = encodeURIComponent(form.nombre.value.trim());
    const tel = encodeURIComponent(form.telefono.value.trim());
    const mensaje = encodeURIComponent(form.mensaje.value.trim());
    const email = encodeURIComponent(form.email.value.trim());
    const wa = `https://wa.me/573136442894?text=${encodeURIComponent('Nuevo contacto desde la web:')}%0A%0ANombre:%20${nombre}%0ATel:%20${tel}%0AEmail:%20${email}%0AMensaje:%20${mensaje}`;
    window.open(wa, '_blank', 'noopener');
    if (note) note.textContent = 'Abrimos WhatsApp con tu mensaje. Si no se abrió, escríbenos al +57 313 644 2894.';
    form.reset();
  });
}

// ===== Reveal on scroll =====
const revealEls = document.querySelectorAll('.section, .card, .service, .zone, .steps li');
revealEls.forEach(el => el.classList.add('reveal'));
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('is-in'));
}
