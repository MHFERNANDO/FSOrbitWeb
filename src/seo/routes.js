// Fuente unica de rutas del sitio y de su metadata SEO (title y
// description). La consumen:
//  - las paginas, via src/seo/meta.js (useSeo + JSON-LD)
//  - scripts/prerender.mjs (que paginas hornear a HTML)
//  - scripts/generate-sitemap.mjs, scripts/generate-llms.mjs
//  - scripts/verify-build.mjs (largo de title/description, etc.)
// Es JS puro con imports relativos para que Node lo pueda cargar sin Vite.
//
// `files`: archivos fuente que determinan el contenido de la ruta; el
// sitemap usa su ultima fecha de commit (git) como <lastmod>. Para los
// articulos manda dateModified del propio articulo.
import { blogPosts } from '../data/blog.js';
import { servicePages } from '../data/servicePages.js';

const SERVICE_FILES = ['src/data/servicePages.js', 'src/data/serviceContent.js', 'src/data/faq.js', 'src/pages/Servicio.jsx'];

const projectMeta = [
  {
    slug: 'gravity-studio',
    name: 'Gravity Estudio Creativo',
    title: 'Gravity Studio: Sitio Web en Cuenca | Caso FS Orbit',
    description:
      'Caso de estudio: sitio web para Gravity Estudio Creativo, estudio de marketing y producción audiovisual en Cuenca. Servicios, planes y contacto en una web.',
  },
  {
    slug: 'acculab-system',
    name: 'Accu-Lab',
    title: 'Accu-Lab: Sitio Web en Cuenca | Caso FS Orbit',
    description:
      'Caso de estudio: sitio web de Accu-Lab, laboratorio clínico en Cuenca, con exámenes, precios referenciales, toma a domicilio y agenda por WhatsApp.',
  },
  {
    slug: 'jf-vapes-store',
    name: 'JF Vapes Store',
    title: 'JF Vapes Store: Sitio Web en Cuenca | Caso FS Orbit',
    description:
      'Caso de estudio: tienda online JF Vapes con catálogo por categorías, precios visibles, preguntas frecuentes y pedidos por WhatsApp, con entrega en Cuenca.',
  },
  {
    slug: 'laboratorio-diesel-mg',
    name: 'Laboratorio Diesel MG',
    title: 'Laboratorio Diesel MG: Sitio Web en Cuenca | Caso FS Orbit',
    description:
      'Caso de estudio: sitio web para Laboratorio Diesel MG, taller de inyección diésel en Cuenca, con servicios, equipos de prueba y consultas por WhatsApp.',
  },
];

// Caso sin material publicable todavia: se prerenderiza (para que el enlace
// de la home no caiga en 404) pero va con noindex y fuera del sitemap.
const draftRoutes = [
  {
    path: '/proyectos/cmr-inmobiliaria',
    draft: true,
    title: 'CMR Inmobiliaria: Caso en Preparación | FS Orbit',
    description:
      'Caso en preparación: recorridos 360 para CMR Inmobiliaria. Publicaremos el detalle del proyecto cuando tengamos el material aprobado por el cliente.',
    files: ['src/pages/ProyectoDetalle.jsx', 'src/data/content.js'],
  },
];

