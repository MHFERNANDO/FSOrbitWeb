import { Link } from 'react-router-dom';
import Reveal from '@/components/Reveal';
import SplitHeading from '@/components/SplitHeading';
import Icon from '@/components/Icon';
import Breadcrumbs from '@/components/Breadcrumbs';
import { usePageSeo } from '@/hooks/usePageSeo';
import { renderInline } from '@/lib/inlineLinks';
import { trackClick } from '@/lib/analytics';
import { contact, services } from '@/data/content';

const WA_BASE = 'https://wa.me/593983113942?text=';

const CRUMBS = [
  { name: 'Inicio', path: '/' },
  { name: 'Sobre nosotros', path: '/sobre-nosotros' },
];

// TODO(cliente): esta pagina solo afirma lo que ya es publico en el sitio
// (servicios, planes, proyectos, contacto). Para darle mas peso como
// "pagina de autor/entidad" hace falta que el cliente confirme y envie:
//  - nombre(s) y rol(es) de quien integra FS Orbit (con foto si quiere)
//  - anio de inicio de actividades
//  - formacion o trayectoria que quiera mostrar
// No se inventan: cuando existan, agregarlos aqui y como `founder`/`member`
// en el JSON-LD de la organizacion (src/seo/jsonld.js).
const SECTIONS = [
  {
    h2: 'Quiénes somos',
    paragraphs: [
      'FS Orbit es una agencia de desarrollo web con base en Cuenca, Ecuador. Diseñamos y programamos páginas web, tiendas online y software a medida para negocios de la ciudad y de todo el país. Aunque nuestra base está en Cuenca, atendemos proyectos en cualquier ubicación de Ecuador.',
      'Nos dedicamos a que un negocio pase de tener una presencia improvisada a tener un sitio claro, rápido y fácil de encontrar en Google, en Google Maps y en las herramientas de búsqueda con inteligencia artificial.',
    ],
  },
  {
    h2: 'Cómo trabajamos',
    paragraphs: [
      'Escribimos el código de cada proyecto: no partimos de plantillas ni de constructores de páginas. Esto nos permite incluir solo lo que tu sitio necesita, cuidar la velocidad de carga y dejar bien resuelta la parte técnica del SEO, como los títulos, las descripciones, la estructura de encabezados y los datos estructurados.',
      'Trabajamos con tecnologías web modernas como React para los proyectos que lo requieren, y publicamos los sitios sobre infraestructura con certificado HTTPS. Cada proyecto empieza por entender qué quieres que haga tu web y a quién le habla.',
    ],
  },
  {
    h2: 'Qué hacemos',
    paragraphs: [
      'Nuestros servicios cubren desde el diseño hasta el cuidado posterior de tu sitio. Cada uno tiene su propia página con el detalle de lo que incluye:',
    ],
  },
];

