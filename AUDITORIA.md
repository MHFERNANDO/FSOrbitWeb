# Auditoría FS Orbit — Fase 1 (no se modificó código)

Fecha: 2026-10-17. Rama de trabajo futura: `rediseno-seo-geo` (aún no creada — Fase 1 es solo lectura).

## 1. Stack y estructura real

El directorio raíz (`FS Orbit/`) no es el repo: contiene dos carpetas, `FSOrbit Contenido` (assets/copys sueltos) y **`FSOrbitWeb`**, que es el repo git (`main`, limpio, sin cambios pendientes). Todo lo que sigue se refiere a `FSOrbitWeb`.

- **Framework**: React 19 + React Router 7 (`BrowserRouter`), Vite 8, Tailwind CSS v4 (tokens en `@theme`), Framer Motion, shadcn/radix-ui.
- **Build**: `vite build` → SPA pura. `dist/index.html` = 5.5 KB, un solo bundle `index-*.js` de **444 KB (140 KB gzip)**, un solo CSS de 49 KB. Sin code-splitting por ruta.
- **Rutas React**: solo dos — `/` ([Home.jsx](src/pages/Home.jsx)) y `/proyectos` ([Proyectos.jsx](src/pages/Proyectos.jsx)). No existen `/servicios/*`, `/precios`, `/contacto` ni `/admin` como rutas reales (aunque `robots.txt` menciona `/admin` y `/private`, que no existen en el código).
- **Hosting**: Vercel. [vercel.json](vercel.json) solo define `rewrites: /(.*) → /index.html`. Sin bloque `headers`.
- **Dependencias de producción**: 14 paquetes, razonables (no hay nada exótico). `npm audit` reporta 17 vulnerabilidades (4 moderate, 12 high, 1 critical), pero son todas de la cadena de **devDependencies** (herramientas de build, no se envían al navegador) — no se detectó ninguna vulnerabilidad en dependencias que terminan en el bundle del cliente. Se recomienda `npm audit fix` en Fase 1/6 igual, por higiene.
- **Lighthouse**: no se pudo ejecutar un audit formal en este entorno (sin Chrome headless/lighthouse-cli disponible en el sandbox). Lo que sí se midió directamente: bundle de 444 KB sin dividir, 0 palabras en el HTML crudo (ver abajo), fuentes de Google Fonts no auto-alojadas. Esto apunta a LCP e INP mediocres en móvil, pero son **cifras reales pendientes de medir**, no las voy a inventar. En Fase 6 corro Lighthouse real contra el deploy/preview.

## 2. Hallazgos del brief: verificados contra el código

### Críticos

| # | Hallazgo | Verificado | Evidencia |
|---|---|---|---|
| 1 | HTML servido sin texto | **Confirmado** | `dist/index.html` → `<body><div id="root"></div><script.../></body>`. Conteo de palabras en el body crudo (sin ejecutar JS): **0**. Todo el copy vive en componentes React montados en cliente. |
| 2 | Todas las URLs devuelven 200 con el mismo HTML | **Confirmado** | `vercel.json` solo tiene el rewrite SPA global. No hay configuración de 404 real. |
| 3 | `/proyectos` en el sitemap, idéntica a home, canonical a `/` | **Parcialmente distinto de lo descrito, pero el bug es real** | `Proyectos.jsx` sí usa `useSeo({ path: '/proyectos' })` y el canonical se reescribe a `/proyectos` **vía JS después de montar** ([useSeo.js](src/hooks/useSeo.js)). Para un crawler que no ejecuta JS (WhatsApp, Slack, bots de IA) el `<link rel="canonical">` servido en el HTML crudo es siempre `https://fsorbit.com/` (fijo en `index.html`), así que para esos consumidores sí es un duplicado real de la home. Google (que sí ejecuta JS) vería el canonical correcto, pero tarde y con menos peso. |
| 4 | "Cuenca" no aparece en ninguna parte | **Confirmado** | 0 ocurrencias de "Cuenca" en `src/`, `index.html`, JSON-LD. `geo.placename` = "Ecuador", `ICBM` = `-1.8312, -78.1834` (centro del país). |
| 5 | Cero visibilidad de marca / colisión "Orbit" | No verificable desde el repo (depende de SERPs reales) | Consistente con hallazgo 1: si el HTML no tiene texto, no hay señal de entidad que indexar. |
| 6 | Sin formulario de contacto ni `tel:` | **Confirmado** | [Footer.jsx](src/components/Footer.jsx) solo tiene enlaces `wa.me/...` y `mailto:`. No hay `<form>` en ningún componente. No hay testimonios, FAQ, ni sección "Proceso" en `Home.jsx`. |
| 6b | "714 palabras en total" | Plausible, no verificado con una herramienta externa | El copy real en `content.js` + JSX de `Home.jsx`/`Proyectos.jsx` es efectivamente escaso: 5 servicios con descripción corta, 3 planes, 2 (home) + 4 (proyectos) proyectos con una línea cada uno. Orden de magnitud consistente. |

### SEO técnico / metadatos

- **`<title>` ≠ `og:title`/`twitter:title`**: Confirmado. `index.html` línea 47 vs líneas 16/31.
- **`meta keywords` con "react developer" y "desarrollo scalable"**: Confirmado, línea 9 de `index.html`. Google la ignora; hay que quitarla.
- **`og:image` = Logo 414×414, `twitter:card` = `summary`**: Confirmado, líneas 23–29. Hay un comentario en el propio código (líneas 18-22) explicando que antes apuntaba a un `og-image.jpg` que nunca se subió (404).
- **`twitter:creator @fsorbit` sin verificar existencia**: no pude verificar la cuenta real desde el repo (no hay credenciales de X/Twitter en el proyecto). Queda como `{{TODO: confirmar}}`.
- **H2 pegados para crawlers** ("NuestrasSoluciones", "Inversión enIngeniería Web", "ProyectosRecientes"): **Confirmado y la causa es distinta de lo que decía el brief** — no son `<br>`/spans sin espacio dentro del mismo texto; es que [SplitHeading.jsx](src/components/SplitHeading.jsx) recibe los títulos como **segmentos separados sin espacio entre ellos** (`segments={[{text:'Nuestras'},{text:'Soluciones', highlight:true}]}`) y cada segmento se envuelve en su propio `<span>`, sin texto en blanco entre uno y otro. El resultado en el DOM es literalmente `<span>Nuestras</span><span>Soluciones</span>`.
- **Contadores animados que "vuelcan 0 1 2 3…9 al texto"**: **No confirmado — ya está bien implementado.** Revisé [Odometer.jsx](src/components/Odometer.jsx): la tira de dígitos 0-9 duplicada tiene `aria-hidden="true"`, y el valor final accesible se expone en `aria-label={value}` en el contenedor. Este hallazgo del brief no aplica al código actual; no hay nada que corregir aquí (solo se usa para los números de sección "01"–"05", no hay contadores de métricas tipo "+50 proyectos").
- **Portafolio enlaza a `acculab.vercel.app`**: Confirmado, en `content.js` (`featuredWork` y `projects`), dos URLs: `https://acculab.vercel.app/index.html`. Cambiar a `https://acculab.bio` queda pendiente de que confirmes que ese dominio es correcto y está en producción.
- **JSON-LD solo `Organization` + `BreadcrumbList`**: Confirmado, `index.html` líneas 54–115. Sin `LocalBusiness/ProfessionalService`, `WebSite`, `Service`, `FAQPage`, etc.
- **Sitemap con 2 URLs y `lastmod` manual**: Confirmado, [sitemap.xml](public/sitemap.xml).

