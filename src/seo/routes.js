// Fuente unica de rutas reales del sitio. La consume el prerender
// (scripts/prerender.mjs) para saber que paginas visitar y el generador
// de sitemap (scripts/generate-sitemap.mjs) para no mantener el XML a
// mano. Agregar una ruta aca es el unico paso necesario para que tenga
// HTML prerenderizado y entrada en el sitemap.
export const routes = [
  { path: '/', changefreq: 'weekly', priority: 1.0 },
  { path: '/proyectos', changefreq: 'monthly', priority: 0.9 },
];
