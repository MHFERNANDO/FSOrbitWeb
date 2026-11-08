import { Link } from 'react-router-dom';
import Reveal from '@/components/Reveal';
import SplitHeading, { Highlight } from '@/components/SplitHeading';
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
    title: 'Quiénes somos',
    text: 'FS Orbit es un estudio de desarrollo web de Cuenca, Ecuador. Nos concentramos en pocos servicios y los trabajamos proyecto por proyecto: páginas web, tiendas online y software a medida para negocios de la ciudad y de todo el país.',
  },
  {
    title: 'Cómo trabajamos',
    text: 'Hablas directamente con quien diseña y programa tu sitio, sin intermediarios. Escribimos el código en lugar de partir de plantillas, para incluir solo lo que tu negocio necesita y cuidar la velocidad y el SEO técnico desde el primer día.',
  },
  {
    title: 'Hacia dónde vamos',
    text: 'Construimos sitios pensados para crecer contigo: una base técnica ordenada a la que se puede sumar después una tienda, un sistema a medida o mantenimiento, cuando tu negocio lo pida. Queremos que cada proyecto nos recomiende al siguiente.',
  },
];

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

      {/* Manifiesto: texto grande, sin cajas */}
      <section className="border-t border-[color:var(--line)]">
        <div className="mx-auto grid max-w-(--maxw) gap-s8 px-(--gutter) py-[var(--section-y)] lg:grid-cols-[1fr_2fr]">
          <span className="font-mono text-[length:var(--fs-mono)] uppercase tracking-[var(--tr-mono)] text-text-3">Cómo pensamos</span>
          <div className="grid">
            {PILLARS.map((p, i) => (
              <Reveal as="div" type="rise" key={p.title} className="grid gap-s3 border-b border-[color:var(--line)] py-s7 first:pt-0 md:grid-cols-[72px_1fr] md:gap-s6">
                <span className="font-mono text-[length:var(--fs-h3)] text-text-3">{String(i + 1).padStart(2, '0')}</span>
                <div className="grid gap-s3">
                  <h2 className="font-display text-[length:var(--fs-h3)] font-extrabold leading-[var(--lh-tight)]">{p.title}</h2>
                  <p className="max-w-[60ch] text-text-2">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Servicios: lista editorial, misma gramatica que la home */}
      <section className="border-t border-[color:var(--line)]">
        <div className="mx-auto max-w-(--maxw) px-(--gutter) py-[var(--section-y)]">
          <SplitHeading
            as="h2"
            className="font-display text-[length:var(--fs-h2)] font-extrabold tracking-[var(--tr-display)]"
            segments={[{ text: 'Qué' }, { text: 'hacemos', highlight: true }]}
          />
          <ul className="mt-s8 grid">
            {services.map((svc, i) => (
              <Reveal as="li" type="rise" index={i % 3} key={svc.href} className="border-b border-[color:var(--line)]">
                <Link
                  to={svc.href}
                  viewTransition
                  className="group -mx-s4 grid items-baseline gap-x-s6 gap-y-s2 px-s4 py-s6 transition-colors duration-(--d3) hover:bg-ink-850 md:grid-cols-[58px_minmax(0,1fr)_minmax(0,1.4fr)_auto]"
                >
                  <span className="font-mono text-text-3">{svc.number}</span>
                  <h3 className="font-display text-[length:var(--fs-h4)] font-extrabold transition-colors group-hover:text-signal">{svc.title}</h3>
                  <p className="max-w-[52ch] text-text-2">{svc.description}</p>
                  <Icon name="arrow-right" className="hidden text-text-3 transition-transform group-hover:translate-x-1 group-hover:text-signal md:block" />
                </Link>
              </Reveal>
            ))}
          </ul>
          <p className="mt-s7 max-w-[62ch] text-text-2">
            {renderInline('Mira sitios reales en el [portafolio](/proyectos), los valores de cada plan en [precios](/precios) o guías para negocios locales en el [blog](/blog).')}
          </p>
        </div>
      </section>

      {/* Cierre: una frase grande y los canales en linea */}
      <section className="border-t border-[color:var(--line)]">
        <div className="mx-auto grid max-w-(--maxw) gap-s8 px-(--gutter) py-[var(--section-y)] lg:grid-cols-[1fr_2fr]">
          <span className="font-mono text-[length:var(--fs-mono)] uppercase tracking-[var(--tr-mono)] text-text-3">Contacto</span>
          <div className="grid gap-s6">
            <h2 className="max-w-[20ch] font-display text-[length:var(--fs-h2)] font-extrabold leading-[var(--lh-tight)] tracking-[var(--tr-display)]">
              Cuéntanos qué necesita <Highlight>tu negocio.</Highlight>
            </h2>
            <p className="max-w-[56ch] text-text-2">
              Estamos en Cuenca, Azuay, y trabajamos de forma remota con clientes de todo Ecuador. No atendemos en una oficina abierta al público: escríbenos y coordinamos.
            </p>
            <p className="flex flex-wrap gap-x-s6 gap-y-s2 text-text-2">
              <span>Ventas (WhatsApp): 098 311 3942</span>
              <span>Soporte (WhatsApp): 098 758 2463</span>
              <a href={`mailto:${contact.email}`} className="text-text underline underline-offset-4 hover:text-signal">{contact.email}</a>
              <a href={contact.instagram} target="_blank" rel="noopener noreferrer" className="text-text underline underline-offset-4 hover:text-signal">Instagram @fs_orbit</a>
            </p>
            <div className="flex flex-wrap gap-s4">
              <a
                href={`${WA_BASE}${encodeURIComponent('Hola, vi la página de FS Orbit y quiero hablar de mi proyecto')}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackClick('whatsapp', { source: 'sobre_nosotros' })}
                className="inline-flex items-center gap-s3 rounded-r2 bg-signal px-s6 py-s4 font-mono text-[length:var(--fs-mono)] font-bold uppercase tracking-[var(--tr-mono)] text-signal-ink transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Escríbenos por WhatsApp
                <Icon name="arrow-right" />
              </a>
              <Link to="/contacto" viewTransition className="rounded-r2 border border-[color:var(--line-2)] px-s6 py-s4 font-mono text-[length:var(--fs-mono)] font-bold uppercase tracking-[var(--tr-mono)] text-text transition-all duration-300 hover:bg-ink-800">
                Todos los canales
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
