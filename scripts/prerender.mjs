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
import puppeteer from 'puppeteer';
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { routes } from '../src/seo/routes.js';

const PORT = 4321;

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

async function main() {
  const server = await preview({ preview: { port: PORT, strictPort: true, host: '127.0.0.1' } });
  const base = `http://127.0.0.1:${PORT}`;

  const browser = await puppeteer.launch({ headless: true });

  try {
    const page = await browser.newPage();

    for (const { path: route } of routes) {
      const url = new URL(route, base).toString();
      await page.goto(url, { waitUntil: 'networkidle0' });
      await waitForBoot(page);

      const html = await page.content();
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
    const notFoundHtml = await page.content();
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
