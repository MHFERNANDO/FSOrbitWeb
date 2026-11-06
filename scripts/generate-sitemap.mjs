// Genera dist/sitemap.xml desde la misma lista de rutas que usa el
// prerender (src/seo/routes.js). Cada URL lleva su propio <lastmod>:
//
//  1. Si la ruta declara `lastmod` (los articulos, con su dateModified),
//     se usa esa fecha.
//  2. Si no, la fecha del ultimo commit de git que toco los archivos
//     fuente de la ruta (`files` en routes.js).
//  3. Si git no puede responder (clon superficial en el build de Vercel,
//     o sin .git), se lee src/seo/lastmod.json: un manifiesto que este
//     mismo script reescribe en cada build local donde git si funciona.
//     Se versiona en el repo para que Vercel tenga las fechas reales.
//
// Nunca se usa "la fecha de hoy" para todas las URLs: un lastmod que
// cambia en todo el sitio con cada deploy hace que Google lo ignore.
import { execFileSync } from 'node:child_process';
import { statSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { routes } from '../src/seo/routes.js';

const ORIGIN = 'https://fsorbit.com';
const MANIFEST = 'src/seo/lastmod.json';

const git = (args) => execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();

function gitIsUsable() {
  try {
    return git(['rev-parse', '--is-shallow-repository']) === 'false';
  } catch {
    return false;
  }
}

// Archivos con cambios sin commitear: el ultimo cambio real es su mtime.
function hasLocalChanges(files) {
  try {
    return git(['status', '--porcelain', '--', ...files]) !== '';
  } catch {
    return false;
  }
}

function gitLastmod(files) {
  try {
    const date = git(['log', '-1', '--format=%cs', '--', ...files]);
    return date || null;
  } catch {
    return null;
  }
}

function fileMtime(files) {
  const times = files.flatMap((f) => {
    try {
      return [statSync(f).mtime];
    } catch {
      return [];
    }
  });
  if (!times.length) return null;
  const d = new Date(Math.max(...times));
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

async function readManifest() {
  try {
    return JSON.parse(await readFile(MANIFEST, 'utf8'));
  } catch {
    return {};
  }
}

async function main() {
  const manifest = await readManifest();
  const useGit = gitIsUsable();
  const next = { ...manifest };

  const urls = routes.map((r) => {
    let lastmod = r.lastmod || null;
    if (!lastmod && useGit) {
      // Sin commit todavia (archivo nuevo): la fecha de modificacion del
      // archivo es la fecha real del ultimo cambio.
      lastmod = hasLocalChanges(r.files || []) ? fileMtime(r.files || []) : gitLastmod(r.files || []) || fileMtime(r.files || []);
      if (lastmod) next[r.path] = lastmod;
    }
    if (!lastmod) lastmod = manifest[r.path] || null;
    if (!lastmod) {
      console.warn(`[sitemap] sin fecha real para ${r.path}: se omite <lastmod>`);
    }
    return { ...r, lastmod };
  });

  if (useGit) await writeFile(MANIFEST, JSON.stringify(next, null, 2) + '\n', 'utf8');

  const body = urls
    .map(
      ({ path, changefreq, priority, lastmod }) => `  <url>
    <loc>${ORIGIN}${path === '/' ? '/' : path}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(1)}</priority>
  </url>`,
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
  await writeFile('dist/sitemap.xml', xml, 'utf8');
  console.log(`[sitemap] dist/sitemap.xml generado con ${routes.length} rutas (lastmod via ${useGit ? 'git' : 'manifiesto'})`);
}

main().catch((err) => {
  console.error('[sitemap] fallo:', err);
  process.exit(1);
});
