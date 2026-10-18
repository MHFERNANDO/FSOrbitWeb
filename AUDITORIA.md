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
- **Métricas reales de los proyectos del portafolio**: `{{TODO: sigue pendiente}}` — no se tocó, sin esto la sección de casos de estudio de Fase 2 queda con placeholder.
- **Tiempos de entrega reales por plan/servicio**: `{{TODO: sigue pendiente}}` — necesario para la sección Proceso/FAQ de Fase 2.
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

## 8. Checklist de acciones fuera del código (para ti)

- Crear/optimizar Perfil de Empresa en Google (categoría "Diseñador de sitios web", Cuenca, fotos, reseñas reales).
- Verificar en Google Search Console y Bing Webmaster Tools, enviar sitemap, pedir indexación.
- Mismo nombre/ciudad/contacto (NAP) en Instagram, Facebook, LinkedIn y directorios locales.
- Pedir a clientes (Accu-Lab, etc.) un enlace "Sitio desarrollado por FS Orbit" en su footer.
