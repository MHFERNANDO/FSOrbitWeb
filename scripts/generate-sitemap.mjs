// Genera dist/sitemap.xml desde la misma lista de rutas que usa el
// prerender (src/seo/routes.js), con lastmod = fecha del build. Antes
// el sitemap vivia a mano en public/sitemap.xml con fechas fijas;
// ahora ese archivo ya no se usa (se sobreescribe en cada build).
import { writeFile } from 'node:fs/promises';
import { routes } from '../src/seo/routes.js';

const ORIGIN = 'https://fsorbit.com';

function buildXml() {
  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = routes
    .map(
      ({ path, changefreq, priority }) => `  <url>
    <loc>${ORIGIN}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(1)}</priority>
  </url>`,
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

async function main() {
  const xml = buildXml();
  await writeFile('dist/sitemap.xml', xml, 'utf8');
  console.log(`[sitemap] dist/sitemap.xml generado con ${routes.length} rutas`);
}

main().catch((err) => {
  console.error('[sitemap] fallo:', err);
  process.exit(1);
});
