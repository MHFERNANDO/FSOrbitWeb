import { Link } from 'react-router-dom';
import PageHead from '@/components/PageHead';
import Closing from '@/components/Closing';
import ServiceIcon from '@/components/ServiceIcon';
import { serviceListNode } from '@/seo/jsonld';
import { usePageSeo } from '@/hooks/usePageSeo';
import { services } from '@/data/content';

const CRUMBS = [
  { name: 'Inicio', path: '/' },
  { name: 'Servicios', path: '/servicios' },
];

export default function Servicios() {
  usePageSeo({ path: '/servicios', crumbs: CRUMBS, type: 'CollectionPage', nodes: [serviceListNode('/servicios', services)] });

  return (
    <main id="main">
      <PageHead
        crumbs={CRUMBS}
        lines={['Cinco servicios', 'para tu página web']}
        lead="Hacemos pocas cosas y las hacemos nosotros: diseñar, programar, mantener y mejorar sitios web para negocios de Cuenca y de todo Ecuador."
      />

      <section className="wrap section--tight" aria-label="Lista de servicios">
        <div className="rows">
          {services.map((s) => (
            <Link className="row row--3" to={s.href} key={s.slug}>
              <div>
                <ServiceIcon slug={s.slug} />
                <h2 className="h3 row-title" style={{ marginTop: 12 }}>{s.title}</h2>
                <p className="row-meta">{s.from}</p>
              </div>
              <div className="stack-sm">
                <p>{s.description}</p>
                <ul className="ticks">
                  {s.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
              <span className="link small">Ver el servicio</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="rule">
        <div className="wrap section split">
          <h2 className="h2 sticky">Cómo elegir</h2>
          <div className="prose">
            <p>
              <strong>Si todavía no tienes página,</strong> empieza por el diseño de páginas web. Una landing page sirve cuando quieres
              que la visita haga una sola acción, como escribirte por WhatsApp. Un sitio de varias páginas conviene si tienes varios
              servicios que explicar.
            </p>
            <p>
              <strong>Si vendes productos,</strong> mira las tiendas online: catálogo, inventario y pedidos por WhatsApp desde $500.
            </p>
            <p>
              <strong>Si ya tienes página y va lenta o se ve mal en el celular,</strong> el camino es el rediseño y optimización. No
              hace falta empezar de cero.
            </p>
            <p>
              <strong>Si tu página funciona y quieres que siga así,</strong> el mantenimiento cubre parches de seguridad, soporte y
              backup diario.
            </p>
            <p>
              ¿No sabes cuál es tu caso? Mira{' '}
              <Link className="link" to="/proceso">
                cómo trabajamos
              </Link>{' '}
              o los{' '}
              <Link className="link" to="/precios">
                planes y precios
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <Closing source="servicios" waText="Hola, quiero saber qué servicio le conviene a mi negocio" />
    </main>
  );
}
