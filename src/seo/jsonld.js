// Helpers chicos para armar JSON-LD por pagina sin repetir boilerplate.
// Los datos de negocio (telefono, geo, sameAs...) ya viven en el
// Organization global de index.html — aca solo se arma lo especifico
// de cada ruta (Service, BreadcrumbList, FAQPage).
const ORIGIN = 'https://fsorbit.com';

export function breadcrumbs(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map(({ name, path }, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
      item: `${ORIGIN}${path}`,
    })),
  };
}

export function service({ name, description, path, areaServed = ['Cuenca', 'Azuay', 'Ecuador'] }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: name,
    name,
    description,
    url: `${ORIGIN}${path}`,
    areaServed,
    provider: { '@type': 'Organization', name: 'FS Orbit', url: ORIGIN },
  };
}

export function faqPage(qa) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: qa.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  };
}
