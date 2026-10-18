import { Link } from 'react-router-dom';
import Reveal from '@/components/Reveal';
import SplitHeading from '@/components/SplitHeading';
import Icon from '@/components/Icon';
import { useSeo } from '@/hooks/useSeo';
import { breadcrumbs, service, faqPage } from '@/seo/jsonld';
import { trackClick } from '@/lib/analytics';

const WA_BASE = 'https://wa.me/593983113942?text=';

// Plantilla compartida por las 3 landings de /servicios/*. Cada pagina
// solo aporta datos (titulo, intro, highlights reales de content.js,
// FAQ verdadero) — la estructura visual es la misma para que las tres
// se sientan parte del mismo sitio en vez de paginas sueltas.
export default function ServicePage({
  path,
  seoTitle,
  seoDescription,
  kicker,
  h1Segments,
  intro,
  highlights,
  faq,
  ctaWhatsappText,
  breadcrumbLabel,
}) {
  useSeo({
    title: seoTitle,
    description: seoDescription,
    path,
    jsonLd: [
      breadcrumbs([
        { name: 'Inicio', path: '/' },
        { name: breadcrumbLabel, path },
      ]),
      service({ name: breadcrumbLabel, description: seoDescription, path }),
      ...(faq?.length ? [faqPage(faq)] : []),
    ],
  });

  return (
    <main id="main">
      <header className="mx-auto max-w-(--maxw) px-(--gutter) pb-[clamp(56px,7vw,96px)] pt-[clamp(72px,10vw,152px)]">
        <Reveal as="span" type="fade" className="mb-s5 inline-block font-mono text-[length:var(--fs-mono)] uppercase tracking-[var(--tr-mono)] text-text-3">
          {kicker}
        </Reveal>
        <SplitHeading
          as="h1"
          className="max-w-[18ch] font-display text-[length:var(--fs-h1)] font-extrabold leading-[var(--lh-tight)] tracking-[var(--tr-display)]"
          segments={h1Segments}
        />
        <Reveal as="p" type="rise" className="mt-s5 max-w-[56ch] text-[length:var(--fs-lead)] text-text-2">
          {intro}
        </Reveal>
        <Reveal as="div" type="rise" index={1} className="mt-s6 flex flex-wrap gap-s4">
          <a
            href={`${WA_BASE}${encodeURIComponent(ctaWhatsappText)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackClick('whatsapp', { source: 'service_page', path })}
            className="rounded-r2 bg-signal px-s6 py-s4 font-mono text-[length:var(--fs-mono)] font-bold uppercase tracking-[var(--tr-mono)] text-signal-ink transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Cotiza por WhatsApp
          </a>
          <Link
            to="/precios"
            viewTransition
            className="rounded-r2 border border-[color:var(--line-2)] px-s6 py-s4 font-mono text-[length:var(--fs-mono)] font-bold uppercase tracking-[var(--tr-mono)] text-text transition-all duration-300 hover:bg-ink-800"
          >
            Ver precios
          </Link>
        </Reveal>
      </header>

      <section className="border-t border-[color:var(--line)]">
        <div className="mx-auto max-w-(--maxw) px-(--gutter) py-[var(--section-y)]">
          <div className="grid gap-s7 md:grid-cols-2">
            {highlights.map((h, i) => (
              <Reveal as="article" type="rise" index={i} key={h.title} className="grid gap-s3">
                <span className="grid size-13 place-items-center rounded-r2 border border-[color:var(--line-2)] text-signal">
                  <Icon name={h.icon} className="text-xl" />
                </span>
                <h2 className="font-display text-[length:var(--fs-h3)] font-extrabold">{h.title}</h2>
                <p className="max-w-[52ch] text-text-2">{h.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {faq?.length > 0 && (
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
      )}

      <section className="border-t border-[color:var(--line)]">
        <Reveal
          as="div"
          type="rise"
          className="mx-auto flex max-w-(--maxw) flex-col items-start justify-between gap-s6 px-(--gutter) py-[var(--section-y)] md:flex-row md:items-center"
        >
          <h2 className="max-w-[24ch] font-display text-[length:var(--fs-h3)] font-extrabold leading-[var(--lh-tight)]">
            ¿Hablamos de tu proyecto?
          </h2>
          <a
            href={`${WA_BASE}${encodeURIComponent(ctaWhatsappText)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackClick('whatsapp', { source: 'service_page_footer_cta', path })}
            className="inline-flex shrink-0 items-center gap-s3 rounded-r2 bg-signal px-s6 py-s4 font-mono text-[length:var(--fs-mono)] font-bold uppercase tracking-[var(--tr-mono)] text-signal-ink"
          >
            Escríbenos ahora
            <Icon name="arrow-right" />
          </a>
        </Reveal>
      </section>
    </main>
  );
}
