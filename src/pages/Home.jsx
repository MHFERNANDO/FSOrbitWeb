import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Display from '@/components/Display';
import WaButton from '@/components/WaButton';
import Faq from '@/components/Faq';
import Shot from '@/components/Shot';
import Closing from '@/components/Closing';
import OrbitFigure from '@/components/OrbitFigure';
import { usePageSeo } from '@/hooks/usePageSeo';
import { faqNode } from '@/seo/jsonld';
import { faqHome } from '@/data/faq';
import { homeCases, pricingPlans } from '@/data/content';
import { detectTier } from '@/lib/capability';
import '@/styles/home.css';

// La home es un recorrido de cinco escenas. El HTML es el mismo en todos
// los dispositivos: con GPU capaz, un solo lienzo WebGL (el objeto en
// orbita hecho de codigo) acompana el scroll; sin ella, cada escena
// muestra su figura estatica con la misma informacion.
export default function Home() {
  usePageSeo({ path: '/', name: 'Diseño de Páginas Web en Cuenca', nodes: [faqNode('/', faqHome)] });
  const journey = useRef(null);

  useEffect(() => {
    const root = document.documentElement;
    let dispose;
    let alive = true;
    if (detectTier() === 'gl') {
      root.classList.add('gl');
      // El 3D se pide cuando el navegador queda libre: no compite con el
      // texto ni con las fuentes del primer pintado.
      const start = () =>
        import('@/gl/journey.js')
          .then((mod) => mod.startJourney(journey.current))
          .then((stop) => {
            if (alive) dispose = stop;
            else stop?.();
          })
          .catch(() => root.classList.remove('gl', 'gl-on'));
      if ('requestIdleCallback' in window) requestIdleCallback(start, { timeout: 1500 });
      else setTimeout(start, 400);
    }
    return () => {
      alive = false;
      dispose?.();
      root.classList.remove('gl', 'gl-on');
    };
  }, []);

  return (
    <main id="main" className="home">
      <div className="journey" ref={journey}>
        <div className="stage" aria-hidden="true" />

        {/* ------------------------------------------------ 1. Arranque */}
        <section className="scene scene-1" aria-labelledby="h-inicio">
          <div className="wrap scene-grid">
            <div className="scene-copy">
              <Display
                id="h-inicio"
                lines={['Diseño de páginas web', 'a medida para negocios', 'de Cuenca']}
                from={72}
                to={54}
                scrub={{ trigger: '.scene-1', start: 'top top', end: 'bottom top' }}
              />
              <p className="lead">
                FS Orbit diseña y programa tu sitio con código propio, sin plantillas. Hablas directo con Pablo o Fernando, los dos
                desarrolladores que lo construyen.
              </p>
              <div className="actions" data-dock-hide>
                <WaButton source="home_hero" />
                <Link className="link" to="/precios">
                  Ver planes desde $200
                </Link>
              </div>
              <p className="small muted hero-proof">
                Sitios publicados para Accu-Lab, Gravity Estudio Creativo, JF Vapes y Laboratorio Diesel MG.{' '}
                <Link className="link" to="/proyectos">
                  Ver los casos
                </Link>
              </p>
            </div>
            <div className="slot" data-slot="a">
              <OrbitFigure />
            </div>
          </div>
        </section>

        {/* ------------------------------------------------ 2. Problema */}
        <section className="scene scene-2 scene--pin" aria-labelledby="h-plantilla">
          <div className="scene-pin">
            <div className="wrap scene-grid">
              <div className="scene-copy">
                <Display
                  as="h2"
                  id="h-plantilla"
                  lines={['Una plantilla trata', 'igual a todos', 'los negocios']}
                  from={84}
                  to={50}
                  wrap={false}
                  mobile={[66, 50]}
                  scrub={{ trigger: '.scene-2', start: 'top 60%', end: 'bottom 80%' }}
                />
                <p>
                  Una plantilla comparte diseño y código con miles de sitios, y suele traer funciones que nunca vas a usar. Eso se nota
                  en la velocidad de carga y en la imagen de tu marca.
                </p>
                <p>
                  Un tema comprado o un constructor de páginas resuelven rápido el arranque. El costo llega después: plugins que hay
                  que mantener y un diseño limitado a los bloques que trae la plantilla.
                </p>
              </div>
              <div className="slot" data-slot="b">
                <div className="figure tpl" aria-hidden="true">
                  {Array.from({ length: 9 }, (_, i) => (
                    <i key={i} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------- 3. Giro */}
        <section className="scene scene-3 scene--pin" aria-labelledby="h-medida">
          <div className="scene-pin">
            <div className="wrap scene-grid">
              <div className="scene-copy">
                <Display
                  as="h2"
                  id="h-medida"
                  lines={['El tuyo lo escribimos', 'línea por línea']}
                  from={50}
                  to={96}
                  wrap={false}
                  mobile={[50, 70]}
                  scrub={{ trigger: '.scene-3', start: 'top 70%', end: 'top -30%' }}
                />
                <p>
                  Pure Code es como llamamos a nuestra forma de trabajar: código escrito para tu proyecto, sin WordPress, sin Wix, sin
                  plantillas compradas ni constructores. El framework se elige, no se hereda. Lo que no hace falta, no se carga.
                </p>
                <ul className="ticks">
                  <li>Sin plugins de terceros que mantener.</li>
                  <li>Títulos, descripciones y encabezados propios en cada página, para que Google entienda qué ofreces.</li>
                  <li>Adaptada a celular desde el primer día, no como un ajuste posterior.</li>
                </ul>
                <p className="small muted">
                  Esta página está hecha así: el objeto que se transforma, la letra que cambia de ancho y cada línea de texto se
                  escribieron para FS Orbit.{' '}
                  <Link className="link" to="/proceso">
                    Ver cómo trabajamos
                  </Link>
                </p>
              </div>
              <div className="slot" data-slot="c">
                <div className="figure bespoke" aria-hidden="true">
                  <i className="b-h1" />
                  <i className="b-h2" />
                  <i className="b-img" />
                  <i className="b-orb" />
                  <i className="b-t1" />
                  <i className="b-t2" />
                  <i className="b-t3" />
                  <i className="b-btn" />
                  <i className="b-f1" />
                  <i className="b-f2" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------- 4. Casos */}
        <section className="scene scene-4" aria-labelledby="h-casos">
          <div className="wrap cases-head">
            <h2 className="h2" id="h-casos">
              Para quién hemos trabajado
            </h2>
            <p className="muted">
              Tres trabajos de cerca. Los dos publicados se pueden visitar; no mostramos cifras de tráfico ni de ventas que no tengamos.
            </p>
          </div>
          <div className="cases">
            <div className="cases-pin" aria-hidden="true">
              <div className="wrap scene-grid">
                <span />
                <div className="slot" data-slot="d" />
              </div>
            </div>
            {homeCases.map((c) => (
              <article className="case-step" key={c.slug}>
                <div className="wrap scene-grid">
                  <div className="scene-copy">
                    <p className="small muted">{c.tag}</p>
                    <h3 className="h2">{c.title}</h3>
                    <p>{c.description}</p>
                    <div className="actions">
                      <Link className="link" to={`/proyectos/${c.slug}`}>
                        {c.pending ? `Ver el estado del caso de ${c.title}` : `Ver el caso de ${c.title}`}
                      </Link>
                      {c.url && (
                        <a className="link" href={c.url} target="_blank" rel="noopener noreferrer">
                          Abrir {new URL(c.url).hostname.replace(/^www\./, '')}
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="figure case-figure">
                    <Shot project={c} sizes="(min-width: 900px) 52vw, 100vw" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* -------------------------------------------------- 5. Cierre */}
        <section className="scene scene-5" aria-labelledby="h-planes">
          <div className="wrap">
            <div className="scene-grid plans-head">
              <div className="scene-copy">
                <h2 className="h2" id="h-planes">
                  Tres planes, con el precio a la vista
                </h2>
                <p>
                  “Desde” es el precio base de cada plan. El valor final depende del número de vistas, las integraciones y el
                  contenido. El dominio y el hosting se pagan aparte.
                </p>
              </div>
              <div className="slot slot--small" data-slot="e" />
            </div>

            <div className="ledger">
              {pricingPlans.map((plan) => (
                <div className="ledger-row" key={plan.slug}>
                  <div>
                    <p className="ledger-price">{plan.priceLabel}</p>
                    <h3 className="ledger-name">{plan.name}</h3>
                    <p className="ledger-kind">
                      {plan.kind}, {plan.scope.toLowerCase()}
                    </p>
                  </div>
                  <p className="ledger-desc muted">{plan.description}</p>
                  <ul className="ticks">
                    {plan.includes.slice(0, 4).map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="actions plans-actions" data-dock-hide>
              <WaButton source="home_planes" text="Hola, quiero cotizar una página web" />
              <Link className="link" to="/precios">
                Ver todo lo que incluye cada plan
              </Link>
            </div>
          </div>
        </section>
      </div>

      <section className="rule" aria-labelledby="h-faq">
        <div className="wrap section split">
          <h2 className="h2 sticky" id="h-faq">
            Preguntas frecuentes
          </h2>
          <Faq items={faqHome} />
        </div>
      </section>

      <Closing source="home_cierre" />
    </main>
  );
}
