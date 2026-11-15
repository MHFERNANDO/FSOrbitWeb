// Genera dist/llms.txt desde los mismos datos que pinta el sitio
// (servicios, planes, proyectos, articulos, contacto), para que nunca
// quede desfasado respecto a la web. Antes era public/llms.txt escrito
// a mano.
import { writeFile } from 'node:fs/promises';
import { contact, pricingPlans, projects } from '../src/data/content.js';
import { servicePages } from '../src/data/servicePages.js';
import { blogPosts } from '../src/data/blog.js';

const O = 'https://fsorbit.com';

const serviceLines = servicePages.map((s) => `- [${s.breadcrumbLabel}](${O}${s.path}): ${s.seoDescription}`);

const planLines = pricingPlans.map((p) => {
  const price = /\d/.test(p.price) ? `desde ${p.price}` : 'precio a consultar';
  return `- **${p.name}** — ${price}: ${p.description}`;
});

const projectLines = projects.map((p) => `- [${p.title}](${O}/proyectos/${p.slug}): ${p.description} Sitio: ${p.url}`);

const postLines = blogPosts.map((p) => `- [${p.title}](${O}/blog/${p.slug}): ${p.description}`);

const txt = `# FS Orbit

> Agencia de desarrollo web con base en Cuenca, Azuay, Ecuador (nombre alterno: FS Orbit Ecuador). Atiende proyectos en cualquier ubicación del país. Diseña y programa páginas web, tiendas online y software a medida con código propio, sin plantillas.

## Servicios

${serviceLines.join('\n')}

## Precios

Detalle completo en [${O}/precios](${O}/precios). Los precios son "desde": el costo final depende del alcance.

${planLines.join('\n')}

## Proyectos

${projectLines.join('\n')}

## Blog

${postLines.join('\n')}

## Empresa

- [Sobre nosotros](${O}/sobre-nosotros)
- [Contacto](${O}/contacto)
- [Política de privacidad](${O}/politica-de-privacidad)

## Contacto

- Web: ${O}/contacto (WhatsApp, teléfono, correo)
- WhatsApp ventas: ${contact.telDisplay}
- Correo: ${contact.email}
- Instagram: ${contact.instagram}
- Zona de servicio: ${contact.city}, ${contact.region} — proyectos en todo Ecuador
`;

await writeFile('dist/llms.txt', txt, 'utf8');
console.log('[llms] dist/llms.txt generado');
