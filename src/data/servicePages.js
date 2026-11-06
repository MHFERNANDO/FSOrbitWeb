// Metadata de las 5 paginas /servicios/* (sin el texto largo, que vive en
// serviceContent.js y solo se descarga en esas rutas). Datos puros, sin
// alias '@/', para que lo lean tambien los scripts de build.

export const servicePages = [
  {
    slug: 'diseno-web-cuenca',
    path: '/servicios/diseno-web-cuenca',
    planName: 'Orbit Impact',
    breadcrumbLabel: 'Diseño de Páginas Web en Cuenca',
    serviceName: 'Diseño y desarrollo de páginas web',
    seoTitle: 'Diseño de Páginas Web en Cuenca desde $200 | FS Orbit',
    seoDescription: 'Diseño y desarrollo de páginas web en Cuenca, Ecuador, desde $200. Código propio, sin plantillas, con SEO técnico y carga rápida. Cotiza por WhatsApp.',
  },
  {
    slug: 'diseno-ui-ux',
    path: '/servicios/diseno-ui-ux',
    planName: null,
    breadcrumbLabel: 'Diseño UI/UX',
    serviceName: 'Diseño UI/UX para sitios web',
    seoTitle: 'Diseño UI/UX en Cuenca para Páginas Web | FS Orbit',
    seoDescription: 'Diseño UI/UX para páginas web en Cuenca y Ecuador: interfaces claras, prototipos y experiencias pensadas para convertir visitas en clientes. Cotiza hoy.',
  },
  {
    slug: 'tiendas-online',
    path: '/servicios/tiendas-online',
    planName: 'Orbit Commerce',
    breadcrumbLabel: 'Tiendas Online en Cuenca y Ecuador',
    serviceName: 'Desarrollo de tiendas online',
    seoTitle: 'Tiendas Online en Cuenca y Ecuador | FS Orbit',
    seoDescription: 'Creamos tiendas online a medida en Cuenca y todo Ecuador: catálogo dinámico, inventario y pedidos por WhatsApp, desde $500. Cotiza tu tienda hoy.',
  },
  {
    slug: 'mantenimiento-web',
    path: '/servicios/mantenimiento-web',
    planName: null,
    breadcrumbLabel: 'Mantenimiento Web',
    serviceName: 'Mantenimiento de sitios web',
    seoTitle: 'Mantenimiento Web en Ecuador: Soporte y Backups | FS Orbit',
    seoDescription: 'Mantenimiento web en Ecuador: parches de seguridad, soporte técnico y backup diario para que tu sitio nunca deje de estar online. Cotiza por WhatsApp.',
  },
  {
    slug: 'rediseno-y-optimizacion',
    path: '/servicios/rediseno-y-optimizacion',
    planName: null,
    breadcrumbLabel: 'Rediseño y Optimización de Páginas Web',
    serviceName: 'Rediseño y optimización de páginas web',
    seoTitle: 'Rediseño y Optimización de Páginas Web en Cuenca | FS Orbit',
    seoDescription: 'Rediseño y optimización de páginas web en Cuenca y Ecuador: más velocidad, código limpio y mejor experiencia en celular, sin perder tu identidad de marca.',
  },
];

export const getServicePage = (slug) => servicePages.find((s) => s.slug === slug);