### `robots.txt`

Revisé [robots.txt](public/robots.txt) línea por línea:
- `Disallow: *.pdf` sin el `$` final: Confirmado (línea 4). Sintaxis inválida — debería ser `/*.pdf$`.
- Bloque específico `User-agent: Googlebot` que hace que Google ignore el bloque `*`: Confirmado (líneas 10–12). Como el bloque de Googlebot solo tiene `Allow: /`, en la práctica Google no respeta los `Disallow: /admin` y `Disallow: /private` del bloque general.
- `Crawl-delay`: presente en ambos bloques específicos (líneas 12, 17). Google lo ignora (ya no lo soporta); Bing sí lo respetaba parcialmente pero está deprecado en la práctica.
- `/admin` y `/private` no existen como rutas reales en el código (solo `/` y `/proyectos` en `App.jsx`), así que hoy no hay nada que proteger — pero anunciarlas en robots.txt es mala práctica igual si en el futuro se crean.
- Sin permisos explícitos para GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended: Confirmado, no aparecen.

### Seguridad (headers)

`vercel.json` no define ningún header. Confirmado: falta CSP, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`, y el HSTS actual (que vive en la config de Vercel, no en este repo) no se puede verificar desde el código — se revisará en vivo en Fase 7 con `curl -I`.

No hay variables `VITE_*` en el repo (`grep -r VITE_ src` sin resultados), así que no hay riesgo de secretos filtrados en el bundle por ese lado.

## 3. Hallazgo nuevo, no mencionado en el brief original — **requiere tu decisión antes de Fase 2**

### A) La paleta real del sitio NO es cian — es lima/chartreuse

El brief da como referencia aproximada cian (`#22E4F5`) sobre negro. Pero los tokens reales ya definidos en [src/index.css](src/index.css) (líneas 37-41) son:

```css
--color-signal: #c6f24e;   /* lima/chartreuse, no cian */
--color-signal-2: #a9d638;
--color-signal-ink: #090c03;
--signal-a48: rgba(198, 242, 78, .48);
```

Y el fondo real es `--color-ink-1000: #050609` (ese sí coincide con el brief). El `manifest.json` confirma el mismo lima (`theme_color: #C6F24E`). Esta paleta está usada consistentemente en **todo** el código (`bg-signal`, `text-signal`, sombras `--signal-a*`, scrollbar, selección de texto, etc.) — no es un error aislado, es el sistema de diseño completo del sitio.

**No voy a "corregir" esto a cian**: la regla del brief es "mantén la paleta del logo" y "no introduzcas colores de acento nuevos" — el logo real (`public/assets/Logo.png`) y el CSS ya aprobado usan lima, no cian. Voy a documentar y usar como tokens oficiales el lima `#C6F24E` / `#A9D638` sobre `#050609`, salvo que me digas explícitamente que quieres migrar la marca a cian (eso sería un cambio de marca, no una corrección de SEO/seguridad, y no está en el alcance que describiste).

### B) El cliente pidió explícitamente **desactivar** `prefers-reduced-motion`

Hay un comentario largo y explícito en `index.css` (líneas 337-359) que dice, textualmente, que el bloque `@media (prefers-reduced-motion: reduce)` existió, el cliente lo vio "plano" en su Windows con "reducir movimiento" activado, y **pidió de forma explícita y repetida que las animaciones no se apaguen nunca, en ningún caso**. Por eso se quitó tanto ese bloque CSS como todos los `useReducedMotion()` del árbol de componentes.

Esto choca directo con tu regla dura: *"Todas las animaciones respetan `prefers-reduced-motion: reduce` y solo animan `transform` y `opacity`."*

No voy a revertir esa decisión del cliente por mi cuenta — es una decisión de negocio ya tomada y documentada, no un bug.

**Decisiones confirmadas (2026-10-17):**
- **Paleta**: se migra de lima `#C6F24E`/`#A9D638` a cian `#22E4F5` (acento) / `#14A3B8` (teal profundo, variante `--color-signal-2`) sobre el mismo fondo `#050609`. Ya aplicado en `src/index.css`, `public/manifest.json`, `HeroOrbit.jsx`, `Navbar.jsx` y `Proyectos.jsx` (todos los literales `rgba(198,242,78,*)`/`#C6F24E` reemplazados por sus equivalentes en `rgba(34,228,245,*)`/`#22E4F5`). Build verificado y revisado visualmente en el preview (hero, botones, barra de progreso de scroll, CTA final) — sin regresiones.
- **Reduced motion**: se mantiene la decisión ya comunicada al cliente de **no** reintroducir `prefers-reduced-motion`. No se toca `index.css` ni los hooks de animación en ese sentido.

## 4. Plan de cambios priorizado por impacto en captación de clientes

