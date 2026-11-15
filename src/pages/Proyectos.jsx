import { Link } from 'react-router-dom';
import PageHead from '@/components/PageHead';
import Shot from '@/components/Shot';
import Closing from '@/components/Closing';
import { usePageSeo } from '@/hooks/usePageSeo';
import { projectListNode } from '@/seo/jsonld';
import { projects, publishedProjects } from '@/data/content';

const CRUMBS = [
  { name: 'Inicio', path: '/' },
  { name: 'Casos', path: '/proyectos' },
];

export default function Proyectos() {
  usePageSeo({ path: '/proyectos', crumbs: CRUMBS, type: 'CollectionPage', nodes: [projectListNode('/proyectos', publishedProjects)] });

  return (
    <main id="main">
      <PageHead
        crumbs={CRUMBS}
        lines={['Casos: sitios web', 'hechos en Cuenca']}
        lead="Cada caso cuenta qué necesitaba el negocio y qué construimos. Los sitios publicados se pueden visitar. No mostramos cifras de tráfico ni de ventas que no tengamos."
      />

      <section className="wrap section--tight" aria-label="Casos">
        {projects.length === 0 ? (
          <div className="state">
            <h2 className="h3">Todavía no hay casos publicados</h2>
            <p>Estamos preparando los primeros. Mientras tanto, escríbenos y te mostramos trabajos por WhatsApp.</p>
          </div>
        ) : (
          <div className="case-list">
            {projects.map((p, i) => (
              <article className="case-item" key={p.slug}>
                <div className="case-media">
                  <Shot project={p} sizes="(min-width: 900px) 58vw, 100vw" eager={i === 0} />
                </div>
                <div>
                  <p className="small muted">{p.tag}</p>
                  <h2 className="h2">{p.title}</h2>
                  <p>{p.description}</p>
                  <div className="actions">
                    <Link className="link" to={`/proyectos/${p.slug}`}>
                      {p.pending ? `Ver el estado del caso de ${p.title}` : `Ver el caso de ${p.title}`}
                    </Link>
                    {p.url && (
                      <a className="link" href={p.url} target="_blank" rel="noopener noreferrer">
                        Abrir {new URL(p.url).hostname.replace(/^www\./, '')}
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <Closing source="proyectos" title="¿Tu negocio es el siguiente caso?" waText="Hola, vi los casos de FS Orbit y quiero cotizar mi página web" />
    </main>
  );
}
