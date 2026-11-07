import Reveal from '@/components/Reveal';
import SplitHeading from '@/components/SplitHeading';
import Icon from '@/components/Icon';
import Breadcrumbs from '@/components/Breadcrumbs';
import { usePageSeo } from '@/hooks/usePageSeo';
import { contact } from '@/data/content';
import { trackClick } from '@/lib/analytics';

const WA = 'https://wa.me/';
const CRUMBS = [
  { name: 'Inicio', path: '/' },
  { name: 'Contacto', path: '/contacto' },
];

export default function Contacto() {
  usePageSeo({ path: '/contacto', crumbs: CRUMBS, type: 'ContactPage' });

  const channels = [
    {
      icon: 'whatsapp',
      fill: true,
      label: 'WhatsApp ventas',
      value: '098 311 3942',
      note: 'Cotizaciones y proyectos nuevos. La forma más rápida de empezar.',
      href: `${WA}${contact.whatsappSales}?text=${encodeURIComponent('Hola, quiero cotizar un proyecto web')}`,
      external: true,
      track: ['whatsapp', { source: 'contacto_ventas' }],
      primary: true,
    },
    {
      icon: 'whatsapp',
      fill: true,
      label: 'WhatsApp soporte',
      value: '098 758 2463',
      note: 'Ayuda técnica con un sitio que ya tienes.',
      href: `${WA}${contact.whatsappSupport}?text=${encodeURIComponent('Hola, necesito soporte técnico')}`,
      external: true,
      track: ['whatsapp', { source: 'contacto_soporte' }],
    },
    {
      icon: 'phone',
      label: 'Teléfono',
      value: contact.telDisplay,
      note: 'Llámanos y lo conversamos.',
      href: `tel:${contact.tel}`,
      track: ['tel', { source: 'contacto_page' }],
    },
    {
      icon: 'mail',
      label: 'Correo',
      value: contact.email,
      note: 'Para enviarnos documentos o referencias.',
      href: `mailto:${contact.email}`,
      track: ['email', { source: 'contacto_page' }],
    },
  ];

  return (
    <main id="main">
      <header className="mx-auto max-w-(--maxw) px-(--gutter) pb-[clamp(48px,6vw,80px)] pt-[clamp(72px,10vw,152px)]">
        <Breadcrumbs crumbs={CRUMBS} />
        <Reveal as="span" type="fade" className="mb-s5 inline-block font-mono text-[length:var(--fs-mono)] uppercase tracking-[var(--tr-mono)] text-text-3">
          Contacto
        </Reveal>
        <SplitHeading
          as="h1"
          className="max-w-[18ch] font-display text-[length:var(--fs-h1)] font-extrabold leading-[var(--lh-tight)] tracking-[var(--tr-display)]"
          segments={[{ text: 'Hablemos de' }, { break: true }, { text: 'tu proyecto.', highlight: true }]}
        />
        <Reveal as="p" type="rise" className="mt-s5 max-w-[56ch] text-[length:var(--fs-lead)] text-text-2">
          Con base en Cuenca, atendemos proyectos en cualquier ubicación de Ecuador. Escríbenos por el canal que prefieras.
        </Reveal>
      </header>

      <section className="border-t border-[color:var(--line)]">
        <div className="mx-auto max-w-(--maxw) px-(--gutter) py-[var(--section-y)]">
          <ul className="grid">
            {channels.map((c, i) => (
              <Reveal as="li" type="rise" index={i} key={c.label} className="border-b border-[color:var(--line)] first:border-t">
                <a
                  href={c.href}
                  {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  onClick={() => trackClick(...c.track)}
                  className="group -mx-s4 grid gap-x-s7 gap-y-s2 px-s4 py-s7 transition-colors duration-(--d3) hover:bg-ink-850 md:grid-cols-[220px_minmax(0,1.4fr)_minmax(0,1fr)_auto] md:items-baseline"
                >
                  <span className="font-mono text-[length:var(--fs-small)] uppercase tracking-[var(--tr-mono)] text-text-3">{c.label}</span>
                  <strong className="break-all font-display text-[length:var(--fs-h3)] font-extrabold leading-[var(--lh-tight)] transition-colors group-hover:text-signal">{c.value}</strong>
                  <span className="max-w-[40ch] text-text-2">{c.note}</span>
                  <Icon name="arrow-right" className="hidden text-text-3 transition-transform group-hover:translate-x-1 group-hover:text-signal md:block" />
                </a>
              </Reveal>
            ))}
          </ul>
          <p className="mt-s8 max-w-[62ch] text-text-2">
            Cuenca, Azuay — proyectos en todo Ecuador. Trabajamos de forma remota; cuéntanos qué necesita tu negocio, para qué sirve la página y si ya tienes dominio, logo o fotos, y te damos una propuesta clara.
          </p>
        </div>
      </section>
    </main>
  );
}
