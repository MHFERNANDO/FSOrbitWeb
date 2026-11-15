import { Link, useParams } from 'react-router-dom';
import PageHead from '@/components/PageHead';
import Shot from '@/components/Shot';
import Closing from '@/components/Closing';
import NotFound from './NotFound';
import { usePageSeo } from '@/hooks/usePageSeo';
import { projectNode } from '@/seo/jsonld';
import { renderInline } from '@/lib/inlineLinks';
import { getProject, publishedProjects } from '@/data/content';
import { projectDetails } from '@/data/projectDetails';

const BLOCKS = [
  ['reto', 'El reto'],
  ['solucion', 'Qué construimos'],
  ['tecnologias', 'Con qué está hecho'],
  ['resultado', 'Qué se puede comprobar hoy'],
];

export default function ProyectoDetalle() {
  const { slug } = useParams();
  const project = getProject(slug);
  const detail = projectDetails[slug];
  const path = `/proyectos/${slug}`;
  const crumbs = [
    { name: 'Inicio', path: '/' },
    { name: 'Casos', path: '/proyectos' },
    { name: project?.title ?? 'Caso', path },
  ];

  usePageSeo({
    path,
    crumbs,
    image: project?.img ? `https://fsorbit.com/assets/${project.img}-1440.webp` : undefined,
    nodes:
      project && !project.pending
        ? [projectNode({ path, name: `${project.title}: sitio web en Cuenca`, description: project.description, img: project.img, siteUrl: project.url })]
        : [],
  });

  if (!project) return <NotFound />;

  // Caso sin material publicable: se dice tal cual, sin relleno.
  if (project.pending || !detail) {
    return (
      <main id="main">
        <PageHead crumbs={crumbs} lines={[project.title]} lead={project.description} />
        <section className="wrap section--tight">
          <div className="split">
            <Shot project={project} />
            <div className="prose">
              <p>
                Todavía no publicamos este caso. Preferimos esperar a tener las capturas y el texto aprobados por el cliente antes que
                llenar la página con relleno.
              </p>
              <p>
                Si te interesa un proyecto parecido para tu inmobiliaria, escríbenos y te contamos por WhatsApp cómo lo trabajamos.
                Mientras tanto puedes revisar los{' '}
                <Link className="link" to="/proyectos">
                  casos publicados
                </Link>
                .
              </p>
            </div>
          </div>
        </section>
        <Closing source={`caso_${slug}`} waText={`Hola, quiero saber más sobre el trabajo para ${project.title}`} />
      </main>
    );
  }

  const others = publishedProjects.filter((p) => p.slug !== slug);
  const host = new URL(project.url).hostname.replace(/^www\./, '');

  return (
    <main id="main">
      <PageHead crumbs={crumbs} lines={[project.title]} lead={project.description}>
        <div className="actions">
          <a className="btn btn--ghost" href={project.url} target="_blank" rel="noopener noreferrer">
            Abrir {host}
          </a>
        </div>
      </PageHead>

      <section className="wrap">
        <Shot project={project} sizes="(min-width: 1320px) 1180px, 92vw" eager />
      </section>

      <section className="wrap section">
        <div className="split">
          <dl className="facts sticky">
            <div>
              <dt>Cliente</dt>
              <dd>{detail.sector}</dd>
            </div>
            <div>
              <dt>Servicio</dt>
              <dd>
                <Link className="link" to={detail.servicePath}>
                  {detail.serviceLabel}
                </Link>
              </dd>
            </div>
            <div>
              <dt>Sitio publicado</dt>
              <dd>
                <a className="link" href={project.url} target="_blank" rel="noopener noreferrer">
                  {host}
                </a>
              </dd>
            </div>
          </dl>
          <div className="stack">
            {BLOCKS.map(([key, title]) => (
              <div key={key}>
                <h2 className="h3" style={{ marginBottom: 16 }}>
                  {title}
                </h2>
                {key === 'tecnologias' || key === 'resultado' ? (
                  <ul className="ticks" style={{ maxWidth: '66ch', fontSize: 'inherit' }}>
                    {detail[key].map((t) => (
                      <li key={t.slice(0, 40)}>{renderInline(t)}</li>
                    ))}
                  </ul>
                ) : (
                  <div className="prose">
                    {detail[key].map((t) => (
                      <p key={t.slice(0, 40)}>{renderInline(t)}</p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rule">
        <div className="wrap section--tight">
          <h2 className="h3" style={{ marginBottom: 24 }}>
            Otros casos
          </h2>
          <div className="rows">
            {others.map((p) => (
              <Link className="row row--2" to={`/proyectos/${p.slug}`} key={p.slug}>
                <h3 className="h3 row-title">{p.title}</h3>
                <p>{p.tag}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Closing source={`caso_${slug}`} waText={`Hola, vi el caso de ${project.title} y quiero algo así para mi negocio`} />
    </main>
  );
}
