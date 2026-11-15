// Revision rapida de todas las rutas sobre un servidor de dist/ ya
// levantado (node scripts/serve-dist.mjs 4180). En escritorio y celular
// reporta: errores de consola, desborde horizontal, cantidad de <h1> y
// objetivos tactiles de menos de 24 px. Con --shots <carpeta> guarda una
// captura de cada pagina.
//   node scripts/audit-pages.mjs http://localhost:4180 [--shots carpeta]
import puppeteer from 'puppeteer';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { allRoutes } from '../src/seo/routes.js';

const base = process.argv[2] || 'http://localhost:4180';
const shotsAt = process.argv.indexOf('--shots');
const shots = shotsAt > -1 ? process.argv[shotsAt + 1] : null;
if (shots) await mkdir(shots, { recursive: true });

const VIEWPORTS = [
  { name: 'escritorio', width: 1366, height: 768, isMobile: false },
  { name: 'celular', width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
];
const paths = [...allRoutes.map((r) => r.path), '/esta-pagina-no-existe'];

const browser = await puppeteer.launch({ headless: true });
let problems = 0;
for (const vp of VIEWPORTS) {
  const page = await browser.newPage();
  await page.setViewport(vp);
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text().slice(0, 160)));
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 160)));
  for (const p of paths) {
    errors.length = 0;
    await page.goto(base + p, { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 400));
    const info = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      h1: document.querySelectorAll('h1').length,
      small: [...document.querySelectorAll('a, button, summary')]
        .filter((e) => {
          const r = e.getBoundingClientRect();
          // Los enlaces dentro de una frase quedan exentos (WCAG 2.5.8).
          return r.width > 0 && r.height < 24 && getComputedStyle(e).display !== 'inline';
        })
        .map((e) => e.textContent.trim().slice(0, 24))
        .slice(0, 4),
    }));
    // El 404 del servidor es esperado en la ruta inexistente.
    const real = errors.filter((e) => !(p === '/esta-pagina-no-existe' && /404/.test(e)));
    const bad = real.length || info.overflow > 0 || info.h1 !== 1 || (vp.isMobile && info.small.length);
    if (bad) {
      problems += 1;
      console.log(`x ${vp.name} ${p}`, JSON.stringify({ ...info, errors: real }));
    }
    if (shots) await page.screenshot({ path: path.join(shots, `${vp.name}${p.replace(/\//g, '_') || '_home'}.jpg`), type: 'jpeg', quality: 60, fullPage: true });
  }
  await page.close();
}
await browser.close();
console.log(problems ? `[audit] ${problems} pagina(s) con observaciones` : `[audit] ${paths.length} rutas x ${VIEWPORTS.length} tamanos: sin observaciones`);
