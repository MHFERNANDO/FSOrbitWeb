// Genera public/assets/og-image.png (1200x630) con Puppeteer: una tarjeta
// simple con la marca real (mismo fondo/acento que el sitio, mismo logo,
// mismo copy ya aprobado) en vez del Logo.png de 414x414 que se usaba
// como og:image. Se corre a mano (no en cada build) porque es un asset
// de marca estatico, no depende de contenido por ruta:
//   node scripts/generate-og-image.mjs
//
// Usa fuentes del sistema (Arial/Helvetica), no "Archivo" (la tipografia
// real del sitio via Google Fonts) porque este script no depende de red.
// Si mas adelante se auto-alojan las fuentes (Fase 6), vale la pena
// regenerar esta tarjeta con la tipografia real.
import puppeteer from 'puppeteer';
import { writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOGO_PATH = path.resolve(__dirname, '../public/assets/Logo.png');
const OUT_PATH = path.resolve(__dirname, '../public/assets/og-image.png');

async function buildHtml() {
  const logoBuffer = await readFile(LOGO_PATH);
  const logoDataUri = `data:image/png;base64,${logoBuffer.toString('base64')}`;

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body {
    background: #050609;
    background-image:
      radial-gradient(ellipse 900px 600px at 80% 10%, rgba(34, 228, 245, .18), transparent 60%),
      radial-gradient(ellipse 700px 500px at 5% 105%, rgba(34, 228, 245, .09), transparent 60%);
    font-family: Arial, Helvetica, sans-serif;
    display: flex;
    flex-direction: column;
    padding: 80px;
  }
  .brand { display: flex; align-items: center; gap: 20px; }
  .brand img { width: 56px; height: 56px; filter: brightness(0) invert(1); opacity: .95; }
  .brand span {
    font-size: 24px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase;
    color: #edf0f6;
  }
  h1 {
    margin-top: 56px;
    font-size: 58px; font-weight: 800; color: #edf0f6; line-height: 1.16;
    letter-spacing: -.01em; max-width: 980px;
  }
  h1 .accent { color: #22e4f5; }
  p {
    margin-top: 24px; font-size: 25px; color: #a3acbc; max-width: 760px; font-weight: 400;
    line-height: 1.5;
  }
  footer { margin-top: auto; padding-top: 32px; border-top: 1px solid rgba(255,255,255,.12); }
  footer span {
    font-size: 18px; letter-spacing: .14em; text-transform: uppercase; color: #22e4f5; font-weight: 700;
  }
</style>
</head>
<body>
  <div class="brand">
    <img src="${logoDataUri}" alt="">
    <span>FS Orbit</span>
  </div>
  <h1>Desarrollo web de <span class="accent">alto rendimiento</span> en Cuenca, Ecuador</h1>
  <p>Código a medida, sin plantillas. Sitios rápidos, seguros y diseñados para convertir.</p>
  <footer><span>fsorbit.com</span></footer>
</body>
</html>`;
}

async function main() {
  const html = await buildHtml();
  const browser = await puppeteer.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const buffer = await page.screenshot({ type: 'png' });
    await writeFile(OUT_PATH, buffer);
    console.log(`[og-image] guardado en ${OUT_PATH}`);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error('[og-image] fallo:', err);
  process.exit(1);
});