export const routes = [
  {
    path: '/',
    changefreq: 'weekly',
    priority: 1.0,
    title: 'Diseño de Páginas Web en Cuenca | FS Orbit Ecuador',
    description:
      'Diseñamos páginas web, tiendas online y software a medida en Cuenca, Ecuador. Código propio, sin plantillas, SEO técnico y carga rápida. Cotiza hoy.',
    files: ['src/pages/Home.jsx', 'src/data/content.js'],
  },
  {
    path: '/proyectos',
    changefreq: 'monthly',
    priority: 0.9,
    title: 'Portafolio de Páginas Web en Cuenca | FS Orbit',
    description:
      'Portafolio de FS Orbit: sitios web reales para un laboratorio clínico, un estudio creativo, una tienda online y un taller diésel en Cuenca, Ecuador.',
    files: ['src/pages/Proyectos.jsx', 'src/data/content.js'],
  },
  ...projectMeta.map((p) => ({
    path: `/proyectos/${p.slug}`,
    changefreq: 'monthly',
    priority: 0.6,
    title: p.title,
    description: p.description,
    files: ['src/pages/ProyectoDetalle.jsx', 'src/data/projectDetails.js', 'src/data/content.js'],
    project: p,
  })),
  {
    path: '/servicios',
    changefreq: 'monthly',
    priority: 0.8,
    title: 'Servicios Web en Cuenca: Diseño y Tiendas | FS Orbit',
    description:
      'Servicios de FS Orbit en Cuenca: diseño de páginas web, UI/UX, tiendas online, mantenimiento y rediseño. Mira qué resuelve cada uno y cuánto cuesta.',
    files: ['src/pages/Servicios.jsx', 'src/data/content.js'],
  },
  ...servicePages.map((s) => ({
    path: s.path,
    changefreq: 'monthly',
    priority: 0.9,
    title: s.seoTitle,
    description: s.seoDescription,
    files: SERVICE_FILES,
    service: s.slug,
  })),
  {
    path: '/precios',
    changefreq: 'monthly',
    priority: 0.8,
    title: 'Precios de Páginas Web en Ecuador desde $200 | FS Orbit',
    description:
      'Precios de páginas web en Ecuador: landing page desde $200, tienda online desde $500 y software a medida. Compara qué incluye cada plan de FS Orbit.',
    files: ['src/pages/Precios.jsx', 'src/data/content.js', 'src/data/faq.js'],
  },
  {
    path: '/sobre-nosotros',
    changefreq: 'monthly',
    priority: 0.6,
    title: 'Sobre FS Orbit | Agencia de Desarrollo Web en Cuenca',
    description:
      'Conoce FS Orbit, agencia de desarrollo web con base en Cuenca, Ecuador. Cómo trabajamos, qué hacemos y cómo contactarnos para tu proyecto web.',
    files: ['src/pages/SobreNosotros.jsx'],
  },
  {
    path: '/blog',
    changefreq: 'weekly',
    priority: 0.7,
    title: 'Blog de Páginas Web y SEO Local en Ecuador | FS Orbit',
    description:
      'Guías prácticas sobre páginas web, precios, Instagram vs web y Google Maps para negocios de Cuenca y Ecuador. Aprende qué necesita tu negocio para crecer.',
    files: ['src/pages/Blog.jsx', 'src/data/blog.js'],
    lastmod: blogPosts.map((p) => p.dateModified).sort().at(-1),
  },
  ...blogPosts.map((p) => ({
    path: `/blog/${p.slug}`,
    changefreq: 'monthly',
    priority: 0.7,
    title: p.seoTitle,
    description: p.description,
    files: ['src/pages/BlogPost.jsx', 'src/data/blog.js', 'src/data/blogContent.js'],
    lastmod: p.dateModified,
    post: p.slug,
  })),
  {
    path: '/contacto',
    changefreq: 'monthly',
    priority: 0.8,
    title: 'Contacto | Cotiza tu Página Web en Cuenca | FS Orbit',
    description:
      'Cotiza tu página web en Cuenca: escríbenos por WhatsApp, teléfono o correo y recibe una propuesta clara. Atendemos negocios de todo Ecuador.',
    files: ['src/pages/Contacto.jsx'],
  },
  {
    path: '/politica-de-privacidad',
    changefreq: 'yearly',
    priority: 0.3,
    title: 'Política de Privacidad | FS Orbit',
    description:
      'Privacidad de FS Orbit: qué datos recibimos al contactarnos por WhatsApp o correo, cómo usamos la analítica de Vercel y cómo ejercer tus derechos.',
    files: ['src/pages/Privacidad.jsx'],
  },
];

// Todo lo que se prerenderiza (rutas publicas + borradores).
export const allRoutes = [...routes, ...draftRoutes];

export const routeMeta = (path) => allRoutes.find((r) => r.path === path);
