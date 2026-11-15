import { Link } from 'react-router-dom';
import PageHead from '@/components/PageHead';
import Closing from '@/components/Closing';
import { usePageSeo } from '@/hooks/usePageSeo';
import { services } from '@/data/content';

const CRUMBS = [
  { name: 'Inicio', path: '/' },
  { name: 'Sobre nosotros', path: '/sobre-nosotros' },
];

const PILLARS = [
  {
    title: 'Quiénes somos',
    text: 'FS Orbit es un estudio de desarrollo web de Cuenca, Ecuador, formado por Pablo y Fernando, desarrolladores. Nos concentramos en pocos servicios y los trabajamos proyecto por proyecto: páginas web, tiendas online y software a medida para negocios de la ciudad y de todo el país.',
  },
  {
    title: 'Cómo trabajamos',
    text: 'Hablas directamente con Pablo o Fernando, quienes diseñan y programan tu sitio, sin intermediarios. Escribimos el código en lugar de partir de plantillas, para incluir solo lo que tu negocio necesita y cuidar la velocidad y el SEO técnico desde el primer día.',
  },
  {
    title: 'Hacia dónde vamos',
    text: 'Construimos sitios pensados para crecer contigo: una base técnica ordenada a la que se puede sumar después una tienda, un sistema a medida o mantenimiento, cuando tu negocio lo pida. Queremos que cada proyecto nos recomiende al siguiente.',
  },
];

export default function SobreNosotros() {
  usePageSeo({ path: '/sobre-nosotros', crumbs: CRUMBS, type: 'AboutPage' });

  return (
    <main id="main">
      <PageHead
        crumbs={CRUMBS}
        lines={['Un estudio web', 'con base en Cuenca']}
        lead="FS Orbit diseña y desarrolla sitios web a medida para negocios de Cuenca y de todo Ecuador. Somos dos desarrolladores: Pablo y Fernando."
      />

      <section className="wrap section--tight">
        <div className="stack">
          {PILLARS.map((p) => (
            <div className="split" key={p.title}>
              <h2 className="h3">{p.title}</h2>
              <p className="lead" style={{ maxWidth: '60ch' }}>
                {p.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="rule">
        <div className="wrap section">
          <h2 className="h2">Qué hacemos</h2>
          <div className="rows" style={{ marginTop: 'clamp(28px, 4vw, 48px)' }}>
            {services.map((s) => (
              <Link className="row row--2" to={s.href} key={s.slug}>
                <h3 className="h3 row-title">{s.title}</h3>
                <p>{s.description}</p>
              </Link>
            ))}
          </div>
          <p className="muted" style={{ marginTop: 28, maxWidth: '62ch' }}>
            Mira sitios reales en los{' '}
            <Link className="link" to="/proyectos">
              casos
            </Link>
            , lo que incluye cada plan en{' '}
            <Link className="link" to="/precios">
              planes y precios
            </Link>{' '}
            o guías para negocios locales en el{' '}
            <Link className="link" to="/blog">
              blog
            </Link>
            .
          </p>
        </div>
      </section>

      <Closing
        source="sobre_nosotros"
        text="Estamos en Cuenca, Azuay, y trabajamos de forma remota con clientes de todo Ecuador. No atendemos en una oficina abierta al público: escríbenos y coordinamos."
      >
        <Link className="link" to="/contacto">
          Ver todos los canales
        </Link>
      </Closing>
    </main>
  );
}
