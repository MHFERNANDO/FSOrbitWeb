# Rediseño FS Orbit — decisiones, límites y pendientes

Rama `rediseno-orbita` (no se tocó `main` ni se hizo push). 15 de noviembre de 2026.

## Decisiones de diseño

- **Stack intacto.** Vite, React 19, React Router 7, Tailwind 4, prerender con Puppeteer, Vercel. Se sumaron `gsap`, `lenis` y `three`. Se quitaron `framer-motion`, radix, lucide, cva y shadcn porque dejaron de usarse.
- **Marca.** Cian `#00F3FB` muestreado del wordmark del logo, sobre negro literal `#000000`. El sitio anterior usaba un verde lima que no venía del logo.
- **Tipografía.** Anybody variable (peso y ancho) en titulares, a peso 700 y con tope de 4.5rem (2.6rem en celular); Instrument Sans en el cuerpo; JetBrains Mono solo dentro del lienzo 3D.
- **Un solo gesto.** El átomo del logo, hecho con caracteres de código, se transforma con el scroll: órbita, plantilla (nueve cajas idénticas, grises, todos los caracteres iguales), layout a medida (cian, con profundidad), tres casos en fila y de vuelta al átomo junto a los planes.
- **El ancho de la letra acompaña.** El titular de la escena de la plantilla se comprime y el del giro se abre. En las páginas interiores el H1 se estrecha al empezar a bajar.
- **El texto no se anima.** Se mueve lo que responde a una acción: menú de celular, preguntas, barra de WhatsApp, estados del mensaje en Contacto. Proceso tiene una única animación: la línea que se llena.
- **Planes como libro de niveles**, no tres tarjetas con badge: precio, para quién, qué incluye, qué no incluye ninguno y qué hace subir el precio.
- **Un solo camino de contacto.** Todo botón principal dice "Escribir por WhatsApp". Se eliminaron el preloader, el modal de asesor, el chat flotante y la vista previa en iframe.
- **Celular pensado aparte.** Debajo de 900 px no hay lienzo 3D: cada escena muestra su figura estática, para que nada se monte sobre el texto. Titulares condensados con wrap normal. Barra fija de WhatsApp cuando no hay otro botón a la vista.

## Cómo funciona por dentro

- `src/lib/capability.js` decide una vez entre escena 3D y versión estática. Va a estática en pantallas de menos de 900 px, con "reducir movimiento", ahorro de datos, sin WebGL2 acelerado, GPU de gama baja conocida, o celular con ≤3 GB o ≤4 núcleos. El HTML es el mismo en ambos casos.
- `src/lib/scroll.js`: Lenis movido por el ticker de GSAP, un solo ciclo; ScrollTrigger orquesta. Se carga después del primer pintado.
- `src/gl/journey.js`: un lienzo, ~1500 instancias (850 en celular). Se pausa fuera de pantalla o con la pestaña oculta, baja la resolución si el equipo no sostiene el ritmo y vuelve a la versión estática si se pierde el contexto gráfico.
- `src/lib/fit.js` + `scripts/measure-display.mjs`: el tamaño de cada titular se calcula con una tabla de anchos de la fuente, sin medir en el navegador.
- El prerender captura siempre la versión estática y separa los tramos de texto contiguos para que React hidrate sin errores.

## URLs

Las 20 URLs anteriores conservan su dirección; no hizo falta ningún 301 nuevo. Nuevas: `/servicios` y `/proceso`. La página local de Cuenca es `/servicios/diseno-web-cuenca`.

## Verificación hecha

- `npm run build`: 23 rutas prerenderizadas y verificadas (title ≤ 60, description 140–155, canónica, un H1, JSON-LD válido, imágenes con alt y dimensiones, sitemap).
- `node scripts/audit-pages.mjs`: 25 rutas en 1366×768 y 375×812 sin desborde horizontal, sin errores de consola, con un H1 y sin objetivos táctiles menores a 24 px.
- Lighthouse móvil (CPU 4x, red lenta simulada), servidor local con las cabeceras de `vercel.json`:
  - Inicio: rendimiento 99, accesibilidad 100, buenas prácticas 100, SEO 100. LCP 1.9 s, CLS 0, TBT 10 ms.
  - Planes: 99 / 100 / 100 / 100. LCP 1.8 s, CLS 0.
- Revisión visual de las cinco escenas con el 3D en escritorio y en celular (emulado).

## Límites conocidos

- **Lighthouse midió la versión estática** de la home: Chrome sin GPU no pasa la prueba de capacidad. El costo del 3D (three pesa 131 KB comprimido, cargado en diferido) no está en esos números.
- **El 3D no se probó en teléfonos reales** ni se midieron cuadros por segundo; solo emulación en un equipo con gráficos Intel integrados.
- **Solo se probó en Chromium.** Safari y Firefox quedan sin verificar; la apertura animada de las preguntas y del menú usa CSS reciente y en navegadores viejos simplemente no se anima.
- **"Reducir movimiento" ahora se respeta** (antes se ignoraba por decisión del 7 de noviembre). Quien lo tenga activo ve la versión estática. Para revisar las animaciones en ese equipo: agregar `?movimiento=1` a la URL (`?movimiento=0` lo revierte).
- Imágenes en WebP, no AVIF: el script de imágenes usa el canvas de Chromium, que no codifica AVIF.
- La CSP mantiene `style-src 'unsafe-inline'` porque React escribe estilos en línea.

