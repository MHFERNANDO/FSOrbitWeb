import { useParams, Navigate, Link } from 'react-router-dom';
import Reveal from '@/components/Reveal';
import ProjectImage from '@/components/ProjectImage';
import Icon from '@/components/Icon';
import Breadcrumbs from '@/components/Breadcrumbs';
import { usePageSeo } from '@/hooks/usePageSeo';
import { projectNode } from '@/seo/jsonld';
import { renderInline } from '@/lib/inlineLinks';
import { trackClick } from '@/lib/analytics';
import { projects } from '@/data/content';
import { projectDetails } from '@/data/projectDetails';

export default function ProyectoDetalle() {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);

  const details = project ? projectDetails[project.slug] : null;
  const path = `/proyectos/${slug}`;
  const crumbs = project
    ? [
        { name: 'Inicio', path: '/' },
        { name: 'Proyectos', path: '/proyectos' },
        { name: project.title, path },
      ]
    : [];

  // Hook de SEO siempre se llama (reglas de hooks); con slug invalido
  // el return de abajo redirige antes de pintar nada.
  usePageSeo({
    path: project ? path : '/proyectos',
    crumbs,
    image: project ? `https://fsorbit.com/assets/${project.img}-1440.webp` : undefined,
    nodes: project
      ? [projectNode({ path, name: `${project.title}: sitio web en Cuenca`, description: project.description, img: project.img, siteUrl: project.url })]
      : [],
  });

  if (!project || !details) return <Navigate to="/proyectos" replace />;

  return (
    <main id="main">
      <header className="mx-auto max-w-(--maxw) px-(--gutter) pb-[clamp(40px,5vw,64px)] pt-[clamp(72px,10vw,152px)]">
        <Breadcrumbs crumbs={crumbs} />
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
          <ProjectImage project={project} sizes="(min-width: 1480px) 1400px, 100vw" priority className="h-full w-full object-cover" />
        </Reveal>
      </section>

      <section className="border-t border-[color:var(--line)]">
        <div className="mx-auto max-w-(--maxw) px-(--gutter) py-[var(--section-y)]">
          <Reveal as="p" type="rise" className="max-w-[64ch] text-[length:var(--fs-lead)] text-text-2">
            {project.description}
          </Reveal>
          <p className="mt-s5 max-w-[64ch] text-text-3">{`${details.sector}.`}</p>
        </div>
      </section>

      {[
        { h2: 'El reto', body: details.reto },
        { h2: 'La solución', body: details.solucion },
        { h2: 'Tecnologías', list: details.tecnologias },
        { h2: 'Resultado', body: details.resultado },
      ].map((block) => (
        <section key={block.h2} className="border-t border-[color:var(--line)]">
          <div className="mx-auto grid max-w-(--maxw) gap-s6 px-(--gutter) py-[var(--section-y)] lg:grid-cols-[1fr_1.4fr] lg:gap-s9">
            <h2 className="font-display text-[length:var(--fs-h3)] font-extrabold leading-[var(--lh-tight)]">{block.h2}</h2>
            {block.list ? (
              <ul className="grid max-w-[62ch] gap-s3 text-text-2">
                {block.list.map((item) => (
                  <li key={item} className="flex items-start gap-s2">
                    <Icon name="check" className="mt-1 shrink-0 text-text-2" />
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="grid gap-s4">
                {block.body.map((p) => (
                  <Reveal as="p" type="rise" key={p.slice(0, 40)} className="max-w-[62ch] text-text-2">
                    {p}
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </section>
      ))}

      <section className="border-t border-[color:var(--line)]">
        <div className="mx-auto max-w-(--maxw) px-(--gutter) py-s8">
          <h2 className="font-display text-[length:var(--fs-h3)] font-extrabold">Sigue explorando</h2>
          <p className="mt-s4 max-w-[62ch] text-text-2">
            {renderInline(`Este caso corresponde a nuestro servicio de [${details.serviceLabel}](${details.servicePath}). Revisa qué incluye cada plan en [precios](/precios) o visita el sitio real de `)}
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text underline decoration-[color:var(--line-2)] underline-offset-4 transition-colors hover:text-signal"
            >
              {project.title}
            </a>
            .
          </p>
        </div>
      </section>

      <section className="border-t border-[color:var(--line)]">
        <div className="mx-auto max-w-(--maxw) px-(--gutter) py-s8">
          <h2 className="font-mono text-[length:var(--fs-mono)] uppercase tracking-[var(--tr-mono)] text-text-3">Otros proyectos</h2>
          <ul className="mt-s5 grid gap-s3 sm:grid-cols-3">
            {projects
              .filter((p) => p.slug !== project.slug)
              .map((p) => (
                <li key={p.slug}>
                  <Link
                    to={`/proyectos/${p.slug}`}
                    viewTransition
                    className="group flex items-center justify-between gap-s3 rounded-r3 border border-[color:var(--line)] px-s5 py-s4 transition-colors hover:border-[color:var(--line-2)] hover:text-text"
                  >
                    {p.title}
                    <Icon name="arrow-right" className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
          </ul>
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
              className="inline-flex items-center gap-s3 rounded-r2 border border-[color:var(--line-2)] px-s6 py-s4 font-mono text-[length:var(--fs-mono)] font-bold uppercase tracking-[var(--tr-mono)] text-text transition-all hover:bg-ink-800"
            >
              Ver sitio en vivo
              <Icon name="arrow-ur" />
            </a>
            <a
              href={`https://wa.me/593983113942?text=${encodeURIComponent(`Vi el proyecto ${project.title} y quiero algo similar`)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackClick('whatsapp', { source: 'proyecto_detalle', project: project.slug })}
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
