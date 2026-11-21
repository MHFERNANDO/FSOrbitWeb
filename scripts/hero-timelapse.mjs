// Capturas del inicio de la home a lo largo del tiempo, sin hacer scroll:
// sirve para comprobar que el intro y el giro del logo se reproducen solos
// (tambien con "reducir movimiento").
//   node scripts/hero-timelapse.mjs http://localhost:4180 <carpeta>
import puppeteer from 'puppeteer';
import { mkdir } from 'node:fs/promises';

const base = process.argv[2] || 'http://localhost:4180';
const out = process.argv[3] || 'timelapse';
await mkdir(out, { recursive: true });

const runs = [
  { name: 'celular-reducido', width: 375, height: 812, isMobile: true, hasTouch: true, deviceScaleFactor: 2, reduce: true },
  { name: 'escritorio', width: 1366, height: 768 },
];
const times = [400, 900, 1400, 1900, 2600, 3300, 4000, 4700];

const browser = await puppeteer.launch({ headless: true });
for (const run of runs) {
  const page = await browser.newPage();
  await page.setViewport(run);
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: run.reduce ? 'reduce' : 'no-preference' }]);
  await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.seq-canvas', { timeout: 15000 });
  const t0 = Date.now();
  for (const [k, t] of times.entries()) {
    const wait = t - (Date.now() - t0);
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
    await page.screenshot({ path: `${out}/${run.name}-${k}.jpg`, type: 'jpeg', quality: 55 });
  }
  await page.close();
}
await browser.close();
console.log('[timelapse] ok');
