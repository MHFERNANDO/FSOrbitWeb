// Prerender post-build: levanta el dist/ recien compilado con el server
// de preview de Vite, visita cada ruta real de src/seo/routes.js con
// Chromium headless y guarda el DOM final (ya con el <head> por ruta que
// escribe useSeo.js) como HTML estatico. Asi cada ruta sale del build
// con su propio archivo, con todo el contenido, metadatos y JSON-LD ya
// en el marcado que reciben los crawlers que no ejecutan JS.
//
// No se migro a una libreria de SSG (vite-react-ssg) porque exige
// react-router-dom ^6, y el sitio depende de viewTransition en <Link>,
// una API que solo existe estabilizada en v7. Bajar el router de
// version mayor solo para encajar con el prerender era mas riesgo que
// este script. Ver AUDITORIA.md.
import { preview } from 'vite';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { routes } from '../src/seo/routes.js';

const PORT = 4321;

// En Vercel (process.env.VERCEL) el contenedor de build no tiene las
// librerias de sistema que el Chromium que trae `puppeteer` necesita
// (fallaba incluso con --no-sandbox: "No usable sandbox" primero,
// y la causa real detras era esta). `puppeteer-core` + el binario de
// `@sparticuz/chromium` resuelve esto: es el mismo Chromium pero
// compilado estatico para entornos tipo Lambda/build de Vercel, sin
// depender de libs del sistema. En local (Windows, con privilegios)
// se sigue usando el `puppeteer` normal con su propio Chromium.
async function launchBrowser() {
  if (process.env.VERCEL) {
    const [{ default: puppeteer }, { default: chromium }] = await Promise.all([
      import('puppeteer-core'),
      import('@sparticuz/chromium'),
    ]);
    return puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });
  }

  const { default: puppeteer } = await import('puppeteer');
  return puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
}

// Al cargar un chunk lazy que a su vez importa otro (p. ej.
// DisenoWebCuenca -> ServicePage), Vite inyecta <link rel="modulepreload">
// con URL absoluta del origen donde corre el prerender
// (http://127.0.0.1:4321/...). Capturado tal cual, produccion pedia
// esos archivos a localhost. Se reescribe el origen local a rutas
// relativas a la raiz.
function absolutize(html, origin) {
  return html.split(origin).join('');
}

async function waitForBoot(page) {
  // Espera a que el preloader (src/components/Preloader.jsx) termine su
  // ciclo y quite body.is-loading, para capturar el estado final de la
  // pagina en vez del overlay de carga. Si por lo que sea nunca se
  // quita (p. ej. un error de render), no bloquea el build para
  // siempre: sigue con lo que haya tras el timeout.
  await page
    .waitForFunction(() => !document.body.classList.contains('is-loading'), { timeout: 10000 })
    .catch(() => {});
}

// main.jsx hidrata (hydrateRoot) cuando #root ya trae contenido. React
// solo puede hidratar un <Suspense> si el HTML trae los marcadores que
// deja su propio renderizado en servidor (<!--$--> ... <!--/$-->); este
// snapshot sale de un render de cliente, que no los escribe. El unico
// <Suspense> del arbol envuelve las rutas (App.jsx) y cada pagina rinde un
// solo <main id="main"> hijo directo de #root, asi que se marcan ahi.
// Sin esto la hidratacion falla y React cae a montar todo de cero.
async function markSuspenseBoundary(page) {
  const ok = await page.evaluate(() => {
    // HeroOrbit.jsx crea su <canvas> a mano en un efecto (no es parte del
    // arbol de React): capturado en el HTML, sobra al hidratar y React lo
    // tomaria como mismatch. Se vuelve a crear al montar.
    document.querySelectorAll('#root canvas').forEach((c) => c.remove());
    const main = document.querySelector('#root > main');
    if (!main) return false;
    main.before(document.createComment('$'));
    main.after(document.createComment('/$'));
    return true;
  });
  if (!ok) throw new Error('no se encontro #root > main para marcar el <Suspense> de rutas');
}

async function main() {
  // Shell original (con #root vacio), leido antes de que el prerender
  // sobrescriba dist/index.html con la home ya renderizada. Cada ruta se
  // visita con este shell: si no, a partir de la segunda ruta el fallback
  // SPA del preview server serviria la home prerenderizada y main.jsx
  // intentaria hidratarla contra otra ruta.
  const shell = await readFile('dist/index.html', 'utf8');

  const server = await preview({ preview: { port: PORT, strictPort: true, host: '127.0.0.1' } });
  const base = `http://127.0.0.1:${PORT}`;

  const browser = await launchBrowser();

  try {
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      if (req.resourceType() === 'document') {
        req.respond({ status: 200, contentType: 'text/html; charset=utf-8', body: shell });
      } else {
        req.continue();
      }
    });

    for (const { path: route } of routes) {
      const url = new URL(route, base).toString();
      await page.goto(url, { waitUntil: 'networkidle0' });
      await waitForBoot(page);
      await markSuspenseBoundary(page);

      const html = absolutize(await page.content(), base);
      const outDir = route === '/' ? 'dist' : path.join('dist', route.replace(/^\//, ''));
      await mkdir(outDir, { recursive: true });
      await writeFile(path.join(outDir, 'index.html'), html, 'utf8');
      console.log(`[prerender] ${route} -> ${outDir}/index.html`);
    }

    // 404 real: el preview server de Vite hace fallback SPA (sirve
    // index.html para cualquier ruta no estatica), asi que visitar una
    // ruta inexistente aca cae igual en el <Route path="*"> de App.jsx
    // y renderiza NotFound.jsx. Guardado como dist/404.html, Vercel lo
    // sirve automaticamente para cualquier URL que no matchee un
    // archivo real (ver AUDITORIA.md — se verifica en vivo en Fase 7).
    const notFoundUrl = new URL('/esta-ruta-no-existe-404', base).toString();
    await page.goto(notFoundUrl, { waitUntil: 'networkidle0' });
    await waitForBoot(page);
    await markSuspenseBoundary(page);
    const notFoundHtml = absolutize(await page.content(), base);
    await writeFile('dist/404.html', notFoundHtml, 'utf8');
    console.log('[prerender] 404 -> dist/404.html');
  } finally {
    await browser.close();
    await new Promise((resolve) => server.httpServer.close(resolve));
  }
}

main().catch((err) => {
  console.error('[prerender] fallo:', err);
  process.exit(1);
});
