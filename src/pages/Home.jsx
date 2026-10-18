import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import HeroOrbit from '@/components/HeroOrbit';
import Reveal from '@/components/Reveal';
import SplitHeading, { Highlight } from '@/components/SplitHeading';
import Icon from '@/components/Icon';
import CodeWindow from '@/components/CodeWindow';
import Odometer from '@/components/Odometer';
import { ShinyButton } from '@/components/ui/shiny-button';
import { useAdvisor } from '@/components/AdvisorModal';
import { useProjectPreview } from '@/components/ProjectPreviewModal';
import { useMagnetic } from '@/hooks/useMagnetic';
import { useCursorTag } from '@/hooks/useCursorTag';
import { useSeo } from '@/hooks/useSeo';
import { breadcrumbs, website } from '@/seo/jsonld';
import { trackClick } from '@/lib/analytics';
import { services, pricingPlans, featuredWork } from '@/data/content';

const WA_BASE = 'https://wa.me/593983113942?text=';

// Linea de entrada del hero (punto lima + tagline). Aparece con el resto
// del bloque, no en scroll: es lo primero que se lee al abrir el sitio.
function AtomReveal({ children }) {
  return (
    <motion.span
      className="inline-flex items-center gap-s2 font-mono text-[length:var(--fs-mono)] uppercase tracking-[var(--tr-mono)] text-text-3"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.85, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.span>
  );
}

