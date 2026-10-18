import { useParams, Navigate, Link } from 'react-router-dom';
import Reveal from '@/components/Reveal';
import Icon from '@/components/Icon';
import { useSeo } from '@/hooks/useSeo';
import { breadcrumbs } from '@/seo/jsonld';
import { projects, caseStudies } from '@/data/content';

export default function ProyectoDetalle() {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);
  const study = project ? caseStudies[project.slug] : null;

  // Hook de SEO siempre se llama (reglas de hooks) — con datos vacios
  // si el slug no existe; el return de abajo redirige antes de pintar
  // nada con esos datos vacios.
  useSeo({
    title: project ? `${project.title} | Caso de Estudio — FS Orbit` : 'Proyecto no encontrado',
    description: project
      ? `Caso de estudio: ${project.title}. ${study.solution}`
      : 'Proyecto no encontrado.',
    path: `/proyectos/${slug}`,
    jsonLd: project
      ? breadcrumbs([
          { name: 'Inicio', path: '/' },
          { name: 'Proyectos', path: '/proyectos' },
          { name: project.title, path: `/proyectos/${slug}` },
        ])
      : undefined,
  });

  if (!project) return <Navigate to="/proyectos" replace />;

  return (
    <main id="main">
      <header className="mx-auto max-w-(--maxw) px-(--gutter) pb-[clamp(40px,5vw,64px)] pt-[clamp(72px,10vw,152px)]">
        <Link
          to="/proyectos"
          viewTransition
          className="mb-s6 inline-flex items-center gap-s2 font-mono text-[length:var(--fs-mono)] font-bold uppercase tracking-[var(--tr-mono)] text-text-2 transition-colors hover:text-signal"
        >
          <Icon name="arrow-left" />
          Volver a proyectos
        </Link>
        <span className="font-mono text-[length:var(--fs-mono)] tracking-[.12em] text-text-3">{project.code}</span>
        <h1 className="mt-s3 max-w-[20ch] font-display text-[length:var(--fs-h1)] font-extrabold leading-[var(--lh-tight)] tracking-[var(--tr-display)]">
          {project.title}
        </h1>
        <ul className="mt-s5 flex flex-wrap gap-s2">
          {project.tags.map((tag) => (
            <li key={tag} className="rounded-r2 border border-[color:var(--line)] px-s3 py-1.5 font-mono text-[length:var(--fs-micro)] tracking-[.1em] text-text-3">
              {tag}
            </li>
          ))}
        </ul>
      </header>

      <section className="mx-auto max-w-(--maxw) px-(--gutter)">
        <Reveal as="div" type="scale" className="aspect-[16/9] overflow-hidden rounded-r3 border border-[color:var(--line)]">
          <picture>
            <source srcSet={`/assets/${project.img}.webp`} type="image/webp" />
            <img
              src={`/assets/${project.img}.png`}
              alt={project.alt}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </picture>
        </Reveal>
      </section>

      <section className="border-t border-[color:var(--line)]">
        <div className="mx-auto grid max-w-(--maxw) gap-s8 px-(--gutter) py-[var(--section-y)] md:grid-cols-3">
          <Reveal as="div" type="rise" className="grid gap-s3">
            <h2 className="font-mono text-[length:var(--fs-mono)] uppercase tracking-[var(--tr-mono)] text-text-3">Problema</h2>
            <p className="text-text-2">{study.problem}</p>
          </Reveal>
          <Reveal as="div" type="rise" index={1} className="grid gap-s3">
            <h2 className="font-mono text-[length:var(--fs-mono)] uppercase tracking-[var(--tr-mono)] text-signal">Solución</h2>
            <p className="text-text-2">{study.solution}</p>
          </Reveal>
          <Reveal as="div" type="rise" index={2} className="grid gap-s3">
            <h2 className="font-mono text-[length:var(--fs-mono)] uppercase tracking-[var(--tr-mono)] text-text-3">Resultado</h2>
            <p className="text-text-2">{study.result}</p>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-[color:var(--line)]">
        <Reveal
          as="div"
          type="rise"
          className="mx-auto flex max-w-(--maxw) flex-col items-start justify-between gap-s6 px-(--gutter) py-[var(--section-y)] md:flex-row md:items-center"
        >
          <h2 className="max-w-[24ch] font-display text-[length:var(--fs-h3)] font-extrabold leading-[var(--lh-tight)]">
            ¿Quieres un proyecto así?
          </h2>
          <div className="flex flex-wrap gap-s4">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-s3 rounded-r2 border border-[color:var(--line-2)] px-s6 py-s4 font-mono text-[length:var(--fs-mono)] font-bold uppercase tracking-[var(--tr-mono)] text-text transition-all hover:border-signal hover:text-signal"
            >
              Ver sitio en vivo
              <Icon name="arrow-ur" />
            </a>
            <a
              href={`https://wa.me/593983113942?text=${encodeURIComponent(`Vi el proyecto ${project.title} y quiero algo similar`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-s3 rounded-r2 bg-signal px-s6 py-s4 font-mono text-[length:var(--fs-mono)] font-bold uppercase tracking-[var(--tr-mono)] text-signal-ink"
            >
              Cotizar por WhatsApp
              <Icon name="arrow-right" />
            </a>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