1. **(Crítico, bloquea todo lo demás en SEO)** Prerender/SSG por ruta para que el HTML crudo tenga el contenido, metadatos y JSON-LD completos. Dado que solo hay 2 rutas hoy y se van a agregar ~8 más (servicios, precios, contacto, casos de estudio), evaluaré `vite-react-ssg` (mantiene React/Router/Framer Motion tal cual, cero reescritura) vs. prerender con Puppeteer en build vs. migrar a HTML/CSS/JS estático puro. Mi recomendación preliminar (a confirmar en el plan detallado de Fase 2): **`vite-react-ssg`** — da HTML real por ruta sin tirar el stack de componentes/animaciones ya construido, que es donde está la mayor parte del valor de diseño ya hecho.
2. Arreglar el canonical/meta-por-ruta para que no dependa de JS (hoy `useSeo.js` solo reescribe en cliente) — se resuelve solo con el punto 1.
3. Rutas reales + 404 real (quita el soft-404 del rewrite global).
4. Contenido local: mencionar Cuenca/Azuay, JSON-LD de negocio local con geo real, nuevas rutas de servicios/precios/contacto.
5. Formulario de contacto + `tel:` (pendiente de que me dés el número de teléfono — ver `{{TODO}}` abajo) + eventos de analítica.
6. Metadatos: unificar title/og/twitter, quitar `meta keywords`, OG image 1200×630, `summary_large_image`.
7. `robots.txt` simplificado + permisos a crawlers de IA + `/llms.txt`.
8. Headers de seguridad en `vercel.json` (CSP, nosniff, Referrer-Policy, Permissions-Policy, COOP, HSTS con `includeSubDomains; preload`).
9. Arreglo de los `<span>` pegados en `SplitHeading` (poner espacio entre segmentos).
10. Code-splitting por ruta, imágenes AVIF/WebP con `srcset`, fuentes auto-alojadas — una vez que haya más de 2 rutas esto importa mucho más.
11. Testimonios/FAQ/Proceso: solo con contenido real, componente listo con `{{TODO}}` si no hay datos.

## 5. Lista de `{{TODO}}` — resueltos por el cliente (2026-10-18)

Respuestas recibidas directamente del cliente. Lo que sigue abierto queda marcado como tal.

- **Teléfono**: resuelto. `+593983113942` (mismo número del WhatsApp de ventas) — ya usado como `tel:` en `contact.tel`/`contact.telDisplay` ([content.js](src/data/content.js)), footer y JSON-LD.
- **Dirección física**: resuelto, sin dato publicable. El cliente confirmó que la base está en Cuenca pero que atienden "cualquier lugar" — no se agrega `streetAddress` (no se dio ninguno). El JSON-LD queda con `addressLocality: Cuenca`, `addressRegion: Azuay`, sin calle.
- **Horario de atención**: resuelto — no hay. No se agrega `openingHoursSpecification` al JSON-LD.
- **Testimonios/reseñas**: resuelto — no hay. No se construye la sección de Testimonios en Fase 2 (se omite del todo, no se deja un componente vacío, porque el cliente no pidió reservar el espacio).
- **Link de Acculab**: resuelto. `https://acculab.bio` ya reemplazó las dos referencias a `acculab.vercel.app` en `content.js`.
- **Perfiles sociales adicionales**: resuelto — no hay más que Instagram (`https://www.instagram.com/fs_orbit/`, ya en `sameAs`).
- **Analítica**: resuelto — Vercel Analytics. Instalado (`@vercel/analytics`) y montado en `main.jsx`.
- **Métricas reales de los proyectos del portafolio**: resuelto por decisión del cliente (2026-10-18) — se quitó el formato "Problema / Solución / Resultado" de `/proyectos/:slug` (no quería los placeholders `{{TODO}}` visibles ahí). Cada proyecto ahora muestra solo su descripción ya existente en `content.js`. Si en algún momento das las métricas reales, se puede reintroducir un bloque de resultado.
- **Tiempos de entrega reales por plan/servicio**: resuelto por decisión del cliente (2026-10-18) — en vez de pedir el dato, se reemplazaron las preguntas de FAQ que lo necesitaban por otras que no dependen de esa información. Ver sección 8 ("FAQ") para el detalle.
- **"No hagas el estilo neon"**: aclarado con el cliente — se mantiene cian como color de acento (no se revierte la paleta), pero se redujo la intensidad del glow/bloom en todo el sitio a algo más sutil: botones (CTA hero, "Hablemos", "Ejecutar Proyecto", chat dock), puntos de estado (footer, chat dock), barra de progreso de scroll, preloader y los puntos brillantes del canvas del hero (`HeroOrbit.jsx`) pasaron de blur 8–32px / alpha ~0.48–0.95 a blur 3–16px / alpha ~0.14–0.45 (usando el token `--signal-a24` en vez de `--signal-a48` donde aplica). El color cian en sí no cambió, solo el resplandor alrededor.
- **¿Forzar actualización de `shadcn` (breaking)?**: el cliente pidió forzarla. Se intentó (`npm audit fix --force` → `shadcn@1.0.0`) y **rompió el build**: esa versión mayor ya no exporta `shadcn/tailwind.css`, que `src/index.css` importa directo (`@import "shadcn/tailwind.css";`) — no es solo una CLI de dev, el CSS del tema sí se consume en build. Se revirtió a `shadcn@4.19.0` (la que funcionaba) para no romper la regla de "no avanzar sin que el build pase". Quedan otra vez 6 vulnerabilidades high, todas en la cadena de dependencias de `shadcn` (fast-glob/micromatch/braces/ts-morph) usada solo por su CLI de scaffolding — no se ejecuta en producción ni se envía al bundle del cliente (confirmado: nada de esos paquetes aparece en `dist/assets/*.js`). Arreglarlo de verdad requeriría migrar el import de Tailwind a otra fuente (o esperar a que el shadcn CLI nuevo vuelva a exponer el CSS) — queda fuera de esta sesión, documentado como riesgo aceptado y de bajo impacto real.

## 6. Fase 2 — Arquitectura de prerender (implementado)

Commits `808cf97` (paleta) y `a9d6799` (prerender) en la rama `rediseno-seo-geo`.

