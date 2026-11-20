// Mide el avance de cada caracter de Mona Sans (peso 640) en tres anchos y
// lo guarda en src/lib/displayMetrics.json. Con esa tabla, <Display>
// calcula cuanto mide cada linea del titular sin medir en el navegador
// (cero salto de layout). Se corre a mano si cambia la fuente:
//   node scripts/measure-display.mjs
import puppeteer from 'puppeteer';
import { readFile, writeFile } from 'node:fs/promises';

const font = (await readFile('public/fonts/mona-sans-variable-latin.woff2')).toString('base64');
const CHARS = ' abcdefghijklmnopqrstuvwxyzáéíóúñüABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÑ0123456789.,:;-–/()¿?¡!$%"\'+&';
const WIDTHS = [78, 100, 122];

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
const table = await page.evaluate(
  async (font, chars, widths) => {
    const face = new FontFace('Display', `url(data:font/woff2;base64,${font})`, { weight: '560 700', stretch: '78% 122%' });
    document.fonts.add(await face.load());
    const span = document.createElement('span');
    span.style.cssText = 'position:absolute;white-space:pre;font:640 200px Display;font-kerning:none';
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
await writeFile('src/lib/displayMetrics.json', JSON.stringify(table));
console.log('[metrics] ok', Object.keys(table[100]).length, 'caracteres; "a" @75/100/125 =', table[78].a, table[100].a, table[122].a);
