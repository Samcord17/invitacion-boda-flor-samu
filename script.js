/* Invitación digital - lógica compartida */
const CONFIG = {
  couple: "Flor & Samu",
  bride: "Flor",
  groom: "Samu",
  date: "2027-07-17T18:00:00",
  dateText: "Sábado 17 de julio de 2027",
  venue: "Bodegas Las Granadas",
  address: "Ctra. Trujillo - Guadalupe Km89, 3 · Herguijuela, Trujillo (Cáceres)",
  phone: "+34 600 000 000",
  email: "djsamcord@gmail.com",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Bodegas+Las+Granadas+Herguijuela+Trujillo",
  mapsEmbed: "https://www.google.com/maps?q=Bodegas+Las+Granadas+Herguijuela+Trujillo&output=embed",
  whatsappNumber: "34653727090",
  whatsappNovio: "34653727090",
  whatsappNovia: "34610687020",
};

// ---------- Navigation ----------
function renderHeader(active) {
  const pages = [
    { href: "index.html", label: "Inicio" },
    { href: "ubicacion.html", label: "Ubicación" },
    { href: "recomendaciones.html", label: "Recomendaciones" },
    { href: "mensaje.html", label: "Mensaje" },
    { href: "encuesta.html", label: "Encuesta" },
    { href: "preboda.html", label: "Preboda" },
  ];
  const navLinks = pages
    .map(p => `<a href="${p.href}" class="${p.href === active ? 'active' : ''}">${p.label}</a>`)
    .join("");
  return `
  <header class="site-header">
    <div class="container header-inner">
      <a class="logo" href="index.html">${CONFIG.couple}</a>
      <button class="menu-btn" aria-label="Menú" onclick="document.querySelector('.nav').classList.toggle('open')">☰</button>
      <nav class="nav">${navLinks}</nav>
    </div>
  </header>`;
}

function renderFooter() {
  return `
  <footer class="site-footer">
    <div class="container">
      <p>Con todo nuestro amor, <strong>${CONFIG.couple}</strong> <span class="hearts">♥</span></p>
      <p>${CONFIG.dateText} · ${CONFIG.venue}</p>
      <p style="margin-top:10px;font-size:12px;">Hecho con cariño · Invitación digital</p>
    </div>
  </footer>
  <a class="floating-wa" href="https://wa.me/${CONFIG.whatsappNumber}" target="_blank" rel="noopener" aria-label="WhatsApp">💬</a>`;
}

function mountLayout(active) {
  const headerSlot = document.getElementById("header-slot");
  const footerSlot = document.getElementById("footer-slot");
  if (headerSlot) headerSlot.innerHTML = renderHeader(active);
  if (footerSlot) footerSlot.innerHTML = renderFooter();
  // close mobile menu on link click
  document.querySelectorAll(".nav a").forEach(a => a.addEventListener("click", () => {
    document.querySelector(".nav")?.classList.remove("open");
  }));
}

// ---------- Countdown ----------
function startCountdown(elId) {
  const el = document.getElementById(elId);
  if (!el) return;
  const target = new Date(CONFIG.date).getTime();
  function tick() {
    const now = Date.now();
    const diff = target - now;
    if (diff <= 0) {
      el.innerHTML = `<div class="box"><div class="num">¡Hoy!</div><div class="lbl">es el día</div></div>`;
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    el.innerHTML = `
      <div class="box"><div class="num">${d}</div><div class="lbl">Días</div></div>
      <div class="box"><div class="num">${h}</div><div class="lbl">Horas</div></div>
      <div class="box"><div class="num">${m}</div><div class="lbl">Min</div></div>
      <div class="box"><div class="num">${s}</div><div class="lbl">Seg</div></div>`;
  }
  tick();
  setInterval(tick, 1000);
}

// ---------- WhatsApp / Email ----------
function openWhatsApp(text) {
  openWhatsAppTo(CONFIG.whatsappNumber, text);
}
function openWhatsAppTo(phone, text) {
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank", "noopener");
}
function openEmail(subject, body) {
  window.location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// ---------- Message form ----------
function initMessageForm() {
  const form = document.getElementById("msg-form");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const name = (fd.get("name") || "").toString().trim();
    const attend = (fd.get("attend") || "").toString();
    const guests = (fd.get("guests") || "1").toString();
    const allergies = (fd.get("allergies") || "").toString().trim();
    const message = (fd.get("message") || "").toString().trim();

    const lines = [
      `Hola ${CONFIG.couple}! Soy ${name}.`,
      `Asistencia: ${attend === "si" ? "Sí, asistiré" : "No podré asistir"}.`,
      attend === "si" ? `Número de personas: ${guests}.` : "",
      allergies ? `Alergias/intolerancias: ${allergies}.` : "Sin alergias conocidas.",
      message ? `Mensaje: ${message}` : "",
    ].filter(Boolean).join("\n");

    const success = document.getElementById("msg-success");
    openWhatsApp(lines);
    if (success) { success.classList.add("show"); success.textContent = "¡Gracias! Se ha abierto WhatsApp con tu mensaje. Si no se abrió, envíalo manualmente."; }
    form.reset();
  });

  // toggle guests field
  const attendSel = form.querySelector('[name="attend"]');
  const guestsField = document.getElementById("guests-field");
  if (attendSel && guestsField) {
    const toggle = () => {
      guestsField.style.display = attendSel.value === "si" ? "block" : "none";
    };
    attendSel.addEventListener("change", toggle);
    toggle();
  }
}

