import { Link } from 'react-router-dom';
import Reveal from '@/components/Reveal';
import SplitHeading from '@/components/SplitHeading';
import Icon from '@/components/Icon';
import Breadcrumbs from '@/components/Breadcrumbs';
import { usePageSeo } from '@/hooks/usePageSeo';
import { serviceNode, faqNode } from '@/seo/jsonld';
import { renderInline } from '@/lib/inlineLinks';
import { trackClick } from '@/lib/analytics';
import { projects } from '@/data/content';

const WA_BASE = 'https://wa.me/593983113942?text=';

// Plantilla compartida por las 5 landings de /servicios/*. Cada servicio
// es un objeto de src/data/servicePages.js: la estructura visual es la
// misma para que las cinco se sientan parte del mismo sitio.
export default function ServicePage({ service }) {
  const { path, breadcrumbLabel, kicker, h1Segments, intro, highlights, sections, faq, ctaWhatsappText, planName, serviceName, seoDescription } = service;

  const crumbs = [
    { name: 'Inicio', path: '/' },
    { name: breadcrumbLabel, path },
  ];

  usePageSeo({
    path,
    crumbs,
    nodes: [serviceNode({ path, name: serviceName, description: seoDescription, planName }), faqNode(path, faq)],
  });

  const related = service.projects.map((slug) => projects.find((p) => p.slug === slug)).filter(Boolean);

  return (
    <main id="main">
      <header className="mx-auto max-w-(--maxw) px-(--gutter) pb-[clamp(56px,7vw,96px)] pt-[clamp(72px,10vw,152px)]">
        <Breadcrumbs crumbs={crumbs} />
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
              <Reveal as="article" type="rise" index={i} key={h.title} className="group grid gap-s3">
                <span className="grid size-13 place-items-center rounded-r2 border border-[color:var(--line-2)] text-signal shadow-[0_0_0_rgba(0,0,0,0)] transition-[box-shadow] duration-(--d3) group-hover:shadow-[0_0_12px_var(--signal-a08)]">
                  <Icon name={h.icon} className="text-xl" />
                </span>
                <h2 className="font-display text-[length:var(--fs-h3)] font-extrabold">{h.title}</h2>
                <p className="max-w-[52ch] text-text-2">{h.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {sections.map((s) => (
        <section key={s.h2} className="border-t border-[color:var(--line)]">
          <div className="mx-auto grid max-w-(--maxw) gap-s6 px-(--gutter) py-[var(--section-y)] lg:grid-cols-[1fr_1.4fr] lg:gap-s9">
            <h2 className="max-w-[22ch] font-display text-[length:var(--fs-h3)] font-extrabold leading-[var(--lh-tight)]">{s.h2}</h2>
            <div className="grid gap-s4">
              {s.paragraphs.map((p) => (
                <Reveal as="p" type="rise" key={p.slice(0, 40)} className="max-w-[62ch] text-text-2">
                  {renderInline(p)}
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ))}

      {related.length > 0 && (
        <section className="border-t border-[color:var(--line)]">
          <div className="mx-auto max-w-(--maxw) px-(--gutter) py-[var(--section-y)]">
            <h2 className="font-display text-[length:var(--fs-h3)] font-extrabold">Casos relacionados</h2>
            <ul className="mt-s6 grid gap-s4 md:grid-cols-2">
              {related.map((p) => (
                <li key={p.slug}>
                  <Link
                    to={`/proyectos/${p.slug}`}
                    viewTransition
                    className="group flex items-center justify-between gap-s4 rounded-r3 border border-[color:var(--line)] px-s5 py-s5 transition-colors hover:border-[color:var(--line-2)]"
                  >
                    <span className="grid gap-1">
                      <span className="font-display font-bold text-text">{p.title}</span>
                      <span className="text-[length:var(--fs-small)] text-text-3">{p.description}</span>
                    </span>
                    <Icon name="arrow-right" className="shrink-0 transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-s5 text-text-2">
              {renderInline('Mira todos los casos en el [portafolio](/proyectos) o revisa qué incluye cada plan en [precios](/precios).')}
            </p>
          </div>
        </section>
      )}

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
