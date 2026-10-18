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

## 5. Lista de `{{TODO}}` — lo que necesito que me confirmes/entregues

- `{{TODO: teléfono con tel: (número real, puede ser uno de los WhatsApp o uno nuevo)}}`
- `{{TODO: dirección física en Cuenca, si existe (calle, sector) — o confirmar que no hay oficina física y se usa solo "Cuenca, Azuay, Ecuador" como área de servicio}}`
- `{{TODO: horario de atención (openingHoursSpecification)}}`
- `{{TODO: testimonios/reseñas reales de clientes (texto + nombre/empresa), si los hay}}`
- `{{TODO: métricas reales de los proyectos del portafolio (Acculab, Gravity, JF Vapes, Lab Diesel) — resultado medible de cada caso, si existe}}`
- `{{TODO: confirmar si https://acculab.bio es el dominio de producción correcto para reemplazar los dos links a acculab.vercel.app}}`
- `{{TODO: confirmar cuenta real de Twitter/X @fsorbit, o quitar twitter:creator}}`
- `{{TODO: perfiles sociales adicionales reales (Facebook, LinkedIn) además de Instagram (https://www.instagram.com/fs_orbit/, ya confirmado en content.js)}}`
- `{{TODO: tiempos de entrega reales por plan/servicio, para la sección Proceso y FAQ}}`
- `{{TODO: Vercel Analytics o GA4? (el brief pide preguntar antes de instalar)}}`

## 6. Checklist de acciones fuera del código (para ti)

- Crear/optimizar Perfil de Empresa en Google (categoría "Diseñador de sitios web", Cuenca, fotos, reseñas reales).
- Verificar en Google Search Console y Bing Webmaster Tools, enviar sitemap, pedir indexación.
- Mismo nombre/ciudad/contacto (NAP) en Instagram, Facebook, LinkedIn y directorios locales.
- Pedir a clientes (Accu-Lab, etc.) un enlace "Sitio desarrollado por FS Orbit" en su footer.
