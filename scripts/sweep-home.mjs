// Capturas del recorrido de la home a distintas alturas de scroll, en
// escritorio y celular, con el movimiento activado. Sirve para revisar
// donde cae el modelo en cada seccion.
//   node scripts/sweep-home.mjs http://localhost:4180 <carpeta>
import puppeteer from 'puppeteer';
import { mkdir } from 'node:fs/promises';

const base = process.argv[2] || 'http://localhost:4180';
const out = process.argv[3] || 'sweep';
await mkdir(out, { recursive: true });

const VIEWPORTS = [
  { name: 'escritorio', width: 1366, height: 768 },
  { name: 'celular', width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
];

const browser = await puppeteer.launch({ headless: true });
for (const vp of VIEWPORTS) {
  const page = await browser.newPage();
  await page.setViewport(vp);
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(`${base}/`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 2500));
  const total = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  const stops = 14;
  for (let k = 0; k <= stops; k++) {
    const y = Math.round((total * k) / stops);
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await new Promise((r) => setTimeout(r, 900));
    await page.screenshot({ path: `${out}/${vp.name}-${String(k).padStart(2, '0')}.jpg`, type: 'jpeg', quality: 55 });
  }
  const cls = await page.evaluate(() => document.documentElement.className);
  console.log(vp.name, cls, errors.length ? errors : 'sin errores');
  await page.close();
}
await browser.close();
