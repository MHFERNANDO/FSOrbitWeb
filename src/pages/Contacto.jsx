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

const CARD =
  'group relative grid content-start gap-s4 overflow-hidden rounded-r4 border border-[color:var(--line)] bg-ink-900 p-s7 transition-all duration-(--d3) hover:-translate-y-1 hover:border-[color:var(--line-2)] hover:bg-ink-850';
const ICON_BOX =
  'grid size-13 place-items-center rounded-r2 border border-[color:var(--line-2)] text-signal transition-[box-shadow] duration-(--d3) group-hover:shadow-[0_0_12px_var(--signal-a08)]';

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
        <div className="mx-auto grid max-w-(--maxw) gap-s5 px-(--gutter) py-[var(--section-y)] sm:grid-cols-2">
          {channels.map((c, i) => (
            <Reveal as="div" type="rise" index={i} key={c.label} className="grid">
              <a
                href={c.href}
                {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                onClick={() => trackClick(...c.track)}
                className={`${CARD} ${c.primary ? 'shadow-[inset_0_2px_0_0_var(--color-signal)]' : ''}`}
              >
                <span className={ICON_BOX}>
                  <Icon name={c.icon} fill={c.fill} className="text-xl" />
                </span>
                <span className="font-mono text-[length:var(--fs-small)] uppercase tracking-[var(--tr-mono)] text-text-3">{c.label}</span>
                <strong className="break-all font-display text-[length:var(--fs-h4)] font-extrabold text-text">{c.value}</strong>
                <span className="text-text-2">{c.note}</span>
                <span className="inline-flex items-center gap-s2 text-[length:var(--fs-small)] text-text-2 transition-colors group-hover:text-signal">
                  Contactar
                  <Icon name="arrow-right" className="transition-transform group-hover:translate-x-1" />
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-[color:var(--line)]">
        <div className="mx-auto grid max-w-(--maxw) gap-s6 px-(--gutter) py-[var(--section-y)] md:grid-cols-[1fr_1.4fr] md:gap-s9">
          <div className="flex items-start gap-s4">
            <span className={ICON_BOX}>
              <Icon name="pin" className="text-xl" />
            </span>
            <div className="grid gap-1">
              <h2 className="font-display text-[length:var(--fs-h4)] font-extrabold">Zona de servicio</h2>
              <p className="text-text-2">Cuenca, Azuay — proyectos en todo Ecuador</p>
            </div>
          </div>
          <p className="max-w-[62ch] text-text-2">
            Trabajamos de forma remota con clientes de todo el país. Cuéntanos qué necesita tu negocio, para qué sirve la página y si ya tienes dominio, logo o fotos; con eso te damos una propuesta clara.
          </p>
        </div>
      </section>
    </main>
  );
}
