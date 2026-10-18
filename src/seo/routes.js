// Fuente unica de rutas reales del sitio. La consume el prerender
// (scripts/prerender.mjs) para saber que paginas visitar y el generador
// de sitemap (scripts/generate-sitemap.mjs) para no mantener el XML a
// mano. Agregar una ruta aca es el unico paso necesario para que tenga
// HTML prerenderizado y entrada en el sitemap.
export const routes = [
  { path: '/', changefreq: 'weekly', priority: 1.0 },
  { path: '/proyectos', changefreq: 'monthly', priority: 0.9 },
  { path: '/proyectos/gravity-studio', changefreq: 'monthly', priority: 0.6 },
  { path: '/proyectos/acculab-system', changefreq: 'monthly', priority: 0.6 },
  { path: '/proyectos/jf-vapes-store', changefreq: 'monthly', priority: 0.6 },
  { path: '/proyectos/laboratorio-diesel-mg', changefreq: 'monthly', priority: 0.6 },
  { path: '/servicios/diseno-web-cuenca', changefreq: 'monthly', priority: 0.9 },
  { path: '/servicios/tiendas-online', changefreq: 'monthly', priority: 0.9 },
  { path: '/servicios/rediseno-y-optimizacion', changefreq: 'monthly', priority: 0.9 },
  { path: '/precios', changefreq: 'monthly', priority: 0.8 },
  { path: '/contacto', changefreq: 'monthly', priority: 0.8 },
];