export default function Home() {
  useSeo({
    title: 'FS Orbit | Desarrollo Web en Cuenca, Ecuador',
    description:
      'Desarrollo web de alto rendimiento en Cuenca, Ecuador. Código a medida, sin plantillas: landing pages, e-commerce y software custom con SEO técnico y carga ultra-rápida.',
    path: '/',
    jsonLd: [website(), breadcrumbs([{ name: 'Inicio', path: '/' }])],
  });
  const advisor = useAdvisor();
  const preview = useProjectPreview();
  const primaryBtnRef = useRef(null);
  const storeBtnRef = useRef(null);
  const exploreBtnRef = useRef(null);
  useMagnetic(primaryBtnRef, 8);
  useMagnetic(storeBtnRef, 6);
  useMagnetic(exploreBtnRef, 10);

  return (
    <main id="main">
      {/* ---------------------------------------------------------------- HERO */}
      <section className="relative mx-auto max-w-(--maxw) overflow-clip px-(--gutter) pb-[clamp(72px,8vw,120px)] pt-[clamp(64px,9vw,128px)]">
        <HeroOrbit />

        <div className="relative grid gap-s5">
          <AtomReveal>
            <span className="size-1.5 rounded-full bg-[color:var(--line-2)]" />
            Impulsando negocios en la era digital
          </AtomReveal>

          <SplitHeading
            as="h1"
            className="max-w-[15ch] font-display text-[length:var(--fs-h1)] font-extrabold leading-[var(--lh-tight)] tracking-[var(--tr-display)]"
            segments={[{ text: 'Tu presencia online,' }, { break: true }, { text: 'diseñada con precisión.', highlight: true }]}
          />

          <Reveal as="p" type="rise" className="max-w-[46ch] text-[length:var(--fs-lead)] text-text-2">
            En FS Orbit creamos sitios web que no solo se ven bien, sino que venden. Convertimos tu visión en una
            experiencia digital única.
          </Reveal>

          <div className="mt-s2 flex flex-wrap gap-s4">
            <Reveal as="button" type="rise" index={0}
              ref={primaryBtnRef}
              onClick={advisor?.openModal}
              className="rounded-r2 bg-signal px-s6 py-s4 font-mono text-[length:var(--fs-mono)] font-bold uppercase tracking-[var(--tr-mono)] text-signal-ink transition-all duration-300 hover:scale-105 active:scale-95"
              style={{ boxShadow: 'none', transition: 'box-shadow 300ms ease-out, transform 300ms ease-out' }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 18px var(--signal-a08)'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
            >
              Empezar ahora
            </Reveal>
            <Reveal as="a" type="rise" index={1}
              href="#proyectos"
              className="rounded-r2 border border-[color:var(--line-2)] px-s6 py-s4 font-mono text-[length:var(--fs-mono)] font-bold uppercase tracking-[var(--tr-mono)] text-text transition-all duration-300 hover:border-[color:var(--line-2)] hover:bg-ink-800"
            >
              Ver trabajos
            </Reveal>
          </div>
        </div>

        <a href="#superioridad" className="mt-s9 hidden items-center gap-s3 text-text-3 md:flex" aria-hidden="true">
          <Icon name="arrow-down" />
          <span className="h-px w-16 bg-[color:var(--line-2)]" />
        </a>
      </section>

      {/* ------------------------------------------------------- ARQUITECTURA */}
      <section id="superioridad" className="border-t border-[color:var(--line)]">
        <div className="mx-auto grid max-w-(--maxw) gap-s9 px-(--gutter) py-[var(--section-y)] lg:grid-cols-2">
          <div className="grid gap-s5">
            <Reveal as="span" type="fade" className="font-mono text-[length:var(--fs-mono)] uppercase tracking-[var(--tr-mono)] text-text-3">
              Arquitectura Limpia
            </Reveal>
            <SplitHeading
              as="h2"
              className="font-display text-[length:var(--fs-h2)] font-extrabold leading-[var(--lh-tight)] tracking-[var(--tr-display)]"
              segments={[{ text: 'No usamos plantillas.' }, { break: true }, { text: 'Escribimos código.', highlight: true }]}
            />
            <Reveal as="p" type="rise" className="max-w-[52ch] text-text-2">
              A diferencia de las soluciones genéricas como WordPress o Wix, en <strong className="text-text">FS Orbit</strong> construimos
              desde el primer punto y coma. Esto significa que tu web no lleva "equipaje innecesario" (plugins lentos o
              código basura).
            </Reveal>

            <Reveal as="div" type="rise" className="mt-s4 grid gap-s5 sm:grid-cols-2">
              <div className="grid gap-s3 rounded-r3 border border-[color:var(--line)] p-s5">
                <h4 className="font-display font-bold text-text-2">WordPress / Builders</h4>
                <ul className="grid gap-s2 text-[length:var(--fs-small)] text-text-3">
                  {['Código inflado y lento', 'Dependencia de plugins', 'Vulnerabilidades constantes', 'Diseño limitado a bloques'].map((t) => (
                    <li key={t} className="flex items-center gap-s2">
                      <Icon name="alert" className="text-warn" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid gap-s3 rounded-r3 border border-[color:var(--line-2)] bg-ink-850 p-s5">
                <h4 className="font-display font-bold text-signal">FS Orbit Pure Code</h4>
                <ul className="grid gap-s2 text-[length:var(--fs-small)] text-text-2">
                  {['Carga instantánea (Core Web Vitals)', 'Seguridad de nivel militar', 'Escalabilidad ilimitada', 'Diseño 100% a medida'].map((t) => (
                    <li key={t} className="flex items-center gap-s2">
                      <Icon name="check" className="text-text-2" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          <Reveal as="div" type="scale" className="flex items-center">
            <CodeWindow />
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------------ SERVICIOS */}
      <section id="servicios" className="border-t border-[color:var(--line)]">
        <div className="mx-auto max-w-(--maxw) px-(--gutter) py-[var(--section-y)]">
          <div className="grid max-w-[46ch] gap-s3">
            <Reveal as="span" type="fade" className="font-mono text-[length:var(--fs-mono)] uppercase tracking-[var(--tr-mono)] text-text-3">
              Expertos en digitalización
            </Reveal>
            <SplitHeading
              as="h2"
              className="font-display text-[length:var(--fs-h2)] font-extrabold tracking-[var(--tr-display)]"
              segments={[{ text: 'Nuestras' }, { text: 'Soluciones', highlight: true }]}
            />
          </div>

          <div className="mt-s8 grid">
            {services.map((s, i) => (
              <Reveal
                as="article"
                type="rise"
                index={i}
                key={s.number}
                className="group grid grid-cols-[auto_auto_1fr] items-center gap-x-s6 gap-y-s4 border-b border-[color:var(--line)] px-s4 py-s6 -mx-s4 transition-colors duration-(--d3) hover:bg-ink-850 md:grid-cols-[58px_52px_1fr_280px]"
              >
                <span className="font-mono text-[length:var(--fs-h3)] text-text-3">
                  <Odometer value={s.number} />
                </span>
                <span className="grid size-13 place-items-center rounded-r2 border border-[color:var(--line-2)] text-signal shadow-[0_0_0_rgba(0,0,0,0)] transition-[box-shadow] duration-(--d3) group-hover:shadow-[0_0_12px_var(--signal-a08)]">
                  <Icon name={s.icon} className="text-xl" />
                </span>
                <div className="col-span-2 grid gap-s2 md:col-span-1">
                  <h3 className="font-display text-[length:var(--fs-h3)] font-extrabold">{s.title}</h3>
                  <p className="max-w-[56ch] text-text-2">{s.description}</p>
                </div>
                <ul className="col-span-3 flex flex-wrap gap-s2 md:col-span-1 md:justify-end">
                  {s.features.map((f) => (
                    <li key={f} className="rounded-r2 border border-[color:var(--line)] px-s3 py-1.5 font-mono text-[length:var(--fs-micro)] uppercase tracking-[var(--tr-mono)] text-text-3">
                      {f}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------- PRECIOS */}
      <section id="precios" className="border-t border-[color:var(--line)]">
        <div className="mx-auto max-w-(--maxw) px-(--gutter) py-[var(--section-y)]">
          <div className="grid max-w-[62ch] gap-s3">
            <Reveal as="span" type="fade" className="font-mono text-[length:var(--fs-mono)] uppercase tracking-[var(--tr-mono)] text-text-3">
              Niveles de Despliegue
            </Reveal>
            <SplitHeading
              as="h2"
              className="font-display text-[length:var(--fs-h2)] font-extrabold tracking-[var(--tr-display)]"
              segments={[{ text: 'Inversión en' }, { text: 'Ingeniería Web', highlight: true }]}
            />
            <Reveal as="p" type="rise" className="text-text-2">
              Desde sitios de alto impacto hasta ecosistemas digitales complejos.
            </Reveal>
          </div>

          <div className="mt-s8 grid gap-px overflow-hidden rounded-r4 bg-[color:var(--line)] lg:grid-cols-3">
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
                  <h3 className="font-display text-[length:var(--fs-h4)] font-extrabold">{plan.name}</h3>
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
                  onClick={() => trackClick('whatsapp', { source: 'home_pricing', plan: plan.name })}
                  ref={plan.popular ? storeBtnRef : undefined}
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

      {/* ----------------------------------------------------------- PORTAFOLIO */}
      <section id="proyectos" className="border-t border-[color:var(--line)]">
        <div className="mx-auto max-w-(--maxw) px-(--gutter) py-[var(--section-y)]">
          <SplitHeading
            as="h2"
            className="font-display text-[length:var(--fs-h2)] font-extrabold tracking-[var(--tr-display)]"
            segments={[{ text: 'Proyectos' }, { text: 'Recientes', highlight: true }]}
          />

          <div className="mt-s8 grid gap-s6 md:grid-cols-2">
            {featuredWork.map((work, i) => (
              <WorkCard key={work.title} work={work} index={i} onOpen={preview?.open} />
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ CTA */}
      <section className="border-t border-[color:var(--line)]">
        <Reveal
          as="div"
          type="rise"
          className="mx-auto flex max-w-(--maxw) flex-col items-start justify-between gap-s6 px-(--gutter) py-[var(--section-y)] md:flex-row md:items-center"
        >
          <div className="grid gap-s4">
            <h2 className="max-w-[20ch] font-display text-[length:var(--fs-h2)] font-extrabold leading-[var(--lh-tight)] tracking-[var(--tr-display)]">
              ¿Quieres ver más de nuestro <Highlight>Universo Digital?</Highlight>
            </h2>
            <p className="max-w-[54ch] text-[length:var(--fs-small)] text-text-2">
              Explora nuestra galería completa de soluciones personalizadas, desde sistemas internos hasta interfaces
              de alto impacto.
            </p>
          </div>
          <ShinyButton
            as={Link}
            ref={exploreBtnRef}
            to="/proyectos"
            viewTransition
            className="inline-flex shrink-0 items-center gap-s3 rounded-r2 border-transparent bg-signal px-s6 py-s4 font-mono text-[length:var(--fs-mono)] font-bold tracking-[var(--tr-mono)] uppercase"
            textClassName="flex items-center gap-s3 text-signal-ink"
          >
            Explorar Galería Completa
            <Icon name="arrow-right" />
          </ShinyButton>
        </Reveal>
      </section>
    </main>
  );
}

// Componente propio (en vez de renderizar el link inline dentro del
// .map de arriba) porque useCursorTag necesita su propio ref por
// tarjeta — un solo ref compartido entre varias instancias solo se
// queda enganchado a la ultima que se monta.
function WorkCard({ work, index, onOpen }) {
  const cursorRef = useCursorTag('Ver preview');

  return (
    <Reveal
      as="a"
      type="rise"
      index={index}
      ref={cursorRef}
      href={work.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        e.preventDefault();
        onOpen?.(work.url);
      }}
      className="group block overflow-hidden rounded-r4 border border-[color:var(--line)]"
    >
      <div className="aspect-video overflow-hidden">
        <picture>
          <source srcSet={`/assets/${work.img}.webp`} type="image/webp" />
          <img
            src={`/assets/${work.img}.png`}
            alt={work.alt}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-(--d4) group-hover:scale-105"
          />
        </picture>
      </div>
      <div className="flex items-center justify-between p-s5">
        <div>
          <h4 className="font-display font-bold">{work.title}</h4>
          <p className="text-[length:var(--fs-small)] text-text-3">{work.tag}</p>
        </div>
        <span className="inline-flex items-center gap-s2 text-[length:var(--fs-small)] text-text-2">
          Ver Preview
          <Icon name="arrow-ur" />
        </span>
      </div>
    </Reveal>
  );
}