// Genera scripts/source/og-image.png (1200x630) con Puppeteer y, de paso,
// public/assets/og-image.jpg, que es la que se publica. Usa lo mismo que
// el sitio: negro, el cian del logo, Mona Sans e Instrument Sans (las
// fuentes autoalojadas de public/fonts) y el atomo de codigo de la home.
// Se corre a mano porque es un asset de marca, no depende de cada build:
//   node scripts/generate-og-image.mjs
import puppeteer from 'puppeteer';
import { writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const b64 = async (file) => (await readFile(path.join(root, file))).toString('base64');

const CODE = [
  'const sitio = escribir({ para: "tu negocio", en: "Cuenca" }); ',
  '<main><h1>Páginas web a medida</h1><a href="wa.me">Escribir</a></main> ',
  'export default function Pagina() { return <Sitio sinPlantillas /> } ',
  'h1 { font-stretch: var(--ancho); color: #00f3fb; } @media (pointer) ',
];

async function buildHtml() {
  const [display, instrument, mono, emblem] = await Promise.all([
    b64('public/fonts/mona-sans-variable-latin.woff2'),
    b64('public/fonts/instrument-sans-variable-latin.woff2'),
    b64('public/fonts/jetbrains-mono-variable-latin.woff2'),
    b64('public/icon-192.png'),
  ]);
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const orbits = CODE.map(
    (line, i) =>
      `<g transform="rotate(${i * 45})"><text class="${i % 2 ? 'dim' : ''}"><textPath href="#o" textLength="1400" lengthAdjust="spacing">${esc(line.repeat(2))}</textPath></text></g>`,
  ).join('');

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<style>
  @font-face { font-family: Display; src: url(data:font/woff2;base64,${display}); font-weight: 200 900; font-stretch: 75% 125%; }
  @font-face { font-family: Instrument; src: url(data:font/woff2;base64,${instrument}); font-weight: 400 700; }
  @font-face { font-family: Mono; src: url(data:font/woff2;base64,${mono}); font-weight: 400 700; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body { position: relative; background: #000; color: #eaf2f2; font-family: Instrument, sans-serif; padding: 64px 72px; display: flex; flex-direction: column; }
  .brand { display: flex; align-items: center; gap: 16px; font-family: Display; font-weight: 680; font-stretch: 112%; font-size: 30px; }
  .brand img { width: 56px; height: 56px; border-radius: 50%; }
  h1 { margin-top: auto; max-width: 700px; font-family: Display; font-weight: 640; font-stretch: 104%; font-size: 70px; line-height: 1; letter-spacing: -.025em; }
  p { margin-top: 24px; max-width: 680px; font-size: 28px; line-height: 1.4; color: #93a6a8; }
  .url { margin-top: 28px; font-size: 24px; font-weight: 600; color: #00f3fb; }
  svg { position: absolute; right: -70px; top: 50%; width: 540px; height: 540px; transform: translateY(-50%); overflow: visible; }
  svg text { fill: #00f3fb; font-family: Mono, monospace; font-size: 12px; }
  svg text.dim { fill: #0b6f74; }
  svg .core { font-size: 24px; font-weight: 700; }
</style>
</head>
<body>
  <div class="brand"><img src="data:image/png;base64,${emblem}" alt="">FS Orbit</div>
  <h1>Páginas web<br>a medida para<br>negocios de Cuenca</h1>
  <p>Código propio, sin plantillas. Planes desde $200.</p>
  <div class="url">fsorbit.com</div>
  <svg viewBox="-160 -160 320 320" aria-hidden="true">
    <defs><path id="o" d="M -222 0 a 222 80 0 1 0 444 0 a 222 80 0 1 0 -444 0"/></defs>
    <g transform="scale(0.62) rotate(-12)">${orbits}</g>
    <text class="core" text-anchor="middle" y="6">{ }</text>
  </svg>
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
    await page.evaluate(() => document.fonts.ready);
    await writeFile(path.join(root, 'scripts/source/og-image.png'), await page.screenshot({ type: 'png' }));
    await writeFile(path.join(root, 'public/assets/og-image.jpg'), await page.screenshot({ type: 'jpeg', quality: 86 }));
    console.log('[og-image] scripts/source/og-image.png y public/assets/og-image.jpg');
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error('[og-image] fallo:', err);
  process.exit(1);
});
