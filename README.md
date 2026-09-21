# Plantilla Web para Colegios (Bilingüe)

Una plantilla de sitio web lista para usar, pensada para colegios, academias o
institutos educativos. No necesitas instalar nada ni usar herramientas de
programación — son archivos HTML, CSS y JavaScript simples que puedes abrir y
editar directamente, o subir a cualquier servicio de hosting. Incluye un
selector de idioma (Español / English) en la parte superior de cada página.

## Qué incluye

- `index.html` — Página de inicio
- `sobre-nosotros.html` — Historia, misión, visión y equipo
- `programas.html` — Programas académicos por nivel
- `admisiones.html` — Proceso de admisión, requisitos y aranceles
- `contacto.html` — Formulario de contacto e información
- `css/style.css` — Todos los estilos y colores
- `js/script.js` — Menú móvil y comportamiento del formulario

## Cómo personalizar

**1. Nombre del colegio y textos**
Busca y reemplaza "Colegio Horizonte" por el nombre real de tu institución en
los 5 archivos `.html`. Luego ajusta los textos de cada sección con tu propia
información (historia, programas, aranceles, contacto).

**2. Colores**
Abre `css/style.css` y edita las variables al inicio del archivo:

```css
:root {
  --navy: #1d3557;   /* color principal */
  --gold: #e9b44c;   /* color de acento / botones */
  --paper: #f7f5f0;  /* fondo general */
}
```

Cambiando estos valores, el color se actualiza en todo el sitio automáticamente.

**3. Logo**
El logo actual es un ícono simple dibujado en SVG (dentro de cada `.html`,
dentro de `<span class="logo-mark">`). Puedes reemplazarlo por tu propio logo
en imagen:

```html
<span class="logo-mark"><img src="assets/tu-logo.png" alt="Tu Colegio" style="width:20px;"></span>
```

**4. Fotos**
Los espacios marcados como "Foto o video de tu institución" son marcadores de
posición (`.hero-visual`, `.placeholder-label`). Reemplázalos por una imagen real:

```html
<div class="hero-visual">
  <img src="assets/tu-foto.jpg" alt="Campus" style="width:100%; height:100%; object-fit:cover; border-radius:16px;">
</div>
```

**5. Formulario de contacto**
El formulario de `contacto.html` es una demostración: al enviarlo, solo
muestra un mensaje de aviso (ver `js/script.js`). Para recibir mensajes reales,
conéctalo a un servicio como [Formspree](https://formspree.io) o
[Netlify Forms](https://www.netlify.com/products/forms/), o a tu propio backend.

**6. Mapa**
Reemplaza el bloque `.map-placeholder` en `contacto.html` por un iframe de
Google Maps (Compartir → Insertar un mapa, en Google Maps).

**7. Idioma / Bilingüe**
Cada texto del sitio existe dos veces en el HTML — una vez en español, una vez
en inglés — marcado con el atributo `data-lang`:

```html
<h2 data-lang="es">Nuestros programas</h2>
<h2 data-lang="en" hidden>Our programs</h2>
```

`js/script.js` muestra u oculta estos elementos según el idioma elegido
(botón ES/EN en el header) y recuerda la elección del visitante. Para editar
un texto, busca ambas versiones (`data-lang="es"` y `data-lang="en"`) y
actualízalas por separado. El idioma inicial se detecta del navegador del
visitante si nunca ha elegido uno manualmente.

Si quieres quitar el inglés y dejar el sitio solo en español, simplemente
elimina el bloque `.lang-switch` del `<nav>` en cada página y borra los
elementos con `data-lang="en"`.

## Cómo publicar tu sitio

Puedes subir esta carpeta completa a cualquier servicio de hosting estático:
Netlify, Vercel, GitHub Pages, o tu propio proveedor de hosting. No requiere
proceso de build — solo sube los archivos tal cual.

---

Plantilla creada por Carla Montaño — carlamontano.io
