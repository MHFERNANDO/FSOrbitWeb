// Servidor estatico de dist/ que imita a Vercel: cleanUrls (/servicios/x ->
// dist/servicios/x/index.html), 404 real con dist/404.html, cabeceras de
// vercel.json y compresion brotli/gzip. Sirve para medir con Lighthouse o
// probar a mano lo que realmente se despliega.
//
// OJO: `vite preview` NO sirve para auditar rutas internas: hace fallback
// SPA y entrega dist/index.html (la home) en cualquier ruta sin extension,
// asi que una auditoria de /servicios/x medira la home hidratada contra
// otra ruta. Usa este script (PORT=4173 node scripts/serve-dist.mjs).
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const dist = path.resolve('dist');
const port = Number(process.env.PORT || 4173);
const cfg = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
const globalHeaders = Object.fromEntries(cfg.headers[0].headers.map((h) => [h.key, h.value]));
// Lighthouse pierde el inicio de navegacion (NO_NAVSTART) cuando la pagina trae
// Cross-Origin-Opener-Policy; para auditar con el: LIGHTHOUSE=1 node scripts/serve-dist.mjs
if (process.env.LIGHTHOUSE) delete globalHeaders['Cross-Origin-Opener-Policy'];
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
};
const compressible = new Set(['.html', '.js', '.css', '.json', '.svg', '.xml', '.txt']);

function resolveFile(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0]).replace(/\/+$/, '') || '/';
  const direct = path.join(dist, clean);
  if (!direct.startsWith(dist)) return null;
  if (fs.existsSync(direct) && fs.statSync(direct).isFile()) return direct;
  const index = path.join(direct, 'index.html');
  if (fs.existsSync(index)) return index;
  return null;
}

http
  .createServer((req, res) => {
    if (req.url.startsWith('/_vercel/')) {
      res.writeHead(204);
      return res.end();
    }
    const file = resolveFile(req.url);
    const status = file ? 200 : 404;
    const target = file || path.join(dist, '404.html');
    const ext = path.extname(target);
    const headers = { ...globalHeaders, 'Content-Type': types[ext] || 'application/octet-stream' };
    if (req.url.startsWith('/assets/') && /\.(js|css)$/.test(ext + '')) headers['Cache-Control'] = 'public, max-age=31536000, immutable';
    let body = fs.readFileSync(target);
    const accept = req.headers['accept-encoding'] || '';
    if (compressible.has(ext)) {
      if (accept.includes('br')) {
        body = zlib.brotliCompressSync(body);
        headers['Content-Encoding'] = 'br';
      } else if (accept.includes('gzip')) {
        body = zlib.gzipSync(body);
        headers['Content-Encoding'] = 'gzip';
      }
      headers.Vary = 'Accept-Encoding';
    }
    res.writeHead(status, headers);
    res.end(body);
  })
  .listen(port, '127.0.0.1', () => console.log(`[serve-dist] http://127.0.0.1:${port}`));