- **Arquitectura elegida**: prerender post-build con Puppeteer (`scripts/prerender.mjs`), no `vite-react-ssg`. Motivo: esa librería exige `react-router-dom@^6.14.1` como peer dependency; el sitio usa v7.18.2 y depende de `viewTransition` en `<Link>` para las transiciones entre `/` y `/proyectos` (API estable solo desde v7 — en v6 sería `unstable_viewTransition`, con otro comportamiento). Bajar el router de versión mayor solo para encajar con el prerender era más riesgo que escribir el script. Decisión confirmada con el cliente antes de implementar.
- Cómo funciona: `vite build` compila la SPA normal → `scripts/prerender.mjs` levanta ese `dist/` con el preview server de Vite, visita cada ruta de `src/seo/routes.js` con Chromium headless, espera a que el preloader termine (`body` pierde la clase `is-loading`) y guarda `page.content()` — el DOM ya incluye el `<head>` por ruta que `useSeo.js` escribe en cliente (title, canonical, meta description, og:*, twitter:*) — como `dist/<ruta>/index.html`. No hubo que duplicar la lógica de SEO en un entorno de servidor: el mismo hook que ya existía queda "congelado" en el HTML final.
- `scripts/generate-sitemap.mjs` genera `dist/sitemap.xml` desde la misma `src/seo/routes.js`, con `lastmod` de la fecha del build. `public/sitemap.xml` (a mano, con 2 URLs fijas) se eliminó.
- `vercel.json`: se quitó el rewrite SPA global. Cada ruta real ahora tiene su propio archivo estático en `dist/`; lo que no existe debe devolver 404 real de Vercel. **Pendiente de confirmar en vivo** (Fase 7, `curl -I` contra el deploy) que el comportamiento de servido de directorios de Vercel resuelve `/proyectos` → `dist/proyectos/index.html` sin rewrite — es el comportamiento default documentado, pero no se puede verificar 100% con el preview local de Vite (que sí hace fallback SPA).
- **Importante — no es SSR real, es prerender "snapshot"**: `main.jsx` sigue usando `createRoot(...).render(...)`, no `hydrateRoot`. Cuando el JS carga en un visitante real, React vuelve a montar todo el árbol desde cero sobre el HTML prerenderizado (remount, no hydration). No hay mismatch ni errores — es el mismo patrón que usan herramientas como `react-snap` — pero significa que no hay ganancia de "hydration más rápida"; la ganancia es 100% para crawlers y para el primer pintado de texto. El `Preloader` ya tapa visualmente ese remount para usuarios reales.
- Verificado con el build real: `dist/index.html` pasó de **0 a 720 palabras** en el `<body>` crudo (sin ejecutar JS); `dist/proyectos/index.html`, de 0 a 119. Cada ruta tiene su propio `<title>` y `<link rel="canonical">` ya en el HTML servido, no solo tras hidratar.
- De paso se corrigió `SplitHeading.jsx`: los segmentos de título sin `<br>` entre ellos no llevaban espacio en el DOM (confirmado con el HTML prerenderizado real: `...de</span><span>Alto...`). Ahora se inserta un nodo de texto `" "` entre segmentos consecutivos que no vienen separados por `break`.
- **Limitación actual**: el prerender solo corre sobre las 2 rutas que existen hoy (`/`, `/proyectos`). Las rutas nuevas de Fase 2 de contenido (servicios, precios, proyectos/slug, contacto) se agregan agregando entradas a `src/seo/routes.js` — no requiere tocar el script.

## 7. Fase técnica — robots.txt, headers de seguridad y metadatos (implementado)

Commit en `rediseno-seo-geo` sobre el mismo trabajo de Fase 2.

**`public/robots.txt`**
- `Disallow: *.pdf` → `Disallow: /*.pdf$` (sintaxis válida).
- Se eliminaron los bloques específicos de `Googlebot`/`Bingbot` (hacían que Google ignorara el bloque `*`) y el `Crawl-delay` (Google no lo usa; Bing lo tiene deprecado).
- Se quitaron `Disallow: /admin` y `Disallow: /private`: esas rutas no existen en el código (`App.jsx` solo define `/` y `/proyectos`), así que anunciarlas en robots.txt solo revelaba nombres de rutas sin proteger nada real. Si en el futuro se construye un panel, se protege con auth + `noindex`, no con robots.txt.
- Se agregó `Allow: /` explícito para GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot y Google-Extended.

**`vercel.json` — headers de seguridad** (aplican a todas las rutas vía `source: "/(.*)"`)
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` deshabilita cámara, micrófono, geolocalización, pagos, USB, sensores de movimiento y FLoC (`interest-cohort`) — el sitio no usa ninguno.
- `Cross-Origin-Opener-Policy: same-origin`
- `Content-Security-Policy-Report-Only` (intencionalmente en modo *report-only*, no enforced todavía, siguiendo la instrucción del brief de ajustar antes de activar): `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'`.
  - `style-src 'unsafe-inline'` es necesario porque Framer Motion controla las animaciones con estilos inline dinámicos (`style="transform:..."`) en casi todos los componentes — sin esto se rompería toda la animación del sitio. No hay forma práctica de usar nonces ahí sin reescribir el motor de animaciones.
  - **Pendiente antes de activarlo como `Content-Security-Policy` real**: los dos bloques `<script type="application/ld+json">` del `<head>` son scripts inline; con `script-src 'self'` estricto, Chrome los reporta como violación (aunque no ejecutan código). Antes de enforced hay que agregarles un hash SHA-256 a `script-src` o mover el JSON-LD a un archivo externo. Se deja documentado para no activar un CSP que rompa el JSON-LD sin darse cuenta.
  - No hay endpoint de `report-to`/`report-uri` configurado — en este modo las violaciones solo se ven en la consola del navegador, no se centralizan. Suficiente para probar manualmente antes de Fase 7; si se quiere monitoreo real hace falta un endpoint de reportes.

**Metadatos (`index.html`, `useSeo` de Home/Proyectos, JSON-LD)**
- `<title>`, `og:title` y `twitter:title` unificados: **"FS Orbit | Desarrollo Web en Cuenca, Ecuador"** (antes eran tres textos distintos). Mismo criterio en la descripción (meta description = og:description = twitter:description), reescrita sin relleno tipo "ecosistemas digitales potentes": *"Desarrollo web de alto rendimiento en Cuenca, Ecuador. Código a medida, sin plantillas: landing pages, e-commerce y software custom con SEO técnico y carga ultra-rápida."*
- `meta name="keywords"` eliminada (Google la ignora; tenía además el typo "desarrollo scalable").
- `geo.placename` → "Cuenca, Ecuador", `geo.region` → "EC-A" (código ISO 3166-2 de Azuay), `ICBM` → coordenadas reales de Cuenca (`-2.9001, -79.0059`, antes apuntaba al centro geográfico de Ecuador).
- `twitter:creator` (`@fsorbit`) eliminado: no pude verificar que esa cuenta exista — por la regla de no inventar datos, se quita en vez de dejar una afirmación sin confirmar. Si existe de verdad, es un `{{TODO}}` trivial de volver a agregar.
- **Imagen OG nueva**: se generó `public/assets/og-image.png` (1200×630, con `scripts/generate-og-image.mjs` — Puppeteer renderiza una tarjeta HTML con el logo real, la paleta cian del sitio y el copy ya unificado, nada inventado) en vez de servir `Logo.png` (414×414) como miniatura. `og:image:width/height` actualizados a 1200/630 y `twitter:card` pasó de `summary` a `summary_large_image`.
- JSON-LD `Organization`: `address` ahora tiene `addressLocality: "Cuenca"` y `addressRegion: "Azuay"` (antes `addressLocality: "Ecuador"`, un error de nivel — un país no es una localidad); se agregó `geo` (GeoCoordinates) y `areaServed`. `sameAs` apuntaba a `instagram.com/fsorbit` (sin guión bajo, cuenta no confirmada); se corrigió a la cuenta real que ya estaba confirmada en `content.js`: `https://www.instagram.com/fs_orbit/`. Se quitó el campo `founder` (solo decía "FS Orbit Team", sin valor informativo real).
- Todos los enlaces externos (`target="_blank"`) pasaron de `rel="noopener"` a `rel="noopener noreferrer"` (7 instancias en `Home.jsx`, `Proyectos.jsx`, `Footer.jsx`, `ChatDock.jsx`, `ProjectPreviewModal.jsx`).
- `npm audit fix` (sin `--force`): bajó de 17 a 7 vulnerabilidades. Las 7 restantes son todas de la cadena de `shadcn` (herramienta CLI de scaffolding, devDependency, no se envía al bundle del cliente) y requieren una actualización mayor (`shadcn@1.0.0`, breaking). No se aplicó sin confirmar — es una dependencia de desarrollo, no de producción, así que el riesgo real es bajo; queda como `{{TODO: decidir si forzamos la actualización de shadcn (breaking) para limpiar el audit al 100%}}`.

