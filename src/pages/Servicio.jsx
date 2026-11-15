import { Link, useParams } from 'react-router-dom';
import PageHead from '@/components/PageHead';
import WaButton from '@/components/WaButton';
import Faq from '@/components/Faq';
import Shot from '@/components/Shot';
import Closing from '@/components/Closing';
import NotFound from './NotFound';
import { usePageSeo } from '@/hooks/usePageSeo';
import { serviceNode, faqNode } from '@/seo/jsonld';
import { renderInline } from '@/lib/inlineLinks';
import { getProject, pricingPlans } from '@/data/content';
import { getServicePage } from '@/data/servicePages';
import { getServiceContent } from '@/data/serviceContent';

// Las lineas del H1 salen de h1Segments (se parte en cada { break: true }).
function h1Lines(segments) {
  const lines = [''];
  segments.forEach((s) => {
    if (s.break) lines.push('');
    else lines[lines.length - 1] = `${lines[lines.length - 1]} ${s.text}`.trim();
  });
  return lines;
}

// Contenido propio de la pagina local de Cuenca: solo hechos que constan
// en los sitios publicados de cada cliente.
function CuencaLocal() {
  return (
    <section className="rule">
      <div className="wrap section split">
        <h2 className="h2 sticky">Trabajo hecho en Cuenca</h2>
        <div className="stack-sm prose">
          <p>
            FS Orbit tiene su base en Cuenca, Azuay. Los sitios que hemos publicado son de negocios de la ciudad, y cada uno se puede
            visitar.
          </p>
          <dl className="facts">
            <div>
              <dt>El Batán</dt>
              <dd>
                <Link className="link" to="/proyectos/acculab-system">
                  Accu-Lab
                </Link>
                , laboratorio clínico en Consultorios El Batán: exámenes con precios referenciales y agenda por WhatsApp.
              </dd>
            </div>
            <div>
              <dt>Calle Vieja y Mercedes Quinde</dt>
              <dd>
                <Link className="link" to="/proyectos/laboratorio-diesel-mg">
                  Laboratorio Diesel MG
                </Link>
                , taller de inyección diésel para camiones, buses y furgones.
              </dd>
            </div>
            <div>
              <dt>Cuenca, estudio creativo</dt>
              <dd>
                <Link className="link" to="/proyectos/gravity-studio">
                  Gravity Estudio Creativo
                </Link>
                , marketing y producción audiovisual.
              </dd>
            </div>
            <div>
              <dt>Entregas en Cuenca</dt>
              <dd>
                <Link className="link" to="/proyectos/jf-vapes-store">
                  JF Vapes Store
                </Link>
                , tienda online con pedidos por WhatsApp.
              </dd>
            </div>
          </dl>
          <p>
            No atendemos en una oficina abierta al público. Coordinamos por WhatsApp y trabajamos de forma remota, así que también
            tomamos proyectos de otras ciudades de Ecuador.
          </p>
        </div>
      </div>
    </section>
  );
}

export default function Servicio() {
  const { slug } = useParams();
  const page = getServicePage(slug);
  const content = getServiceContent(slug);
  const path = `/servicios/${slug}`;
  const crumbs = [
    { name: 'Inicio', path: '/' },
    { name: 'Servicios', path: '/servicios' },
    { name: page?.breadcrumbLabel ?? 'Servicio', path },
  ];

  usePageSeo({
    path,
    crumbs,
    nodes: page
      ? [serviceNode({ path, name: page.serviceName, description: page.seoDescription, planName: page.planName }), faqNode(path, content.faq)]
      : [],
  });

  if (!page || !content) return <NotFound />;

  const plan = page.planName ? pricingPlans.find((p) => p.name === page.planName) : null;
  const related = content.projects.map(getProject).filter(Boolean);

  return (
    <main id="main">
      <PageHead crumbs={crumbs} lines={h1Lines(content.h1Segments)} lead={content.intro}>
        <div className="actions" data-dock-hide>
          <WaButton text={content.ctaWhatsappText} source={`servicio_${slug}`} />
          <Link className="link" to="/precios">
            {plan ? `${plan.name}: ${plan.priceLabel.toLowerCase()}` : 'Ver planes y precios'}
          </Link>
        </div>
      </PageHead>

      <section className="rule">
        <div className="wrap section--tight">
          <div className="rows" style={{ borderTop: 0 }}>
            {content.highlights.map((h) => (
              <div className="row row--2" key={h.title}>
                <h2 className="h3">{h.title}</h2>
                <p>{h.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap section">
        <div className="stack">
          {content.sections.map((s) => (
            <div className="split" key={s.h2}>
              <h2 className="h3">{s.h2}</h2>
              <div className="prose">
                {s.paragraphs.map((p) => (
                  <p key={p.slice(0, 40)}>{renderInline(p)}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {slug === 'diseno-web-cuenca' && <CuencaLocal />}

      {related.length > 0 && (
        <section className="rule">
          <div className="wrap section">
            <h2 className="h2">Casos relacionados</h2>
            <div className="case-list" style={{ marginTop: 'clamp(32px, 5vw, 64px)' }}>
              {related.map((p) => (
                <article className="case-item" key={p.slug}>
                  <div className="case-media">
                    <Shot project={p} sizes="(min-width: 900px) 58vw, 100vw" />
                  </div>
                  <div>
                    <p className="small muted">{p.tag}</p>
                    <h3 className="h2">{p.title}</h3>
                    <p>{p.description}</p>
                    <div className="actions">
                      <Link className="link" to={`/proyectos/${p.slug}`}>
                        Ver el caso de {p.title}
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="rule">
        <div className="wrap section split">
          <h2 className="h2 sticky">Preguntas frecuentes</h2>
          <Faq items={content.faq} />
        </div>
      </section>

      <Closing source={`servicio_${slug}_cierre`} waText={content.ctaWhatsappText} />
    </main>
  );
}
