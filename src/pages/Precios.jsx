import Reveal from '@/components/Reveal';
import SplitHeading from '@/components/SplitHeading';
import Icon from '@/components/Icon';
import { useSeo } from '@/hooks/useSeo';
import { breadcrumbs, faqPage } from '@/seo/jsonld';
import { pricingPlans } from '@/data/content';

const WA_BASE = 'https://wa.me/593983113942?text=';

const faq = [
  {
    question: '¿Los precios incluyen SEO?',
    answer: 'Sí, todos los planes incluyen SEO on-page estructural como parte del desarrollo, no como costo adicional.',
  },
  {
    question: '¿Qué significa "desde" en el precio?',
    answer: 'Es el precio base del plan. El costo final depende del alcance exacto del proyecto (número de vistas, integraciones, contenido).',
  },
  {
    question: '¿Qué formas de pago aceptan?',
    answer: '{{TODO: confirmar formas de pago reales (transferencia, tarjeta, etc.)}}',
  },
  {
    question: '¿El dominio y el hosting están incluidos?',
    answer: '{{TODO: confirmar si el dominio/hosting corren por cuenta del cliente o están incluidos en algún plan}}',
  },
];

export default function Precios() {
  useSeo({
    title: 'Precios | Planes de Desarrollo Web — FS Orbit',
    description: 'Planes de desarrollo web de FS Orbit: Orbit Impact (landing page), Orbit Commerce (tienda online) y Deep Space System (software a medida). Precios desde $200.',
    path: '/precios',
    jsonLd: [
      breadcrumbs([
        { name: 'Inicio', path: '/' },
        { name: 'Precios', path: '/precios' },
      ]),
      faqPage(faq),
    ],
  });

  return (
    <main id="main">
      <header className="mx-auto max-w-(--maxw) px-(--gutter) pb-[clamp(56px,7vw,96px)] pt-[clamp(72px,10vw,152px)]">
        <Reveal as="span" type="fade" className="mb-s5 inline-block font-mono text-[length:var(--fs-mono)] uppercase tracking-[var(--tr-mono)] text-text-3">
          Niveles de Despliegue
        </Reveal>
        <SplitHeading
          as="h1"
          className="max-w-[18ch] font-display text-[length:var(--fs-h1)] font-extrabold leading-[var(--lh-tight)] tracking-[var(--tr-display)]"
          segments={[{ text: 'Precios claros,' }, { break: true }, { text: 'sin sorpresas.', highlight: true }]}
        />
        <Reveal as="p" type="rise" className="mt-s5 max-w-[56ch] text-[length:var(--fs-lead)] text-text-2">
          Desde sitios de alto impacto hasta ecosistemas digitales complejos. Cada plan incluye SEO técnico y código propio, sin plantillas.
        </Reveal>
      </header>

      <section className="border-t border-[color:var(--line)]">
        <div className="mx-auto max-w-(--maxw) px-(--gutter) py-[var(--section-y)]">
          <div className="grid gap-px overflow-hidden rounded-r4 bg-[color:var(--line)] lg:grid-cols-3">
            {pricingPlans.map((plan, i) => (
              <Reveal
                as="div"
                type="rise"
                index={i}
                key={plan.name}
                className={`relative grid gap-s6 p-s7 ${plan.popular ? 'bg-ink-800' : 'bg-ink-900'}`}
                style={plan.popular ? { boxShadow: 'inset 0 2px 0 0 var(--color-signal)' } : undefined}
              >
                {plan.popular && (
                  <span className="absolute right-s6 top-s5 font-mono text-[length:var(--fs-micro)] font-bold uppercase tracking-[.14em] text-text-2">
                    EL MÁS SOLICITADO
                  </span>
                )}
                <div className="grid gap-s4">
                  <span className="grid size-11 place-items-center rounded-r2 border border-[color:var(--line-2)] text-text-2">
                    <Icon name={plan.icon} />
                  </span>
                  <h2 className="font-display text-[length:var(--fs-h4)] font-extrabold">{plan.name}</h2>
                  <div className="font-display text-[length:var(--fs-h2)] font-extrabold">
                    {plan.price}
                    {plan.period && <span className="ml-s2 text-[length:var(--fs-small)] font-normal text-text-3">{plan.period}</span>}
                  </div>
                  <p className="text-text-2">{plan.description}</p>
                </div>
                <ul className="grid gap-s3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-s2 text-[length:var(--fs-small)] text-text-2">
                      <Icon name="check" className="mt-1 shrink-0 text-text-2" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href={`${WA_BASE}${encodeURIComponent(plan.whatsappText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={
                    plan.ctaVariant === 'primary'
                      ? 'rounded-r2 bg-signal px-s5 py-s4 text-center font-mono text-[length:var(--fs-mono)] font-bold uppercase tracking-[var(--tr-mono)] text-signal-ink transition-all duration-300 hover:scale-105 active:scale-95'
                      : 'rounded-r2 border border-[color:var(--line-2)] px-s5 py-s4 text-center font-mono text-[length:var(--fs-mono)] font-bold uppercase tracking-[var(--tr-mono)] text-text transition-all duration-300 hover:bg-ink-800'
                  }
                >
                  {plan.cta}
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[color:var(--line)]">
        <div className="mx-auto max-w-(--maxw) px-(--gutter) py-[var(--section-y)]">
          <SplitHeading
            as="h2"
            className="font-display text-[length:var(--fs-h2)] font-extrabold tracking-[var(--tr-display)]"
            segments={[{ text: 'Preguntas' }, { text: 'Frecuentes', highlight: true }]}
          />
          <div className="mt-s8 grid gap-px overflow-hidden rounded-r3 bg-[color:var(--line)]">
            {faq.map((item, i) => (
              <Reveal as="div" type="rise" index={i} key={item.question} className="grid gap-s2 bg-ink-900 p-s6">
                <h3 className="font-display font-bold text-text">{item.question}</h3>
                <p className="text-text-2">{item.answer}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
