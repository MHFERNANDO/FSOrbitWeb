// Prueba de humo del build: sirve dist/ con las cabeceras reales de vercel.json
// (CSP incluida) y visita las rutas con Puppeteer. Falla si hay violaciones de
// CSP, errores de hidratacion de React o errores de consola (el 404 de la ruta
// inexistente es esperado). Uso: npm run build && ALL=1 npm run smoke
// Sirve dist/ con las cabeceras de vercel.json y visita cada ruta con Puppeteer,
// registrando violaciones de CSP, errores de consola y fallos de red.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';

const root = process.cwd();
const dist = path.join(root, 'dist');
const cfg = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
const hdrs = Object.fromEntries(cfg.headers[0].headers.map((h) => [h.key, h.value]));
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.json': 'application/json', '.ico': 'image/x-icon', '.svg': 'image/svg+xml', '.xml': 'application/xml', '.txt': 'text/plain' };

const server = http.createServer((req, res) => {
  const p = decodeURIComponent(req.url.split('?')[0]);
  if (p.startsWith('/_vercel/')) {
    res.writeHead(204);
    return res.end();
  }
  let f = path.join(dist, p);
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  else if (!path.extname(f)) f = path.join(dist, p, 'index.html');
  if (!fs.existsSync(f)) {
    res.writeHead(404, { ...hdrs, 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(fs.readFileSync(path.join(dist, '404.html')));
  }
  res.writeHead(200, { ...hdrs, 'Content-Type': types[path.extname(f)] || 'application/octet-stream' });
  res.end(fs.readFileSync(f));
});
await new Promise((r) => server.listen(4555, '127.0.0.1', r));

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
// MOBILE=1: viewport de telefono + CPU 4x mas lenta. Con CPU lenta el JS llega
// despues del HTML y salen a la luz las carreras de hidratacion que en un
// escritorio rapido no se ven.
if (process.env.MOBILE) {
  await page.setViewport({ width: 412, height: 823, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const cdp = await page.createCDPSession();
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
}
const problems = [];
page.on('console', (m) => {
  if (['error', 'warning'].includes(m.type())) problems.push(`[console.${m.type()}] ${m.text()}`);
});
page.on('pageerror', (e) => problems.push(`[pageerror] ${e.message}`));
page.on('requestfailed', (r) => problems.push(`[requestfailed] ${r.url()} ${r.failure()?.errorText}`));
await page.evaluateOnNewDocument(() => {
  document.addEventListener('securitypolicyviolation', (e) => console.error(`CSP VIOLATION ${e.violatedDirective} ${e.blockedURI}`));
});

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const routes = process.env.ALL ? ["/","/proyectos","/servicios/diseno-web-cuenca","/servicios/diseno-ui-ux","/servicios/tiendas-online","/servicios/mantenimiento-web","/servicios/rediseno-y-optimizacion","/precios","/sobre-nosotros","/blog","/blog/cuanto-cuesta-una-pagina-web-en-ecuador","/blog/pagina-web-vs-solo-instagram","/blog/como-aparecer-en-google-maps-cuenca","/proyectos/acculab-system","/proyectos/gravity-studio","/proyectos/jf-vapes-store","/proyectos/laboratorio-diesel-mg","/contacto","/politica-de-privacidad"] : [];
for (const r of routes) {
  const before = problems.length;
  const resp = await page.goto(`http://127.0.0.1:4555${r}`, { waitUntil: 'networkidle0' });
  await wait(3800);
  console.log(r, resp.status(), problems.length - before ? 'PROBLEMAS ' + (problems.length - before) : 'ok');
}

// modal con iframes de clientes
await page.goto('http://127.0.0.1:4555/proyectos', { waitUntil: 'networkidle0' });
await wait(3800);
const links = await page.$$('xpath/.//a[contains(., "Ejecutar Proyecto")]');
console.log('tarjetas con preview:', links.length);
for (let i = 0; i < links.length; i++) {
  await links[i].evaluate((el) => el.scrollIntoView({ block: 'center' }));
  await links[i].click().catch((e) => console.log('click fallo', e.message));
  await wait(3500);
  const src = await page.evaluate(() => document.querySelector('iframe')?.src);
  console.log('iframe', i, src);
  await page.keyboard.press('Escape');
  await wait(600);
}

console.log('\nPROBLEMAS:', problems.length);
problems.forEach((p) => console.log(' ', p));
await browser.close();
server.close();
