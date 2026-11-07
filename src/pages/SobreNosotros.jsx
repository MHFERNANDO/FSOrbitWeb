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
// "pagina de entidad" hace falta que el cliente confirme y envie:
//  - nombre(s) y rol(es) de quien integra FS Orbit (con foto si quiere)
//  - anio de inicio de actividades
//  - formacion o trayectoria que quiera mostrar
// No se inventan: cuando existan, agregarlos aqui y como `founder`/`member`
// en el JSON-LD de la organizacion (src/seo/jsonld.js).
const PILLARS = [
  {
    icon: 'pin',
    title: 'Quiénes somos',
    text: 'FS Orbit es una agencia de desarrollo web con base en Cuenca, Ecuador. Diseñamos y programamos páginas web, tiendas online y software a medida para negocios de la ciudad y de todo el país. Aunque nuestra base está en Cuenca, atendemos proyectos en cualquier ubicación de Ecuador.',
  },
  {
    icon: 'chip',
    title: 'Cómo trabajamos',
    text: 'Escribimos el código de cada proyecto: no partimos de plantillas ni de constructores de páginas. Así incluimos solo lo que tu sitio necesita, cuidamos la velocidad de carga y dejamos bien resuelta la parte técnica del SEO: títulos, descripciones, encabezados y datos estructurados.',
  },
  {
    icon: 'target',
    title: 'Qué buscamos',
    text: 'Que un negocio pase de una presencia improvisada a un sitio claro, rápido y fácil de encontrar en Google, en Google Maps y en las herramientas de búsqueda con inteligencia artificial. Cada proyecto empieza por entender qué quieres que haga tu web y a quién le habla.',
  },
];

const CARD =
  'group grid content-start gap-s4 rounded-r4 border border-[color:var(--line)] bg-ink-900 p-s7 transition-all duration-(--d3) hover:-translate-y-1 hover:border-[color:var(--line-2)] hover:bg-ink-850';
const ICON_BOX =
  'grid size-13 place-items-center rounded-r2 border border-[color:var(--line-2)] text-signal transition-[box-shadow] duration-(--d3) group-hover:shadow-[0_0_12px_var(--signal-a08)]';

export default function SobreNosotros() {
  usePageSeo({ path: '/sobre-nosotros', crumbs: CRUMBS, type: 'AboutPage' });

  return (
    <main id="main">
      <header className="mx-auto max-w-(--maxw) px-(--gutter) pb-[clamp(48px,6vw,80px)] pt-[clamp(72px,10vw,152px)]">
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

      <section className="border-t border-[color:var(--line)]">
        <div className="mx-auto grid max-w-(--maxw) gap-s5 px-(--gutter) py-[var(--section-y)] md:grid-cols-3">
          {PILLARS.map((p, i) => (
            <Reveal as="article" type="rise" index={i} key={p.title} className={CARD}>
              <span className={ICON_BOX}>
                <Icon name={p.icon} className="text-xl" />
              </span>
              <h2 className="font-display text-[length:var(--fs-h4)] font-extrabold">{p.title}</h2>
              <p className="text-text-2">{p.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-[color:var(--line)]">
        <div className="mx-auto max-w-(--maxw) px-(--gutter) py-[var(--section-y)]">
          <h2 className="font-display text-[length:var(--fs-h2)] font-extrabold tracking-[var(--tr-display)]">Qué hacemos</h2>
          <p className="mt-s4 max-w-[56ch] text-text-2">Cada servicio tiene su propia página con el detalle de lo que incluye.</p>
          <ul className="mt-s8 grid gap-s5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((svc, i) => (
              <Reveal as="li" type="rise" index={i % 3} key={svc.href} className="grid">
                <Link to={svc.href} viewTransition className={CARD}>
                  <span className={ICON_BOX}>
                    <Icon name={svc.icon} className="text-xl" />
                  </span>
                  <h3 className="font-display text-[length:var(--fs-h4)] font-extrabold">{svc.title}</h3>
                  <p className="text-text-2">{svc.description}</p>
                  <span className="inline-flex items-center gap-s2 text-[length:var(--fs-small)] text-text-2 transition-colors group-hover:text-signal">
                    Ver servicio
                    <Icon name="arrow-right" className="transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
          <p className="mt-s7 max-w-[62ch] text-text-2">
            {renderInline('Mira sitios reales en el [portafolio](/proyectos), los valores de cada plan en [precios](/precios) o guías para negocios locales en el [blog](/blog).')}
          </p>
        </div>
      </section>

      <section className="border-t border-[color:var(--line)]">
        <div className="mx-auto max-w-(--maxw) px-(--gutter) py-[var(--section-y)]">
          <div className="grid gap-s6 rounded-r4 border border-[color:var(--line-2)] bg-ink-850 p-s8 md:grid-cols-[1.2fr_1fr] md:items-center">
            <div className="grid gap-s4">
              <h2 className="font-display text-[length:var(--fs-h3)] font-extrabold leading-[var(--lh-tight)]">Cómo contactarnos</h2>
              <p className="max-w-[52ch] text-text-2">
                Estamos en Cuenca, Azuay, y trabajamos de forma remota con clientes de todo Ecuador. No atendemos en una oficina abierta al público: escríbenos y coordinamos.
              </p>
              <ul className="grid gap-s2 text-text-2">
                <li>{`Ventas (WhatsApp): 098 311 3942`}</li>
                <li>{`Soporte (WhatsApp): 098 758 2463`}</li>
                <li>
                  <a href={`mailto:${contact.email}`} className="text-text underline underline-offset-4 hover:text-signal">
                    {contact.email}
                  </a>
                </li>
                <li>
                  <a href={contact.instagram} target="_blank" rel="noopener noreferrer" className="text-text underline underline-offset-4 hover:text-signal">
                    Instagram @fs_orbit
                  </a>
                </li>
              </ul>
            </div>
            <div className="grid gap-s4 md:justify-items-end">
              <a
                href={`${WA_BASE}${encodeURIComponent('Hola, vi la página de FS Orbit y quiero hablar de mi proyecto')}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackClick('whatsapp', { source: 'sobre_nosotros' })}
                className="inline-flex w-fit items-center gap-s3 rounded-r2 bg-signal px-s6 py-s4 font-mono text-[length:var(--fs-mono)] font-bold uppercase tracking-[var(--tr-mono)] text-signal-ink transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Escríbenos por WhatsApp
                <Icon name="arrow-right" />
              </a>
              <Link to="/contacto" viewTransition className="text-text-2 underline underline-offset-4 transition-colors hover:text-text">
                Ver todos los canales
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
