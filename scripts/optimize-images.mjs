// Genera las imagenes que sirve el sitio a partir de los originales en
// scripts/source/ (PNG pesados que ya no se publican):
//   - Previews de proyectos: WebP en 480/960/1440 px de ancho (srcset).
//   - Logo: WebP de 128 px (navbar/footer) y 512 px (JSON-LD).
//   - og-image: JPEG 1200x630 (los PNG de 160KB pasan a ~50KB).
// Usa el Chromium de Puppeteer (canvas.toBlob) para no agregar
// dependencias nativas. Se corre a mano: node scripts/optimize-images.mjs
import puppeteer from 'puppeteer';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = (f) => path.join(root, 'scripts/source', f);
const out = (f) => path.join(root, 'public/assets', f);

const JOBS = [
  ...['AccuLabPreview', 'GravityPreview', 'JFVapesPreview', 'LabDieselPreview'].flatMap((n) =>
    [480, 960, 1440].map((w) => ({ from: `${n}.png`, to: `${n}-${w}.webp`, width: w, type: 'image/webp', q: 0.8 })),
  ),
  { from: 'Logo.png', to: 'Logo-128.webp', width: 128, type: 'image/webp', q: 0.9 },
  { from: 'Logo.png', to: 'Logo-512.webp', width: 512, type: 'image/webp', q: 0.88 },
  { from: 'og-image.png', to: 'og-image.jpg', width: 1200, type: 'image/jpeg', q: 0.84, flatten: '#0b0d10' },
];

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setContent('<canvas></canvas>');

for (const job of JOBS) {
  const buf = await readFile(src(job.from));
  const b64 = await page.evaluate(
    async (dataUri, { width, type, q, flatten }) => {
      const img = new Image();
      img.src = dataUri;
      await img.decode();
      const w = Math.min(width, img.naturalWidth);
      const h = Math.round((img.naturalHeight * w) / img.naturalWidth);
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      const ctx = c.getContext('2d');
      ctx.imageSmoothingQuality = 'high';
      if (flatten) {
        ctx.fillStyle = flatten;
        ctx.fillRect(0, 0, w, h);
      }
      ctx.drawImage(img, 0, 0, w, h);
      return c.toDataURL(type, q).split(',')[1];
    },
    `data:image/png;base64,${buf.toString('base64')}`,
    job,
  );
  const bytes = Buffer.from(b64, 'base64');
  await writeFile(out(job.to), bytes);
  console.log(`[images] ${job.to} ${(bytes.length / 1024).toFixed(1)}KB`);
}

await browser.close();
