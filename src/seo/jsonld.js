// JSON-LD de cada pagina como UN solo @graph con @id estables: la
// organizacion y el sitio son los mismos nodos (mismo @id) en todas las
// rutas, y cada pagina agrega su WebPage, sus migas y lo especifico
// (Service+Offer, FAQPage, CreativeWork, Article). Se inyecta desde
// useSeo y queda en el HTML prerenderizado.
import { contact, pricingPlans } from '@/data/content';

export const ORIGIN = 'https://fsorbit.com';
export const ID = {
  org: `${ORIGIN}/#organization`,
  site: `${ORIGIN}/#website`,
  logo: `${ORIGIN}/#logo`,
};

const urlOf = (path) => (path === '/' ? `${ORIGIN}/` : `${ORIGIN}${path}`);
const AREA = ['Cuenca', 'Azuay', 'Ecuador'];

function organizationNode() {
  return {
    '@type': 'ProfessionalService',
    '@id': ID.org,
    name: 'FS Orbit',
    alternateName: 'FS Orbit Ecuador',
    url: `${ORIGIN}/`,
    description:
      'Agencia de desarrollo web en Cuenca, Ecuador. Sitios a medida, sin plantillas: landing pages, tiendas online y software a medida con código propio y SEO técnico.',
    logo: {
      '@type': 'ImageObject',
      '@id': ID.logo,
      url: `${ORIGIN}/assets/Logo-512.webp`,
      contentUrl: `${ORIGIN}/assets/Logo-512.webp`,
      width: 512,
      height: 512,
      caption: 'FS Orbit',
    },
    image: `${ORIGIN}/assets/og-image.jpg`,
    telephone: contact.tel,
    email: contact.email,
    priceRange: '$200-$500+',
    address: {
      '@type': 'PostalAddress',
      addressLocality: contact.city,
      addressRegion: contact.region,
      addressCountry: 'EC',
    },
    geo: { '@type': 'GeoCoordinates', latitude: -2.9001, longitude: -79.0059 },
    areaServed: AREA,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        telephone: contact.tel,
        email: contact.email,
        areaServed: 'EC',
        availableLanguage: 'es',
      },
    ],
    sameAs: [contact.instagram],
    knowsAbout: ['Desarrollo web', 'Diseño UI/UX', 'Tiendas online', 'SEO técnico', 'Optimización de rendimiento web', 'Mantenimiento web'],
  };
}

function websiteNode() {
  return {
    '@type': 'WebSite',
    '@id': ID.site,
    url: `${ORIGIN}/`,
    name: 'FS Orbit',
    alternateName: 'FS Orbit Ecuador',
    inLanguage: 'es-EC',
    publisher: { '@id': ID.org },
  };
}

// Graph base de cualquier pagina. `nodes` son los nodos propios de la ruta.
export function pageGraph({ path, name, description, type = 'WebPage', crumbs = [], image, datePublished, dateModified, nodes = [] }) {
  const url = urlOf(path);
  const hasCrumbs = crumbs.length > 1;
  const page = {
    '@type': type,
    '@id': `${url}#webpage`,
    url,
    name,
    description,
    inLanguage: 'es-EC',
    isPartOf: { '@id': ID.site },
    about: { '@id': ID.org },
    ...(image ? { primaryImageOfPage: { '@type': 'ImageObject', url: image } } : {}),
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
    ...(hasCrumbs ? { breadcrumb: { '@id': `${url}#breadcrumb` } } : {}),
  };
  const graph = [organizationNode(), websiteNode(), page];
  if (hasCrumbs) {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: crumbs.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: c.name,
        item: urlOf(c.path),
      })),
    });
  }
  graph.push(...nodes);
  return { '@context': 'https://schema.org', '@graph': graph };
}

function offerFor(plan, url) {
  const match = /\$(\d+)/.exec(plan.price);
  if (!match) return null;
  return {
    '@type': 'Offer',
    '@id': `${url}#offer-${plan.name.toLowerCase().replace(/\s+/g, '-')}`,
    name: plan.name,
    url,
    priceCurrency: 'USD',
    // Los planes publicados dicen "desde": precio minimo, no cerrado.
    priceSpecification: { '@type': 'PriceSpecification', minPrice: Number(match[1]), priceCurrency: 'USD' },
    price: match[1],
    availability: 'https://schema.org/InStock',
    seller: { '@id': ID.org },
  };
}

// planName: nombre del plan de content.js que corresponde a este servicio.
export function serviceNode({ path, name, description, planName }) {
  const url = urlOf(path);
  const plan = planName ? pricingPlans.find((p) => p.name === planName) : null;
  const offer = plan ? offerFor(plan, url) : null;
  return {
    '@type': 'Service',
    '@id': `${url}#service`,
    name,
    serviceType: name,
    description,
    url,
    areaServed: AREA,
    provider: { '@id': ID.org },
    mainEntityOfPage: { '@id': `${url}#webpage` },
    ...(offer ? { offers: offer } : {}),
  };
}

// Un Service con su Offer por cada plan publicado (se usa en /precios).
export function planNodes(path) {
  const url = urlOf(path);
  return pricingPlans.map((plan) => {
    const offer = offerFor(plan, url);
    return {
      '@type': 'Service',
      '@id': `${url}#plan-${plan.name.toLowerCase().replace(/\s+/g, '-')}`,
      name: plan.name,
      description: plan.description,
      serviceType: 'Desarrollo web',
      areaServed: AREA,
      provider: { '@id': ID.org },
      ...(offer ? { offers: offer } : {}),
    };
  });
}

export function faqNode(path, qa) {
  const url = urlOf(path);
  return {
    '@type': 'FAQPage',
    '@id': `${url}#faq`,
    url,
    mainEntity: qa.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  };
}

export function projectNode({ path, name, description, img, siteUrl }) {
  const url = urlOf(path);
  return {
    '@type': 'CreativeWork',
    '@id': `${url}#work`,
    name,
    description,
    url,
    image: `${ORIGIN}/assets/${img}-1440.webp`,
    mainEntityOfPage: { '@id': `${url}#webpage` },
    creator: { '@id': ID.org },
    ...(siteUrl ? { sameAs: siteUrl, citation: siteUrl } : {}),
  };
}

export function projectListNode(path, items) {
  const url = urlOf(path);
  return {
    '@type': 'ItemList',
    '@id': `${url}#list`,
    itemListElement: items.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: urlOf(`/proyectos/${p.slug}`),
      name: p.title,
    })),
  };
}

export function articleNode({ path, headline, description, datePublished, dateModified }) {
  const url = urlOf(path);
  return {
    '@type': 'Article',
    '@id': `${url}#article`,
    headline,
    description,
    url,
    inLanguage: 'es-EC',
    datePublished,
    dateModified: dateModified || datePublished,
    image: `${ORIGIN}/assets/og-image.jpg`,
    author: { '@id': ID.org },
    publisher: { '@id': ID.org },
    mainEntityOfPage: { '@id': `${url}#webpage` },
  };
}