## Pendiente (necesita datos o decisión)

2. **Plazos típicos** por tipo de proyecto: Proceso solo dice que el plazo se da con la propuesta.
3. **Condiciones de pago y propiedad del código**: el sitio dice que se acuerdan con cada cliente.
4. **Métricas de clientes**: ningún caso muestra cifras porque no hay.
5. **Imagen de Open Graph**: regenerada con el diseño nuevo (`node scripts/generate-og-image.mjs`).
6. **Política de privacidad**: se corrigieron dos párrafos (ya no hay preloader ni vista previa en iframe; se describe el armador de mensajes) y la fecha. Conviene que la leas.
7. **Precios de servicios sin plan** (UI/UX, mantenimiento, rediseño): figuran como "se cotiza".
8. `AUDITORIA.md` y `legacy-static/` describen el sitio anterior; no se tocaron.

## Revisión del 17 de noviembre

- H1 de la home: "Páginas web hechas desde cero para negocios de Cuenca". Sigue diciendo qué, para quién y dónde, y suma lo que diferencia (sin plantilla).
- El texto del inicio ya no nombra a Pablo y Fernando; dice lo que recibe el cliente. Los nombres quedan en Sobre nosotros y en el schema (`founder`).
- Guías visuales nuevas: miniaturas de los cuatro sitios publicados en el primer viewport, índice lateral del recorrido en pantallas anchas, sección "Qué hacemos" con pictogramas en la home y en Servicios, línea "Ideal si…" en cada plan y miniaturas en "Otros casos".
- Textos de agencia reescritos en servicios ("robustos y escalables", "vender 24/7", "protegemos tu inversión", "se quedó en el pasado").
- SEO/GEO: pregunta "¿Qué es FS Orbit?" en la FAQ de la home (FAQPage), `HowTo` en Proceso, `ItemList` en Servicios y `founder` en la organización.

## Modelo renderizado en Blender (20 de noviembre)

- El objeto de la home ya no se dibuja con WebGL en el navegador. Es una secuencia de 180 cuadros renderizada en Blender 5.2 (`scripts/blender/orbita.py`) que se reproduce con el scroll en un `<canvas>` (`src/seq/sequence.js`). Funciona igual en celular y en equipos sin GPU; `three` salió del proyecto.
- Recorrido: átomo girando → nueve cajas grises iguales (la plantilla) → layout a medida → un monitor hecho de código que muestra la captura del caso que estás leyendo → átomo otra vez, que acompaña planes, servicios y el cierre.
- Cada sección reserva su hueco (`data-slot`). En escritorio el modelo viaja de un hueco a otro; si el siguiente está en la otra columna, o en celular, se apaga en uno y se enciende en el otro, para no pasar por encima del texto.
- Peso: 4.2 MB (720 px, escritorio) o 2.8 MB (480 px, celular), en WebP, pedidos después del primer pintado. Con "reducir movimiento" se ve la versión estática.
- Para volver a renderizar: `blender -b -P scripts/blender/orbita.py -- <carpeta_png> src/seq/screen.json 1000`, y luego convertir a WebP con ffmpeg (brillo con `gblur` + `blend=screen`, ver el historial de este archivo).

## Segunda versión del modelo y tipografía (20 de noviembre)

- Tipografía de titulares: Mona Sans (variable, peso 560–700 y ancho 78–122), recortada a latín con fonttools (73 KB). El cuerpo sigue en Instrument Sans.
- Modelo: el logo completo hecho de código (cuatro órbitas, círculo exterior, círculo central con "FS"), una nube de código tenue alrededor y profundidad de campo. La cámara gira un poco en cada cambio.
- Celular: el modelo es más grande en el inicio y hace de monitor en cada caso, con la captura de ese caso en su pantalla.
- "Reducir movimiento": el modelo se muestra igual, pero solo cambia al hacer scroll (sin giros automáticos ni viajes, solo fundidos).
- Revisión: `node scripts/sweep-home.mjs http://localhost:4180 <carpeta>` recorre la home en escritorio, celular y con movimiento reducido.

## Intro y movimiento continuo (20 de noviembre)

- 210 cuadros: intro (0–29, el código disperso se arma como el logo), loop (30–77, el logo gira y el código corre por las órbitas en sentidos opuestos, "FS" late), y las cuatro transformaciones.
- El intro y el giro se reproducen solos siempre, también con "reducir movimiento" (pedido del cliente). Entre dos cuadros se dibuja una mezcla, para que el scroll se sienta continuo. En escritorio el modelo sigue apenas al mouse.
- Los cuadros se piden después del evento `load`. Lighthouse móvil: LCP 2.4 s con throttling real (devtools); la estimación simulada varía entre 2.7 y 3.8 s porque cuenta las descargas de los cuadros.
- `node scripts/hero-timelapse.mjs http://localhost:4180 <carpeta>` captura el inicio a lo largo del tiempo para comprobar el intro y el giro.
