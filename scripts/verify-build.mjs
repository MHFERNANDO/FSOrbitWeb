// Verificacion post-build sobre el HTML que realmente se va a servir
// (dist/). Falla el build (exit 1) si algo de lo que prometen las
// reglas de SEO del sitio no esta en el HTML prerenderizado:
//
//  - title <= 60 caracteres, description entre 140 y 155
//  - <link rel=canonical> igual a la URL de la ruta
//  - exactamente un <h1>
//  - un solo <script type="application/ld+json"> con @graph, JSON valido,
//    @id unicos y toda referencia {"@id": ...} resuelta dentro del graph
//  - email del JSON-LD == email visible en la pagina
//  - minimo de palabras por tipo de pagina (servicios 250, casos 300,
//    articulos 600)
//  - <img> con width y height; ninguna referencia a 127.0.0.1
//  - cada URL del sitemap existe como archivo en dist/
import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { routes } from '../src/seo/routes.js';
import { contact } from '../src/data/content.js';

const ORIGIN = 'https://fsorbit.com';
const errors = [];
const warns = [];
const fail = (route, msg) => errors.push(`${route}: ${msg}`);
const warn = (route, msg) => warns.push(`${route}: ${msg}`);

const decode = (s) =>
  s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'");

const htmlFile = (route) => (route === '/' ? 'dist/index.html' : path.join('dist', route.replace(/^\//, ''), 'index.html'));

function wordsIn(mainHtml) {
  const text = mainHtml
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ');
  return decode(text).split(/\s+/).filter(Boolean).length;
}

async function exists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

function collectRefs(node, out) {
  if (Array.isArray(node)) return node.forEach((n) => collectRefs(n, out));
  if (node && typeof node === 'object') {
    const keys = Object.keys(node);
    if (keys.length === 1 && keys[0] === '@id') out.push(node['@id']);
    else keys.forEach((k) => collectRefs(node[k], out));
  }
}

async function checkRoute(r) {
  const route = r.path;
  let html;
  try {
    html = await readFile(htmlFile(route), 'utf8');
  } catch {
    return fail(route, `no existe ${htmlFile(route)}`);
  }

  // --- head
  const title = decode((/<title>([\s\S]*?)<\/title>/.exec(html) || [])[1] || '');
  const desc = decode((/<meta name="description" content="([^"]*)"/.exec(html) || [])[1] || '');
  const canonical = (/<link rel="canonical" href="([^"]*)"/.exec(html) || [])[1];
  if (title !== r.title) fail(route, `title en HTML ("${title}") != routes.js ("${r.title}")`);
  if (title.length > 60) fail(route, `title de ${title.length} caracteres (max 60)`);
  if (desc !== r.description) fail(route, `description en HTML != routes.js`);
  if (desc.length < 140 || desc.length > 155) fail(route, `description de ${desc.length} caracteres (140-155)`);
  const expectedCanonical = route === '/' ? `${ORIGIN}/` : `${ORIGIN}${route}`;
  if (canonical !== expectedCanonical) fail(route, `canonical "${canonical}" != "${expectedCanonical}"`);
  for (const prop of ['og:title', 'og:description', 'og:url']) {
    if (!new RegExp(`<meta property="${prop}"`).test(html)) fail(route, `falta ${prop}`);
  }
  const ogTitle = decode((/<meta property="og:title" content="([^"]*)"/.exec(html) || [])[1] || '');
  if (ogTitle !== title) fail(route, 'og:title distinto del title');

  // --- h1
  const h1s = html.match(/<h1[\s>]/g) || [];
  if (h1s.length !== 1) fail(route, `${h1s.length} etiquetas <h1> (debe ser 1)`);

  // --- json-ld
  const ldBlocks = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  if (ldBlocks.length !== 1) {
    fail(route, `${ldBlocks.length} bloques JSON-LD (debe ser 1)`);
  } else {
    try {
      const ld = JSON.parse(decode(ldBlocks[0][1]));
      const graph = ld['@graph'];
      if (!Array.isArray(graph)) fail(route, 'JSON-LD sin @graph');
      else {
        const ids = graph.map((n) => n['@id']);
        if (ids.some((i) => !i)) fail(route, 'nodo sin @id en el @graph');
        if (new Set(ids).size !== ids.length) fail(route, '@id repetidos en el @graph');
        const refs = [];
        graph.forEach((n) => collectRefs(n, refs));
        refs.filter((id) => !ids.includes(id)).forEach((id) => fail(route, `referencia sin resolver: ${id}`));
        const org = graph.find((n) => n['@id'] === `${ORIGIN}/#organization`);
        if (!org) fail(route, 'falta el nodo organizacion');
        else {
          if (org.email !== contact.email) fail(route, `email JSON-LD (${org.email}) != contacto (${contact.email})`);
          if (!html.includes(contact.email)) fail(route, `el email ${contact.email} no aparece visible en la pagina`);
          if (org.telephone !== contact.tel) fail(route, 'telefono del JSON-LD != contacto');
        }
        if (route !== '/' && !graph.some((n) => n['@type'] === 'BreadcrumbList')) fail(route, 'falta BreadcrumbList');
        if (r.service && !graph.some((n) => n['@type'] === 'FAQPage')) fail(route, 'falta FAQPage');
        if (r.service && !graph.some((n) => n['@type'] === 'Service')) fail(route, 'falta Service');
        if (r.project && !graph.some((n) => n['@type'] === 'CreativeWork')) fail(route, 'falta CreativeWork');
        if (r.post && !graph.some((n) => n['@type'] === 'Article')) fail(route, 'falta Article');
      }
    } catch (e) {
      fail(route, `JSON-LD no es JSON valido: ${e.message}`);
    }
  }

  // --- contenido
  const main = (/<main[\s\S]*?<\/main>/.exec(html) || [''])[0];
  const words = wordsIn(main);
  const min = r.service ? 250 : r.project ? 300 : r.post ? 600 : 0;
  if (words < min) fail(route, `${words} palabras en <main> (minimo ${min})`);
  if (!main) fail(route, 'sin <main>');

  // --- imagenes y rutas locales
  for (const img of html.match(/<img\b[^>]*>/g) || []) {
    if (!/\swidth="/.test(img) || !/\sheight="/.test(img)) fail(route, `<img> sin width/height: ${img.slice(0, 90)}`);
    if (!/\salt="/.test(img)) fail(route, `<img> sin alt: ${img.slice(0, 90)}`);
  }
  if (html.includes('127.0.0.1')) fail(route, 'queda una referencia a 127.0.0.1');

  console.log(`  ${words > 0 ? 'ok ' : '?? '} ${route.padEnd(46)} ${String(words).padStart(4)} palabras`);
}

async function main() {
  console.log('[verify] revisando HTML prerenderizado');
  for (const r of routes) await checkRoute(r);

  // sitemap: cada <loc> debe tener su archivo en dist/
  const sitemap = await readFile('dist/sitemap.xml', 'utf8');
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  for (const loc of locs) {
    const route = new URL(loc).pathname;
    if (!(await exists(htmlFile(route)))) fail('sitemap', `${loc} no tiene archivo en dist/`);
  }
  if (locs.length !== routes.length) fail('sitemap', `${locs.length} URLs != ${routes.length} rutas`);
  if (!/<lastmod>/.test(sitemap)) warn('sitemap', 'ninguna URL tiene lastmod');
  if (!(await exists('dist/404.html'))) fail('404', 'falta dist/404.html');
  if (!(await exists('dist/llms.txt'))) fail('llms', 'falta dist/llms.txt');

  warns.forEach((w) => console.warn(`[verify] aviso -> ${w}`));
  if (errors.length) {
    console.error(`\n[verify] ${errors.length} error(es):`);
    errors.forEach((e) => console.error(`  x ${e}`));
    process.exit(1);
  }
  console.log(`[verify] todo en orden (${routes.length} rutas, ${locs.length} URLs en el sitemap)`);
}

main().catch((err) => {
  console.error('[verify] fallo:', err);
  process.exit(1);
});
