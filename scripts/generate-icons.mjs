// Genera los iconos del sitio a partir de public/assets/Logo.png, recortando
// solo el emblema circular (sin "ORBIT" ni el lema, ilegibles a 16-48px).
// Google pide un favicon cuadrado y multiplo de 48px para mostrarlo en los
// resultados. Se corre a mano: node scripts/generate-icons.mjs
import puppeteer from 'puppeteer';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const logo = await readFile(path.join(root, 'public/assets/Logo.png'));
// Recorte del emblema dentro del PNG de 414x414 (medido sobre el archivo).
const CROP = { x: 80, y: 30, size: 256 };
const SIZES = [48, 180, 192, 512];

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setContent('<canvas></canvas>');
const out = await page.evaluate(
  async (dataUri, crop, sizes) => {
    const img = new Image();
    img.src = dataUri;
    await img.decode();
    const result = {};
    for (const s of sizes) {
      const c = document.createElement('canvas');
      c.width = c.height = s;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#0b0d10';
      ctx.fillRect(0, 0, s, s);
      const pad = Math.round(s * 0.06);
      ctx.drawImage(img, crop.x, crop.y, crop.size, crop.size, pad, pad, s - pad * 2, s - pad * 2);
      result[s] = c.toDataURL('image/png').split(',')[1];
    }
    return result;
  },
  `data:image/png;base64,${logo.toString('base64')}`,
  CROP,
  SIZES,
);
await browser.close();

const files = { 48: 'icon-48.png', 180: 'apple-touch-icon.png', 192: 'icon-192.png', 512: 'icon-512.png' };
for (const [size, name] of Object.entries(files)) {
  await writeFile(path.join(root, 'public', name), Buffer.from(out[size], 'base64'));
}

// favicon.ico con un PNG de 48x48 embebido (formato ICO valido desde Vista).
const png = Buffer.from(out[48], 'base64');
const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(1, 4);
header.writeUInt8(48, 6);
header.writeUInt8(48, 7);
header.writeUInt16LE(1, 10);
header.writeUInt16LE(32, 12);
header.writeUInt32LE(png.length, 14);
header.writeUInt32LE(22, 18);
await writeFile(path.join(root, 'public/favicon.ico'), Buffer.concat([header, png]));
console.log('[icons] favicon.ico, icon-48/192/512.png, apple-touch-icon.png');