// ---------- Survey ----------
const SURVEY = [
  {
    id: "menu",
    q: "¿Qué opción de menú prefieres?",
    options: ["Carne", "Pescado", "Vegetariano", "Vegano"],
  },
  {
    id: "music",
    q: "¿Qué música no puede faltar en la fiesta?",
    options: ["Pop/Dance", "Reggaetón", "Clásicos 80s/90s", "Bachata/Latino", "Rock"],
  },
  {
    id: "transport",
    q: "¿Cómo vendrás al evento?",
    options: ["Coche propio", "Transporte organizado", "Taxi/Uber", "Aún no lo sé"],
  },
  {
    id: "song",
    q: "¿Hay alguna canción que os gustaría escuchar?",
    type: "text",
    placeholder: "Ej: Perfect - Ed Sheeran",
  },
];

function loadSurveyResults() {
  try { return JSON.parse(localStorage.getItem("surveyResults") || "{}"); }
  catch { return {}; }
}
function saveSurveyResults(r) { localStorage.setItem("surveyResults", JSON.stringify(r)); }

function initSurvey() {
  const container = document.getElementById("survey-container");
  if (!container) return;
  const results = loadSurveyResults();

  container.innerHTML = SURVEY.map(s => {
    if (s.type === "text") {
      return `
      <div class="survey-q card">
        <h3>${s.q}</h3>
        <div class="field">
          <input type="text" name="${s.id}" placeholder="${s.placeholder || ''}" />
        </div>
      </div>`;
    }
    const opts = s.options.map(o => `
      <label class="option">
        <input type="radio" name="${s.id}" value="${o}" required />
        <span>${o}</span>
      </label>`).join("");
    // results bars
    const counts = results[s.id] || {};
    const total = Object.values(counts).reduce((a,b)=>a+b,0);
    const bars = s.options.map(o => {
      const c = counts[o] || 0;
      const pct = total ? Math.round(c/total*100) : 0;
      return `<div class="bar-row">
        <div class="bar-label"><span>${o}</span><span>${c} (${pct}%)</span></div>
        <div class="bar"><span style="width:${pct}%"></span></div>
      </div>`;
    }).join("");
    return `
    <div class="survey-q card">
      <h3>${s.q}</h3>
      <div class="options">${opts}</div>
      <div class="results" id="res-${s.id}">${total ? bars : '<p style="color:var(--muted);font-size:13px;">Aún no hay respuestas.</p>'}</div>
    </div>`;
  }).join("");

  const form = document.getElementById("survey-form");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const answers = {};
    SURVEY.forEach(s => {
      const v = fd.get(s.id);
      if (v) answers[s.id] = v.toString().trim();
    });

    // tally
    const r = loadSurveyResults();
    SURVEY.forEach(s => {
      if (s.type === "text") return;
      const v = answers[s.id];
      if (!v) return;
      r[s.id] = r[s.id] || {};
      r[s.id][v] = (r[s.id][v] || 0) + 1;
    });
    saveSurveyResults(r);

    // build whatsapp message
    const lines = [
      `Encuesta - ${CONFIG.couple}`,
      ...SURVEY.map(s => {
        const v = answers[s.id];
        return v ? `• ${s.q}: ${v}` : null;
      }).filter(Boolean),
    ].join("\n");
    openWhatsApp(lines);

    const success = document.getElementById("survey-success");
    if (success) { success.classList.add("show"); success.textContent = "¡Gracias! Respuestas registradas y enviadas por WhatsApp."; }

    // re-render results
    initSurvey();
  });
}

// ---------- Preboda RSVP ----------
function initPrebodaForm() {
  const form = document.getElementById("preboda-form");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const name = (fd.get("name") || "").toString().trim();
    const attend = (fd.get("attend") || "").toString();
    const guests = (fd.get("guests") || "1").toString();
    const lines = [
      `Preboda - ${CONFIG.couple}`,
      `Soy ${name}.`,
      `Asistencia a la preboda: ${attend === "si" ? "Sí, asistiré" : "No podré asistir"}.`,
      attend === "si" ? `Número de personas: ${guests}.` : "",
    ].filter(Boolean).join("\n");
    openWhatsApp(lines);
    const success = document.getElementById("preboda-success");
    if (success) { success.classList.add("show"); success.textContent = "¡Gracias! Se ha abierto WhatsApp con tu respuesta."; }
    form.reset();
  });
}

// ---------- Auto init ----------
document.addEventListener("DOMContentLoaded", () => {
  // mount layout based on body data-page
  const active = document.body.dataset.page || "index.html";
  mountLayout(active);
  startCountdown("countdown");
  initMessageForm();
  initSurvey();
  initPrebodaForm();
});