**Verificado**: build completo (`vite build` + prerender + sitemap) pasa; `dist/index.html` confirma título unificado, `og:image` apuntando a `og-image.png`, sin `meta keywords` ni `twitter:creator`.

## 8. Fase 2 — Contenido: rutas nuevas, casos de estudio, formulario de contacto (implementado)

Build verificado completo (9 rutas + 404, todas con contenido real en el HTML crudo, sin ejecutar JS — ver tabla abajo). Commits en `rediseno-seo-geo`.

**Rutas nuevas** (todas con su propio `<title>`, `canonical`, meta description, OG/Twitter y JSON-LD — via `useSeo` extendido, ver abajo):

| Ruta | Palabras en HTML crudo | Contenido |
|---|---|---|
| `/servicios/diseno-web-cuenca` | 267 (5× "Cuenca") | Landing local principal. Reutiliza las descripciones reales de "Desarrollo Web" y "Diseño UI/UX" de `content.js`. |
| `/servicios/tiendas-online` | 238 | Reutiliza la descripción real de "E-commerce" + features del plan Orbit Commerce. |
| `/servicios/rediseno-y-optimizacion` | 248 | Reutiliza "Optimización & Upgrade" + "Mantenimiento Web". |
| `/precios` | 310 | Los 3 planes reales (`pricingPlans` de `content.js`), misma data que ya se mostraba en home, ahora con URL propia. |
| `/proyectos/<slug>` ×4 | 106–138 c/u | Caso de estudio por proyecto: Problema / Solución / Resultado. "Solución" reutiliza la descripción real ya aprobada; "Problema" y "Resultado" quedan en `{{TODO}}` visible en la página — no hay esos datos en ningún lado del repo y el cliente no los dio. |
| `/contacto` | 136 | WhatsApp, `tel:`, `mailto:`, zona de servicio ("Cuenca, Azuay — proyectos en todo Ecuador") + formulario. |
| `/404` (y ruta `*`) | 106, `noindex` | Página de error real y útil, con enlaces a cada servicio, precios, proyectos y contacto. Generada también como `dist/404.html` para que Vercel la sirva en cualquier URL sin match. |

**Arquitectura compartida**: las 3 landings de servicios usan una plantilla común (`src/pages/ServicePage.jsx`) para no triplicar el layout — cada página solo aporta datos (título, intro, highlights, FAQ). El resto (Home, Proyectos, Precios, Contacto, detalle de proyecto, 404) son páginas propias.

**`useSeo` extendido** ([src/hooks/useSeo.js](src/hooks/useSeo.js)): ahora además de title/canonical/description acepta `jsonLd` (inyecta/limpia un `<script type="application/ld+json">` por ruta) y `noindex` (fuerza `robots: noindex, follow` y lo restaura al desmontar — usado solo en 404). Los helpers para armar `BreadcrumbList`, `Service` y `FAQPage` sin repetir boilerplate están en `src/seo/jsonld.js`. El `Organization` global (con telephone/geo/sameAs reales) sigue viviendo en `index.html`, compartido por todas las rutas.

**FAQ**: cada pregunta con dato real de `content.js` se contestó con ese dato (SEO incluido, qué cubre el mantenimiento, precio desde, gestión de inventario, cómo se reciben pedidos). Las 8 preguntas que originalmente dependían de datos que no estaban en el repo (tiempos de entrega, formas de pago, dominio/hosting, pasarela de pago, si el contenido es editable, proceso de auditoría, precio de rediseño) se **reemplazaron** (2026-10-18, a pedido del cliente, que prefería no tener que responder preguntas ambiguas) por preguntas distintas que sí se pueden contestar con honestidad usando solo lo que ya está confirmado en el sitio — nunca inventando la respuesta original. Ejemplos: en vez de "¿cuánto tiempo toma?", "¿el sitio se ve bien en celular?" (sí, responsive ya confirmado); en vez de "¿qué formas de pago aceptan?", "¿qué pasa si mi proyecto no encaja en los 3 planes?" (se cotiza por WhatsApp). Ya no quedan `{{TODO}}` en ningún FAQ del sitio.

**Navegación interna**: el footer ahora tiene una columna "Enlaces" a las 3 landings de servicios, precios, proyectos y contacto (antes el footer no enlazaba a nada de esto). El botón "Hablemos" del navbar (desktop y drawer móvil) pasó de hacer scroll a un ancla `#contacto` en el footer a navegar de verdad a `/contacto` — la página con el formulario real. El navbar ganó un link a "Precios".

**Formulario de contacto** ([src/pages/Contacto.jsx](src/pages/Contacto.jsx) + [api/contact.js](api/contact.js)): nombre, negocio, tipo de proyecto, presupuesto aproximado y mensaje (los campos que pediste), con honeypot (campo `website` oculto por CSS, invisible para una persona) y estado de éxito/error claro en el cliente.
- El endpoint es una Vercel Serverless Function en `/api/contact` (Node.js, detectada automáticamente por estar en `/api`). Valida campos, descarta honeypot, aplica un rate-limit best-effort en memoria por IP (3 envíos/minuto) y reenvía el mensaje por email usando la API REST de Resend — un solo `fetch`, sin librería adicional.
- **El email destino nunca se expone al cliente**: solo existe en la variable de entorno `CONTACT_TO_EMAIL` del servidor. El HTML/JS que se sirve al navegador no lo contiene en ningún lado.
- `{{TODO: configurar en Vercel las variables de entorno RESEND_API_KEY y CONTACT_TO_EMAIL antes de que el formulario funcione en producción}}`. Sin `RESEND_API_KEY`, el endpoint responde 500 con un error claro (no falla en silencio).
- `{{TODO: verificar el dominio fsorbit.com en la cuenta de Resend}}` — el `from` del email es `web@fsorbit.com`; Resend rechaza el envío si ese dominio no está verificado en la cuenta. Sin verificar, hay que usar temporalmente `onboarding@resend.dev` como `from` (Resend lo permite en modo sandbox, solo entregando al email del dueño de la cuenta).
- **Limitación conocida y documentada**: el rate-limit vive en memoria dentro de la función — no es compartido entre instancias paralelas de Vercel ni sobrevive a un cold start. Es una segunda barrera además del honeypot, no una protección robusta contra spam a volumen. Si hace falta algo más serio, la migración natural es `@vercel/kv` o Upstash para un contador compartido — no se agregó en esta sesión para no sumar otra pieza de infraestructura sin que la pidieras.

