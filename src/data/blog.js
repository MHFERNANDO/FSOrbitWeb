// Metadata de los articulos (sin cuerpo). Datos puros, sin alias '@/', para
// que la lean tambien los scripts de build y para que el bundle de entrada
// no cargue el texto completo de cada articulo (ver blogContent.js).

export const blogPosts = [
  {
    slug: 'cuanto-cuesta-una-pagina-web-en-ecuador',
    title: 'Cuánto cuesta una página web en Ecuador',
    seoTitle: 'Cuánto cuesta una página web en Ecuador | FS Orbit',
    description: 'Qué define el precio de una página web en Ecuador, qué incluye cada tipo de sitio y cómo comparar cotizaciones. Planes de FS Orbit desde $200.',
    datePublished: '2026-11-05',
    dateModified: '2026-11-14',
    readingMinutes: 4,
  },
  {
    slug: 'pagina-web-vs-solo-instagram',
    title: 'Página web vs solo Instagram para tu negocio',
    seoTitle: 'Página web vs solo Instagram para tu negocio | FS Orbit',
    description: 'Instagram sirve para mostrarte; una página web sirve para que te encuentren y te contacten. Compara ventajas y decide qué necesita tu negocio.',
    datePublished: '2026-11-05',
    dateModified: '2026-11-05',
    readingMinutes: 4,
  },
  {
    slug: 'como-aparecer-en-google-maps-cuenca',
    title: 'Cómo aparecer en Google Maps en Cuenca',
    seoTitle: 'Cómo aparecer en Google Maps en Cuenca | FS Orbit',
    description: 'Guía paso a paso para crear y verificar tu ficha en Google Maps en Cuenca: datos correctos, categorías, fotos, reseñas y cómo ayuda tener una web propia.',
    datePublished: '2026-11-05',
    dateModified: '2026-11-05',
    readingMinutes: 5,
  },
  {
    slug: 'pagina-web-para-clinica-o-laboratorio-en-cuenca',
    title: 'Página web para clínicas, consultorios y laboratorios en Cuenca',
    seoTitle: 'Página Web para Clínicas y Laboratorios en Cuenca | FS Orbit',
    description: 'Qué debe tener la página web de una clínica, consultorio o laboratorio en Cuenca: servicios, precios referenciales, horario, mapa y citas por WhatsApp.',
    datePublished: '2026-11-14',
    dateModified: '2026-11-14',
    readingMinutes: 5,
  },
  {
    slug: 'pagina-web-para-inmobiliaria-en-cuenca',
    title: 'Página web para inmobiliarias en Cuenca: qué debe tener',
    seoTitle: 'Página Web para Inmobiliarias en Cuenca | FS Orbit',
    description: 'Qué necesita la página web de una inmobiliaria en Cuenca: fichas de propiedades, filtros, fotos livianas, mapa, contacto por WhatsApp y SEO por sector.',
    datePublished: '2026-11-14',
    dateModified: '2026-11-14',
    readingMinutes: 5,
  },
];

export const getPost = (slug) => blogPosts.find((p) => p.slug === slug);
