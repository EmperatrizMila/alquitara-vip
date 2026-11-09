const USER_KEY = "alquitara_user";

// ===== Supabase =====
const SUPABASE_URL = "https://pfiiqppcziqkzofnadxl.supabase.co";
const SUPABASE_KEY = "PEGA_AQUI_TU_PUBLISHABLE_KEY";
const db = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

function header(active) {
  const user = JSON.parse(localStorage.getItem(USER_KEY) || "null");
  return `
    <header class="header">
      <div class="header-inner">
        <a class="logo" href="index.html">
          <span class="logo-name">Alquitara</span>
          <span class="logo-vip">VIP</span>
        </a>
        <nav class="nav" id="nav">
          <a href="index.html" class="${active === "inicio" ? "active" : ""}">Inicio</a>
          <a href="nosotros.html" class="${active === "nosotros" ? "active" : ""}">Nosotros</a>
          <a href="cumpleanos.html" class="${active === "cumpleanos" ? "active" : ""}">Cumpleaños</a>
          <a href="promos.html" class="${active === "promos" ? "active" : ""}">Promos</a>
          <a href="programacion.html" class="${active === "programacion" ? "active" : ""}">Programación</a>
        </nav>
        <div class="header-actions">
          ${
            user
              ? `<span class="user-chip" style="display:flex">${user.nombre.split(" ")[0]} · <a href="#" id="logout">Salir</a></span>`
              : `<a class="btn-login" href="login.html">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                    <circle cx="12" cy="8" r="3.2"/><path d="M5 19c1.6-3.2 4-4.8 7-4.8S17.4 15.8 19 19"/>
                  </svg>
                  ingresar
                </a>`
          }
          <button class="menu-toggle" id="menuBtn" aria-label="Menú">☰</button>
        </div>
      </div>
    </header>
  `;
}

function footer() {
  return `
    <div class="tape-wrap">
      <div class="tape">
        <div class="tape-track">
          ${"<span>SEGURIDAD GARANTIZADA · +18 · CELEBRA TU CUMPLE CON NOSOTROS · FULL DIVERSIÓN</span>".repeat(8)}
        </div>
      </div>
    </div>
    <footer class="footer">
      <div class="footer-inner">
        <div>Jr. Crespo Castillo Nº 200, Cerro de Pasco</div>
        <div>
          <a href="https://instagram.com/alquitaravip" target="_blank" rel="noopener">@alquitaravip</a>
          · <a href="https://facebook.com/alquitaravip" target="_blank" rel="noopener">Facebook</a>
          · <a href="https://tiktok.com/@alquitaravip" target="_blank" rel="noopener">TikTok</a>
          · <a href="https://instagram.com/alquitaravip" target="_blank" rel="noopener">Instagram</a>
        </div>
        <div>+18 · Seguridad garantizada</div>
      </div>
    </footer>
  `;
}

function icon(name) {
  const icons = {
    cocktail: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M4 4h16l-8 10v6h4"/><path d="M8 20h8"/><path d="M4 4l8 10L20 4"/></svg>`,
    music: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
    pin: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M12 22s7-7.2 7-12a7 7 0 1 0-14 0c0 4.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>`,
    cake: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 8V3"/><path d="M8 14c.8-2 2.2-3 4-3s3.2 1 4 3"/><path d="M5 14h14v7H5z"/></svg>`
  };
  return icons[name] || "";
}

document.addEventListener("DOMContentLoaded", () => {
  const root = document.querySelector("[data-page]");
  if (!root) return;
  const active = root.dataset.page;
  root.insertAdjacentHTML("afterbegin", header(active));
  document.body.insertAdjacentHTML("beforeend", footer());

  const nav = document.getElementById("nav");
  document.getElementById("menuBtn")?.addEventListener("click", () => nav.classList.toggle("open"));
  document.getElementById("logout")?.addEventListener("click", async (e) => {
    e.preventDefault();
    if (db) await db.auth.signOut();
    localStorage.removeItem(USER_KEY);
    location.reload();
  });

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(loginForm));
      const msg = document.getElementById("loginMsg");
      const show = (cls, text) => { msg.className = "msg " + cls; msg.textContent = text; };
      if (!db) return show("err", "No se pudo conectar con Supabase.");
      if (!data.correo || !data.clave || data.clave.length < 6) {
        return show("err", "Ingresa un correo y una clave de al menos 6 caracteres.");
      }
      show("ok", "Procesando...");
      // 1) intenta ingresar; 2) si la cuenta no existe, la crea
      let { data: res, error } = await db.auth.signInWithPassword({ email: data.correo, password: data.clave });
      if (error) {
        const up = await db.auth.signUp({
          email: data.correo,
          password: data.clave,
          options: { data: { nombre: data.nombre || "VIP" } }
        });
        if (up.error) return show("err", "Error: " + up.error.message);
        if (!up.data.session) return show("ok", "Cuenta creada. Revisa tu correo para confirmarla y luego ingresa.");
        res = up.data;
      }
      const nombre = data.nombre || res.user?.user_metadata?.nombre || "VIP";
      localStorage.setItem(USER_KEY, JSON.stringify({ nombre, correo: data.correo }));
      show("ok", "Sesión iniciada. Bienvenido a Alquitara VIP.");
      setTimeout(() => (location.href = "index.html"), 700);
    });
  }

  const reserva = document.getElementById("reservaForm");
  if (reserva) {
    reserva.addEventListener("submit", async (e) => {
      e.preventDefault();
      const d = Object.fromEntries(new FormData(reserva));
      const msg = document.getElementById("reservaMsg");
      // abrir la ventana ya (antes del await) para que el navegador no bloquee WhatsApp
      const wa = window.open("", "_blank");
      msg.className = "msg ok";
      msg.textContent = "Guardando tu reserva...";
      if (db) {
        const { error } = await db.from("reservas").insert({
          nombre: d.nombre,
          celular: d.celular,
          fecha: d.fecha,
          personas: d.personas,
          detalle: d.detalle || null
        });
        if (error) {
          wa?.close();
          msg.className = "msg err";
          msg.textContent = "No se pudo guardar la reserva: " + error.message;
          return;
        }
      }
      const text = encodeURIComponent(
        `Hola Alquitara VIP, quiero reservar un cumpleaños.\nNombre: ${d.nombre}\nFecha: ${d.fecha}\nPersonas: ${d.personas}\nCelular: ${d.celular}\nDetalle: ${d.detalle || "-"}`
      );
      const url = `https://wa.me/51999999999?text=${text}`;
      if (wa) wa.location = url; else window.open(url, "_blank");
      msg.textContent = "Reserva guardada. Abrimos WhatsApp para confirmar.";
      reserva.reset();
    });
  }
});