**Nuevo**: 2 íconos agregados al sprite (`pin`, `phone`) para los datos de contacto; `clock` también quedó disponible aunque no se usa todavía (no hay horario que mostrar).

**Bug propio detectado y corregido durante esta fase**: al agregar las rutas nuevas, un `useNavigate` quedó usado en `Navbar.jsx` sin su import (lo había quitado al simplificar el botón "Hablemos") — tiraba abajo toda la SPA (pantalla en negro, cero contenido en todas las rutas). Se detectó porque el build volvió a dar 0 palabras en *todas* las rutas prerenderizadas, no solo una — la auditoría de palabras por ruta (ver tabla arriba) sirvió exactamente para lo que se diseñó: detectar esto antes de dar la fase por cerrada, no después.

## 9. Paleta — reducción del acento cian (implementado, 2026-10-18)

Pedido explícito del cliente: el cian (#22E4F5) dejó de ser "el color del sitio" (fondos, bordes, glows, íconos por todas partes) para pasar a ser un acento puntual — 2-3 focos de atención por pantalla, nunca fondo, nunca borde grueso, nunca glow difuminado en reposo. El cian del logo no cambia.

**Por qué**: legibilidad (demasiado cian compite con el texto en vez de dirigir la vista), percepción de marca premium (un acento usado con disciplina lee como una decisión de diseño; usado en todas partes lee como "tema por defecto de una librería de componentes"), y foco de atención (si todo es el color de marca, nada destaca como *la* acción a tomar).

**Tokens nuevos/ajustados en [src/index.css](src/index.css)**:

| Antes | Después | Nota |
|---|---|---|
| `--color-ink-1000` `#050609` | `#0b0d10` | fondo base |
| `--color-ink-900` `#07080c` | `#121417` | superficie 1 (tarjetas) |
| `--color-ink-800` `#0d0f15` | `#171a1e` | superficie 2 (tarjetas elevadas/hover) |
| `--color-text` `#edf0f6` | `#d4d7db` | texto primario |
| `--color-text-2` `#a3acbc` | `#868a90` | texto secundario (ajustado por contraste, ver abajo) |
| `--color-text-3` `#7b8494` | `#808488` | texto muted (ajustado por contraste) |
| `--color-signal-2` `#14a3b8` | *(eliminado)* | ya no hay variante secundaria de cian |
| `--signal-a24` `rgba(…,.24)`, `--signal-a48` `rgba(…,.48)` | *(eliminados)* | glow amplio prohibido |
| *(nuevo)* | `--signal-a08` `rgba(34,228,245,.08)` | `--accent-glow`, solo hover del CTA principal |
| `--line` `rgba(255,255,255,.075)` | `#1c2024` (sólido) | `--border` |
| `--line-2` `rgba(255,255,255,.13)` | `#272c31` (sólido) | `--border-strong` |
| `--color-signal` `#22e4f5` | sin cambio | el acento en sí no cambia |
| `--color-signal-ink` `#04171c` | `#06262a` | texto sobre relleno de acento |

**Elemento por elemento — qué se quedó cian y qué pasó a neutro** (la lista completa está en los commits; resumen por tipo):

Se quedan cian (los únicos usos permitidos):
- CTA principal de cada sección (un botón relleno por sección, nunca dos compitiendo): hero, planes destacados, cada landing de servicio, formulario de contacto, modal del asesor, preview de proyecto, botón flotante del chat.
- Estado activo de navegación (el link de la página actual, nuevo — antes no existía indicador de "dónde estoy") y el anillo de foco global (`--ring`, ya apuntaba al acento).
- Íconos funcionales dentro de las tarjetas de servicio (`/`, `/servicios/*`) — es la excepción que vos mismo marcaste como permitida.
- Subrayados de hover en links de texto (email/teléfono del footer, ahora neutros por defecto y cian solo al hover+underline).
- Un puñado de acentos tipográficos puntuales que funcionan como "la única cosa que destaca en esta sección" sin ser fondo/borde/glow: la palabra resaltada en cada H1/H2 (`SplitHeading`), la etiqueta "FS Orbit Pure Code" en la comparación de arquitectura, el label "Solución" en cada caso de estudio, "Volver al inicio" en el 404.

Pasan a neutro (texto secundario/muted, bordes `--border`/`--border-strong`, superficies):
- Todos los kickers/etiquetas de sección ("Arquitectura Limpia", "Niveles de Despliegue", "Diseño Web — Cuenca", etc.) en las 9 rutas.
- Badges informativos ("EL MÁS SOLICITADO") y checkmarks de listas de features (18 checks solo en la sección de precios de Home).
- Botones secundarios/outline junto a un CTA principal ("Ver trabajos", "Ver precios", planes no destacados) — antes todos tenían hover cian, ahora es "uno, no varios" por sección.
- Barra de progreso de scroll del navbar (chrome ambiental, no un punto de atención).
- El tinte radial cian de fondo global (`SiteBg.jsx`) — exactamente el "fondo con el acento" que la regla prohíbe; reemplazado por un tinte blanco neutro de la misma sutileza.
- La tarjeta comparativa "FS Orbit Pure Code" (antes `border-signal-a48 bg-signal-a06`, un fondo + borde cian): ahora superficie y borde neutros, solo el título queda como acento.
- Scrollbar del sitio (antes cian sólido todo el scroll, chrome persistente) → gris neutro.
- Íconos de contacto en Footer y `/contacto` (WhatsApp, teléfono, correo, ubicación) — eran 4+ círculos cian simultáneos; ahora neutros con hover sutil.
- Íconos de las opciones del ChatDock y del asesor de 3 pasos (AdvisorModal) — varias opciones a la vez no pueden ser todas "la" opción destacada.
- El token "string" del resaltado de sintaxis en `CodeWindow.jsx` (decoración de editor de código, no UI de marca) pasó de cian a un verde convencional de sintaxis, coherente con los otros colores ya hardcodeados ahí (morado, azul, amarillo).
- Glows: todo `box-shadow`/`drop-shadow` del acento que usaba `--signal-a24`/`--signal-a48` (8-32px de blur, hasta 48% de opacidad) bajó a `--signal-a08`/`--signal-a12` (3-18px, 8-12% de opacidad) y, salvo en el CTA principal al hover, se eliminó en reposo. El canvas del hero (`HeroOrbit.jsx`) se dejó como arte ambiental de marca, no como "UI chrome" — ya tenía solo 2 de 4 órbitas en cian antes de este cambio, y su `shadowBlur` ya estaba por debajo del límite de 16px desde el pase de "reducir el estilo neón" anterior en esta misma sesión; se documenta la distinción (arte de fondo vs. elementos de interfaz) como criterio aplicado, no como omisión.

**Contraste AA — verificado y corregido**: los valores que pedía el spec para `--text-secondary` (#7d8187) y `--text-muted` (#55595e) fallaban AA (< 4.5:1) contra las superficies de tarjeta más claras del sitio (`--color-ink-800` / `#171a1e`, usada en el ChatDock, `CodeWindow` y las tarjetas de precios) — hasta 2.76:1 en el peor caso. Se ajustaron a `#868a90` y `#808488` respectivamente, verificados por cálculo de luminancia relativa (WCAG) contra las 3 superficies reales del sitio (`--bg`, `--color-ink-900`, `--color-ink-800`):

| Color | vs. `--bg` | vs. `ink-900` | vs. `ink-800` |
|---|---|---|---|
| `--text` sobre fondo | 13.47:1 | 12.78:1 | 12.09:1 |
| `--text-2` sobre fondo | 5.61:1 | 5.32:1 | 5.03:1 |
| `--text-3` sobre fondo | 5.16:1 | 4.90:1 | 4.63:1 |
| `--color-signal` (acento) sobre fondo | 12.49:1 | 11.85:1 | 11.21:1 |
| `--color-signal-ink` sobre `--color-signal` (texto de botón relleno) | 10.23:1 | — | — |

Todo por encima de 4.5:1 (AA, texto normal) en los tres fondos reales del sitio. `--color-text-4` (#5b5f65) se mantiene definido mas no se usa en ningún texto legible — los 4 usos que tenía (número de servicio en Home, placeholder del formulario, numeración de línea del CodeWindow, el "%" del preloader) se migraron a `--color-text-3`, que sí pasa AA, porque esos textos sí comunican información (no son decoración pura) y un verificador automático de contraste los va a evaluar igual.

**Actualización (Fase 7)**: se corrió Lighthouse real (no estimado) contra el build — accesibilidad quedó en **100/100** en las 3 rutas verificadas. Ver sección "Fase 7 — Verificación" más abajo para el detalle completo, incluyendo 2 bugs de accesibilidad reales que esa corrida encontró (no relacionados al cambio de contraste) y ya se corrigieron.

**Verificado visualmente** en el preview: home (hero, arquitectura, servicios, precios), `/precios` standalone y `/contacto` — en cada pantalla revisada, el cian aparece en 2-3 elementos como máximo (normalmente: el botón flotante de chat, que es persistente en todo el sitio, más el CTA principal de la sección y a veces la palabra resaltada del título).

## 10. Fase 7 — Verificación (hecha localmente contra el build, 2026-10-18)

No hay un deploy en vivo todavía, así que todo lo que sigue se corrió contra `dist/` servido localmente (`vite preview`) — lo que depende de la infraestructura real de Vercel (códigos HTTP de 404, los headers de seguridad llegando de verdad) queda marcado como pendiente de repetir una vez que exista una URL real.

**Contenido real en el HTML crudo, por ruta** (script propio, sin ejecutar JS — lee `dist/**/index.html` directo): las 11 rutas + `404.html` tienen `<h1>`, al menos una mención de "Cuenca" y JSON-LD válido (JSON.parse sin error):

| Ruta | Palabras | H1 | "Cuenca" | Bloques JSON-LD |
|---|---|---|---|---|
| `/` | 740 | ✅ | 1 | 2 (válidos) |
| `/proyectos` | 138 | ✅ | 1 | 2 (válidos) |
| `/proyectos/gravity-studio` | 85 | ✅ | 1 | 2 (válidos) |
| `/proyectos/acculab-system` | 94 | ✅ | 1 | 2 (válidos) |
| `/proyectos/jf-vapes-store` | 94 | ✅ | 1 | 2 (válidos) |
| `/proyectos/laboratorio-diesel-mg` | 94 | ✅ | 1 | 2 (válidos) |
| `/servicios/diseno-web-cuenca` | 267 | ✅ | 5 | 2 (válidos) |
| `/servicios/tiendas-online` | 238 | ✅ | 2 | 2 (válidos) |
| `/servicios/rediseno-y-optimizacion` | 248 | ✅ | 1 | 2 (válidos) |
| `/precios` | 310 | ✅ | 1 | 2 (válidos) |
| `/contacto` | 136 | ✅ | 3 | 2 (válidos) |
| `404.html` | 106 | ✅ | 2 | 1 (válido) |

**Lighthouse real (mobile, Chromium de Puppeteer vía `npx lighthouse`, no estimado)** contra `/`, `/servicios/diseno-web-cuenca` y `/contacto`:

| Ruta | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| `/` | 84 | **100** | 96 | **100** | 3.2s | 0.008 | 130ms |
| `/servicios/diseno-web-cuenca` | 85 | **100** | 96 | **100** | 3.5s | 0.008 | 50ms |
| `/contacto` | 84 | **100** | 96 | **100** | 3.5s | 0.003 | 80ms |

- **Accesibilidad**: llegó a 100/100 después de corregir 2 bugs reales que esta misma corrida encontró (no relacionados al cambio de paleta/contraste): `Odometer.jsx` tenía `aria-label` en un `<span>` sin rol que lo admita (se agregó `role="img"`), y había saltos de nivel de heading (H2→H4) en `Home.jsx` y en los títulos del footer (H4 sin H2/H3 intermedio en páginas como `/contacto`) — corregidos a H3 y H2 respectivamente.
- **SEO**: 100/100 en las 3 rutas.
- **Best Practices**: 96/100, no 100, por un único ítem: `/_vercel/insights/script.js` da 404 en este entorno porque esa ruta la sirve la infraestructura de Vercel en producción (el script de Vercel Analytics), no `vite preview` local — no es un bug de código, se verifica solo en el deploy real.
- **Performance**: 84-85/100, no llega al objetivo de ≥95. El CLS (0.003-0.008) y el TBT (50-130ms) ya cumplen sobradamente. Lo que pesa es el **LCP (3.2-3.5s vs. el objetivo de <2.0s)**: el `Preloader` tapa toda la pantalla con una animación de carga durante ~2s en la primera visita (más ~1.35s de cortina de salida) antes de desmontarse — eso retrasa directamente cuándo se pinta el contenido real. Esto es una **decisión explícita del cliente ya documentada en el propio código** (`index.css`, bloque "DECISIÓN DEL CLIENTE"): no se tocó sin confirmarlo primero. Si en algún momento se quiere perseguir el objetivo de Performance ≥95, achicar la duración del preloader (hoy 2000ms + 1350ms) es la palanca más directa — pero es exactamente la decisión que ya se tomó en sentido contrario.

**Pendiente de verificar contra un deploy real** (no se puede probar localmente de forma representativa):
- `curl -I` de una ruta inexistente → debe dar 404 real (depende de cómo Vercel resuelve archivos estáticos sin el rewrite que se quitó en Fase 2 — la lógica está lista, `dist/404.html` existe, pero el comportamiento de servido de Vercel solo se confirma en vivo).
- `curl -I /` mostrando todos los headers de seguridad configurados en `vercel.json` (Vercel los agrega al servir, no existen en los archivos estáticos).
- Validación de JSON-LD contra el Rich Results Test de Google / schema.org validator (se validó que el JSON es sintácticamente válido; falta la validación semántica contra sus reglas específicas, que requiere la URL pública).
- Prueba con `prefers-reduced-motion: reduce` activado: **intencionalmente no se implementa** — decisión del cliente ya documentada (ver sección 3 de esta auditoría), así que no hay nada que probar ahí.

## 11. Auditoría post-lanzamiento de fsorbit.com en producción (2026-10-18)

**Lo que ya está bien en producción** (verificado contra `https://fsorbit.com`, no local): las 11 rutas devuelven 200 con contenido real en el HTML (130-740 palabras, leído con user-agent de GPTBot); una ruta inexistente devuelve **404 real**; los 6 headers de seguridad llegan; `robots.txt`, `sitemap.xml` y `llms.txt` responden; title, description, canonical y JSON-LD propios por ruta. Lighthouse móvil en producción: Accesibilidad 100, Best Practices 100, SEO 100.

**Corregido en esta auditoría**:
- Las 3 landings de servicio servían `<link rel="modulepreload" href="http://127.0.0.1:4321/...">`: el prerender capturaba el origen del servidor local. Ahora se reescribe a rutas relativas.
- Los H1 de dos líneas se leían pegados para extractores simples ("Páginas webdiseñadas"). Se agregó un espacio antes del `<br>`.

**Lo que falta, por impacto en aparecer primero**:

1. **No hay señales externas de que FS Orbit existe** (lo más importante). Una búsqueda de "FS Orbit desarrollo web Cuenca" no devuelve el sitio ni ninguna mención de la marca: solo agencias homónimas (Orbit Media Studios en Chicago, Orbitwebtech en India, ORBIT Dev en Túnez). Los buscadores con IA citan lo que terceros dicen de un negocio, no solo lo que el negocio dice de sí mismo. Falta: Perfil de Empresa en Google, Bing Webmaster Tools (Bing alimenta la búsqueda de ChatGPT y Copilot), fichas en directorios (Clutch, GoodFirms, DesignRush, Sortlist, TechBehemoths), página de LinkedIn y Facebook con el mismo nombre/ciudad/teléfono. Hoy `sameAs` en el JSON-LD solo tiene Instagram.
2. **Reseñas reales**: no hay ninguna. Son lo que más pesa en el paquete local de Google ("diseño web Cuenca" con mapa) y lo que habilita estrellas en resultados.
3. **Enlaces desde los sitios de clientes**: los 4 proyectos podrían llevar "Sitio desarrollado por FS Orbit" en el footer. Dos de ellos (JF Vapes, Laboratorio Diesel MG) están en subdominios `*.vercel.app`, que casi no transmiten autoridad.
4. **Correo en dominio propio**: `fsorbitt@gmail.com` (con doble t) resta confianza frente a `contacto@fsorbit.com`.
5. **Rendimiento móvil en producción: 49/100** (LCP 3.7s, TBT 6.4s con la CPU limitada que simula Lighthouse). Es la única categoría bajo el objetivo. Causas: el preloader tapa el contenido ~3.3s (decisión del cliente, no se tocó); React vuelve a montar toda la página prerenderizada en vez de hidratarla (`createRoot` en lugar de `hydrateRoot`); cada palabra de cada título es un componente animado de Framer Motion; bundle principal de 450KB. Google usa datos de usuarios reales para esto y el sitio aún no tiene tráfico suficiente para que cuenten, así que pesa menos que los puntos 1-4, pero sí afecta la experiencia de quien llega desde un celular.
6. **El H1 de la home no dice qué hacen ni dónde**: "Tu presencia online, diseñada con precisión." El title sí dice "Desarrollo Web en Cuenca, Ecuador", el H1 no. Las landings de servicio sí lo resuelven ("Páginas web diseñadas en Cuenca.").
7. **Poco contenido que una IA pueda citar**: las páginas de proyecto tienen ~90 palabras y las de servicio ~250. Una sección de guías con respuestas directas a lo que la gente pregunta ("¿Cuánto cuesta una página web en Ecuador?", "¿WordPress o código a medida?", "¿Qué necesita una tienda online en Ecuador?") daría material citable.
8. **Meta descriptions largas**: la home (169 caracteres), `/proyectos` (180) y rediseño (165) pasan de ~160 y Google las corta.

## 12. Checklist de acciones fuera del código (para ti)

- Crear/optimizar Perfil de Empresa en Google (categoría "Diseñador de sitios web", Cuenca, fotos, reseñas reales).
- Verificar en Google Search Console y Bing Webmaster Tools, enviar sitemap, pedir indexación.
- Mismo nombre/ciudad/contacto (NAP) en Instagram, Facebook, LinkedIn y directorios locales.
- Pedir a clientes (Accu-Lab, etc.) un enlace "Sitio desarrollado por FS Orbit" en su footer.
- Crear una cuenta en [Resend](https://resend.com), verificar el dominio `fsorbit.com` y generar un API key.
- En el proyecto de Vercel: agregar las variables de entorno `RESEND_API_KEY` y `CONTACT_TO_EMAIL` (el email donde quieres recibir los mensajes del formulario) — sin esto el formulario de `/contacto` no envía nada.
