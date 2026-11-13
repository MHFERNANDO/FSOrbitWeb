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
import { servicePages } from '../data/servicePages.js';

const SERVICE_FILES = ['src/data/servicePages.js', 'src/data/serviceContent.js', 'src/data/faq.js', 'src/pages/ServicePage.jsx'];

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

export const routeMeta = (path) => routes.find((r) => r.path === path);
