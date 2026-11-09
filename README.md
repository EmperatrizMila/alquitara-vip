# Alquitara VIP

Sitio web estático del local **Alquitara VIP** (Cerro de Pasco). Hecho con HTML, CSS y JavaScript para publicarlo en **GitHub Pages**.

## Publicar en GitHub Pages

1. Crea un repositorio nuevo en tu cuenta de GitHub (por ejemplo `alquitara-vip`).
2. Sube todos los archivos de esta carpeta (no hace falta Node ni build).
3. En el repo: **Settings → Pages**.
4. En **Source** elige **Deploy from a branch**.
5. Branch: `main` (o `master`) y carpeta: `/ (root)`.
6. Guarda. En uno o dos minutos el sitio queda en:

`https://TU-USUARIO.github.io/NOMBRE-DEL-REPO/`

Si el repo se llama `TU-USUARIO.github.io`, el sitio queda en la raíz: `https://TU-USUARIO.github.io/`.

## Páginas

- `index.html` — Inicio
- `nosotros.html` — Nosotros
- `cumpleanos.html` — Reserva de cumpleaños
- `promos.html` — Promociones
- `programacion.html` — Programación
- `como-llegar.html` — Mapa y datos del local
- `login.html` — Ingreso (demo en el navegador)

El botón de reserva abre WhatsApp. Cambia el número en `js/main.js` (`51999999999`) por el celular real del local.