export default function SobreNosotros() {
  usePageSeo({ path: '/sobre-nosotros', crumbs: CRUMBS, type: 'AboutPage' });

  return (
    <main id="main">
      <header className="mx-auto max-w-(--maxw) px-(--gutter) pb-[clamp(56px,7vw,96px)] pt-[clamp(72px,10vw,152px)]">
        <Breadcrumbs crumbs={CRUMBS} />
        <Reveal as="span" type="fade" className="mb-s5 inline-block font-mono text-[length:var(--fs-mono)] uppercase tracking-[var(--tr-mono)] text-text-3">
          Sobre nosotros
        </Reveal>
        <SplitHeading
          as="h1"
          className="max-w-[18ch] font-display text-[length:var(--fs-h1)] font-extrabold leading-[var(--lh-tight)] tracking-[var(--tr-display)]"
          segments={[{ text: 'Una agencia web' }, { break: true }, { text: 'con base en Cuenca.', highlight: true }]}
        />
        <Reveal as="p" type="rise" className="mt-s5 max-w-[56ch] text-[length:var(--fs-lead)] text-text-2">
          FS Orbit diseña y desarrolla sitios web a medida para negocios de Cuenca y de todo Ecuador.
        </Reveal>
      </header>

      {SECTIONS.map((s) => (
        <section key={s.h2} className="border-t border-[color:var(--line)]">
          <div className="mx-auto grid max-w-(--maxw) gap-s6 px-(--gutter) py-[var(--section-y)] lg:grid-cols-[1fr_1.4fr] lg:gap-s9">
            <h2 className="font-display text-[length:var(--fs-h3)] font-extrabold leading-[var(--lh-tight)]">{s.h2}</h2>
            <div className="grid gap-s4">
              {s.paragraphs.map((p) => (
                <Reveal as="p" type="rise" key={p.slice(0, 40)} className="max-w-[62ch] text-text-2">
                  {p}
                </Reveal>
              ))}
              {s.h2 === 'Qué hacemos' && (
                <ul className="grid gap-s3">
                  {services.map((svc) => (
                    <li key={svc.href}>
                      <Link to={svc.href} viewTransition className="group inline-flex items-center gap-s2 text-text transition-colors hover:text-signal">
                        {svc.title}
                        <Icon name="arrow-right" className="transition-transform group-hover:translate-x-1" />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      ))}

      <section className="border-t border-[color:var(--line)]">
        <div className="mx-auto grid max-w-(--maxw) gap-s6 px-(--gutter) py-[var(--section-y)] lg:grid-cols-[1fr_1.4fr] lg:gap-s9">
          <h2 className="font-display text-[length:var(--fs-h3)] font-extrabold leading-[var(--lh-tight)]">Nuestro trabajo</h2>
          <div className="grid gap-s4">
            <p className="max-w-[62ch] text-text-2">
              {renderInline('Puedes ver sitios reales que hemos desarrollado en el [portafolio](/proyectos): un laboratorio clínico, un estudio creativo, una tienda online y un laboratorio de inyección diésel, todos en Cuenca. Para conocer los valores de cada plan, revisa los [precios](/precios); y si prefieres leer antes de decidir, en el [blog](/blog) publicamos guías para negocios locales.')}
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-[color:var(--line)]">
        <div className="mx-auto grid max-w-(--maxw) gap-s6 px-(--gutter) py-[var(--section-y)] lg:grid-cols-[1fr_1.4fr] lg:gap-s9">
          <h2 className="font-display text-[length:var(--fs-h3)] font-extrabold leading-[var(--lh-tight)]">Cómo contactarnos</h2>
          <div className="grid gap-s4 text-text-2">
            <p className="max-w-[62ch]">
              Estamos en Cuenca, Azuay, y trabajamos de forma remota con clientes de todo Ecuador. No atendemos en una oficina abierta al público: escríbenos y coordinamos.
            </p>
            <ul className="grid gap-s2">
              <li>
                {'Ventas y proyectos (WhatsApp): '}
                <a href={`https://wa.me/${contact.whatsappSales}`} target="_blank" rel="noopener noreferrer" className="text-text underline underline-offset-4 hover:text-signal">
                  098 311 3942
                </a>
              </li>
              <li>
                {'Soporte técnico (WhatsApp): '}
                <a href={`https://wa.me/${contact.whatsappSupport}`} target="_blank" rel="noopener noreferrer" className="text-text underline underline-offset-4 hover:text-signal">
                  098 758 2463
                </a>
              </li>
              <li>
                {'Correo: '}
                <a href={`mailto:${contact.email}`} className="text-text underline underline-offset-4 hover:text-signal">
                  {contact.email}
                </a>
              </li>
              <li>
                {'Instagram: '}
                <a href={contact.instagram} target="_blank" rel="noopener noreferrer" className="text-text underline underline-offset-4 hover:text-signal">
                  @fs_orbit
                </a>
              </li>
            </ul>
            <a
              href={`${WA_BASE}${encodeURIComponent('Hola, vi la página de FS Orbit y quiero hablar de mi proyecto')}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackClick('whatsapp', { source: 'sobre_nosotros' })}
              className="mt-s3 inline-flex w-fit items-center gap-s3 rounded-r2 bg-signal px-s6 py-s4 font-mono text-[length:var(--fs-mono)] font-bold uppercase tracking-[var(--tr-mono)] text-signal-ink"
            >
              Escríbenos por WhatsApp
              <Icon name="arrow-right" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
