// Mide el avance de cada caracter de Anybody (peso 800) en cinco anchos y
// lo guarda en src/lib/anybodyMetrics.json. Con esa tabla, <Display>
// calcula cuanto mide cada linea del titular sin medir en el navegador
// (cero salto de layout). Se corre a mano si cambia la fuente:
//   node scripts/measure-display.mjs
import puppeteer from 'puppeteer';
import { readFile, writeFile } from 'node:fs/promises';

const font = (await readFile('public/fonts/anybody-variable-latin.woff2')).toString('base64');
const CHARS = ' abcdefghijklmnopqrstuvwxyzáéíóúñüABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÑ0123456789.,:;-–/()¿?¡!$%"\'+&';
const WIDTHS = [50, 75, 100, 125, 150];

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
const table = await page.evaluate(
  async (font, chars, widths) => {
    const face = new FontFace('Anybody', `url(data:font/woff2;base64,${font})`, { weight: '100 900', stretch: '50% 150%' });
    document.fonts.add(await face.load());
    const span = document.createElement('span');
    span.style.cssText = 'position:absolute;white-space:pre;font:800 200px Anybody;font-kerning:none';
    document.body.append(span);
    const out = {};
    for (const w of widths) {
      span.style.fontStretch = `${w}%`;
      out[w] = {};
      for (const c of chars) {
        span.textContent = `x${c}x`;
        const full = span.getBoundingClientRect().width;
        span.textContent = 'xx';
        out[w][c] = +((full - span.getBoundingClientRect().width) / 200).toFixed(4);
      }
    }
    return out;
  },
  font,
  CHARS,
  WIDTHS,
);
await browser.close();
await writeFile('src/lib/anybodyMetrics.json', JSON.stringify(table));
console.log('[metrics] ok', Object.keys(table[100]).length, 'caracteres; "a" @100 =', table[100].a, '@150 =', table[150].a, '@50 =', table[50].a);
