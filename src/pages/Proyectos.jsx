import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Reveal from '@/components/Reveal';
import SplitHeading from '@/components/SplitHeading';
import Icon from '@/components/Icon';
import { useParallax } from '@/hooks/useParallax';
import { useProjectPreview } from '@/components/ProjectPreviewModal';
import { useSeo } from '@/hooks/useSeo';
import { breadcrumbs, projectList } from '@/seo/jsonld';
import { projects } from '@/data/content';

const EASE_OUT = [0.22, 1, 0.36, 1];

export default function Proyectos() {
  useSeo({
    title: 'Proyectos | FS Orbit — Desarrollo Web en Cuenca, Ecuador',
    description:
      'Portafolio de FS Orbit: landing pages, e-commerce y aplicaciones web desarrolladas a medida desde Cuenca, Ecuador. Casos reales con arquitectura escalable y rendimiento optimizado.',
    path: '/proyectos',
    jsonLd: [
      breadcrumbs([
        { name: 'Inicio', path: '/' },
        { name: 'Proyectos', path: '/proyectos' },
      ]),
      projectList(projects.map((p) => ({ title: p.title, description: p.description, path: `/proyectos/${p.slug}`, img: p.img }))),
    ],
  });
  const preview = useProjectPreview();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main id="main">
      <header className="mx-auto max-w-(--maxw) px-(--gutter) pb-[clamp(56px,7vw,104px)] pt-[clamp(72px,11vw,168px)]">
        <Reveal
          as="span"
          type="fade"
          className="mb-s5 inline-flex items-center font-mono text-[length:var(--fs-mono)] tracking-[.1em] text-text-3 after:ml-1.5 after:h-[1.05em] after:w-[7px] after:animate-[caret_1.05s_steps(2)_infinite] after:bg-text-3"
        >
          &gt; fs_orbit --fetch-projects --active
        </Reveal>
        <SplitHeading
          as="h1"
          className="max-w-[16ch] font-display text-[length:var(--fs-h1)] font-extrabold leading-[var(--lh-tight)] tracking-[var(--tr-display)]"
          segments={[{ text: 'Ingeniería de' }, { text: 'Alto Rendimiento', highlight: true }]}
        />
      </header>

      <section className="mx-auto max-w-(--maxw) px-(--gutter)">
        {projects.map((project, i) => (
          <ProjectBlock key={project.title} project={project} even={i % 2 === 1} onOpen={preview?.open} />
        ))}
      </section>
    </main>
  );
}

function ProjectBlock({ project, even, onOpen }) {
  const parallaxRef = useParallax();

  const visual = (
    <div
      ref={parallaxRef}
      className="group relative aspect-[16/9.6] overflow-hidden rounded-r3 border border-[color:var(--line)] bg-ink-850"
    >
      <picture>
        <source srcSet={`/assets/${project.img}.webp`} type="image/webp" />
        <img
          src={`/assets/${project.img}.png`}
          alt={project.alt}
          loading="lazy"
          decoding="async"
          className="h-[106%] w-full object-cover object-top saturate-[.7] contrast-[1.03] brightness-[.94] transition-[transform,filter] duration-1000 group-hover:scale-[1.04] group-hover:saturate-100 group-hover:contrast-100 group-hover:brightness-100"
          style={{ translate: '0 var(--shift, 0px)' }}
        />
      </picture>
    </div>
  );

  const content = (
    <div className="grid items-start gap-s4 justify-items-start">
      <span className="font-mono text-[length:var(--fs-mono)] tracking-[.12em] text-text-3">{project.code}</span>
      <h2 className="font-display text-[length:var(--fs-h2)] leading-[1.02] font-extrabold">{project.title}</h2>
      <p className="max-w-[44ch] text-[length:var(--fs-small)] text-text-2">{project.description}</p>
      <ul className="mt-s1 flex flex-wrap gap-s2">
        {project.tags.map((tag) => (
          <li
            key={tag}
            className="rounded-r2 border border-[color:var(--line)] px-s3 py-1.5 font-mono text-[length:var(--fs-micro)] tracking-[.1em] text-text-3"
          >
            {tag}
          </li>
        ))}
      </ul>
      <motion.div
        className="mt-s3 inline-block"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.3, ease: EASE_OUT }}
      >
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            e.preventDefault();
            onOpen?.(project.url);
          }}
          className="inline-flex items-center gap-s2 rounded-r2 bg-signal px-s5 py-s4 font-mono text-[length:var(--fs-mono)] font-bold uppercase tracking-[var(--tr-mono)] text-signal-ink"
          style={{ display: 'inline-flex', boxShadow: 'none', transition: 'box-shadow 300ms ease-out' }}
          onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 14px var(--signal-a08)'}
          onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
        >
          Ejecutar Proyecto
          <Icon name="arrow-ur" />
        </a>
      </motion.div>
    </div>
  );

  return (
    <Reveal
      as="article"
      type="rise"
      className="grid items-center gap-[clamp(32px,5vw,80px)] border-b border-[color:var(--line)] py-[clamp(56px,7vw,104px)] lg:grid-cols-[1.35fr_1fr]"
      style={even ? { gridTemplateColumns: '1fr 1.35fr' } : undefined}
    >
      {even ? (
        <>
          <div className="order-2 lg:order-2">{visual}</div>
          <div className="order-1 lg:order-1">{content}</div>
        </>
      ) : (
        <>
          {visual}
          {content}
        </>
      )}
    </Reveal>
  );
}
