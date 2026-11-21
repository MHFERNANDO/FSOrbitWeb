// Capturas de una pagina cada media pantalla de scroll, como la veria una
// persona en el celular (390x844, iPhone 14). Sirve para revisar el
// recorrido completo sin saltarse tramos.
//   node scripts/scroll-shots.mjs <url> <carpeta> [ancho] [alto] [paso]
import puppeteer from 'puppeteer';
import { mkdir } from 'node:fs/promises';

const url = process.argv[2] || 'http://localhost:4180/';
const out = process.argv[3] || 'shots';
const width = Number(process.argv[4] || 390);
const height = Number(process.argv[5] || 844);
const step = Number(process.argv[6] || 0.5);
await mkdir(out, { recursive: true });

const mobile = width < 900;
const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setViewport({ width, height, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: mobile ? 2 : 1 });
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
await page.goto(url, { waitUntil: 'networkidle0' });
await new Promise((r) => setTimeout(r, 3500));
const total = await page.evaluate(() => document.documentElement.scrollHeight);
let k = 0;
for (let y = 0; y < total - height * 0.5; y += Math.round(height * step)) {
  await page.evaluate((y) => window.scrollTo(0, y), y);
  await new Promise((r) => setTimeout(r, 700));
  await page.screenshot({ path: `${out}/s-${String(k++).padStart(2, '0')}.jpg`, type: 'jpeg', quality: 70 });
}
console.log(`[scroll-shots] ${k} capturas, alto total ${total}px`);
await browser.close();
