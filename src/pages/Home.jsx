import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Display from '@/components/Display';
import WaButton from '@/components/WaButton';
import Faq from '@/components/Faq';
import Shot from '@/components/Shot';
import CaseCard from '@/components/CaseCard';
import OrbitFigure from '@/components/OrbitFigure';
import ServiceIcon from '@/components/ServiceIcon';
import SceneRail from '@/components/SceneRail';
import { usePageSeo } from '@/hooks/usePageSeo';
import { faqNode } from '@/seo/jsonld';
import { faqHome } from '@/data/faq';
import { pricingPlans, projects, services } from '@/data/content';
import { detectTier } from '@/lib/capability';
import '@/styles/home.css';

// La home es un recorrido de cinco escenas. El HTML es el mismo en todos
// los dispositivos: un modelo hecho de codigo (cuadros renderizados en
// Blender) recorre la pagina con el scroll, de hueco en hueco; con
// "reducir movimiento" cada escena muestra su figura estatica.
const SCENES = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'plantillas', label: 'Plantillas' },
  { id: 'a-medida', label: 'A medida' },
  { id: 'casos', label: 'Casos' },
  { id: 'planes', label: 'Planes' },
  { id: 'servicios', label: 'Servicios' },
];

export default function Home() {
  usePageSeo({ path: '/', name: 'Diseño de Páginas Web en Cuenca', nodes: [faqNode('/', faqHome)] });
  const journey = useRef(null);

  useEffect(() => {
    const root = document.documentElement;
    let dispose;
    let alive = true;
    if (detectTier() === 'seq') {
      root.classList.add('seq');
      // Los cuadros se piden cuando el navegador queda libre: no compiten
      // con el texto ni con las fuentes del primer pintado.
      const start = () =>
        import('@/orbit/orbit.js')
          .then((mod) => mod.startOrbit(journey.current))
          .then((stop) => {
            if (alive) dispose = stop;
            else stop?.();
          })
          .catch(() => root.classList.remove('seq', 'seq-on'));
      // Espera a que la pagina termine de cargar (texto, fuentes, capturas):
      // los cuadros no compiten con el primer pintado.
      const idle = () =>
        'requestIdleCallback' in window ? requestIdleCallback(start, { timeout: 1200 }) : setTimeout(start, 300);
      if (document.readyState === 'complete') idle();
      else window.addEventListener('load', idle, { once: true });
    }
    return () => {
      alive = false;
      dispose?.();
      root.classList.remove('seq', 'seq-on');
    };
  }, []);

  return (
    <main id="main" className="home">
      <SceneRail items={SCENES} />
      <div className="journey" ref={journey}>

        {/* ------------------------------------------------ 1. Arranque */}
        <section className="scene scene-1" id="inicio" aria-labelledby="h-inicio">
          <div className="wrap scene-grid">
            <div className="scene-copy">
              <Display
                id="h-inicio"
                lines={['Páginas web hechas', 'desde cero para', 'negocios de Cuenca']}
                from={110}
                to={94}
                scrub={{ trigger: '.scene-1', start: 'top top', end: 'bottom top' }}
              />
              <p className="lead">
                Diseñamos y programamos tu sitio sin plantillas: claro en el celular, rápido de cargar y con un botón para que tus
                clientes te escriban por WhatsApp.
              </p>
              <div className="actions" data-dock-hide>
                <WaButton source="home_hero" />
                <Link className="link" to="/precios">
                  Ver planes desde $200
                </Link>
              </div>
              <div className="clients">
                <p className="small muted">Sitios que hemos publicado en Cuenca</p>
                <ul>
                  {projects.map((p) => (
                    <li key={p.slug}>
                      <Link to={`/proyectos/${p.slug}`}>
                        <img
                          src={`/assets/${p.img}-480.webp`}
                          width="96"
                          height={Math.round((96 * p.h) / p.w)}
                          alt=""
                          decoding="async"
                          fetchPriority="low"
                        />
                        <span>{p.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="slot" data-slot="a">
              <OrbitFigure />
            </div>
          </div>
        </section>

        {/* ------------------------------------------------ 2. Problema */}
        <section className="scene scene-2 scene--pin" id="plantillas" aria-labelledby="h-plantilla">
          <div className="scene-pin">
            <div className="wrap scene-grid">
              <div className="scene-copy">
                <Display
                  as="h2"
                  id="h-plantilla"
                  lines={['Una plantilla trata', 'igual a todos', 'los negocios']}
                  from={122}
                  to={78}
                  wrap={false}
                  mobile={[112, 80]}
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
        <section className="scene scene-3 scene--pin" id="a-medida" aria-labelledby="h-medida">
          <div className="scene-pin">
            <div className="wrap scene-grid">
              <div className="scene-copy">
                <Display
                  as="h2"
                  id="h-medida"
                  lines={['El tuyo lo escribimos', 'línea por línea']}
                  from={78}
                  to={122}
                  wrap={false}
                  mobile={[80, 112]}
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
                  Esta misma página está hecha así, sin plantilla.{' '}
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
        <section className="scene scene-4" id="casos" aria-labelledby="h-casos">
          <div className="wrap scene-grid cases-head">
            <div className="scene-copy">
              <h2 className="h2" id="h-casos">
                Para quién hemos trabajado
              </h2>
              <p>
                Negocios de Cuenca con sitios publicados que puedes visitar hoy. No mostramos cifras de tráfico ni de ventas que no
                tengamos.
              </p>
              <Link className="link" to="/proyectos">
                Ver todos los casos
              </Link>
            </div>
            <div className="slot" data-slot="d" aria-hidden="true">
              <div className="figure case-poster">
                <Shot project={projects[0]} sizes="(min-width: 900px) 40vw, 90vw" />
              </div>
            </div>
          </div>

          <div className="wrap">
            <p className="cases-hint small muted" aria-hidden="true">
              Desliza para ver los {projects.length} sitios
            </p>
          </div>
          <ul className="cases-rail" aria-label="Sitios publicados">
            {projects.map((p) => (
              <CaseCard project={p} key={p.slug} />
            ))}
          </ul>
        </section>

        {/* -------------------------------------------------- 5. Cierre */}
        <section className="scene scene-5" id="planes" aria-labelledby="h-planes">
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
                  <div className="ledger-desc">
                    <p className="muted">{plan.description}</p>
                    <p className="ledger-ideal">{plan.idealFor}</p>
                  </div>
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

      <section className="rule" id="servicios" aria-labelledby="h-servicios">
        <div className="wrap section">
          <div className="split">
            <div className="stack-sm sticky">
              <h2 className="h2" id="h-servicios">
                Qué hacemos
              </h2>
              <p className="muted">Cinco servicios, todos con código propio. Elige por lo que necesita tu negocio hoy.</p>
              <p>
                <Link className="link" to="/servicios">
                  Ver los servicios y cómo elegir
                </Link>
              </p>
              <div className="slot slot--side" data-slot="f" aria-hidden="true" />
            </div>
            <div className="rows">
              {services.map((sv) => (
                <Link className="row row--svc" to={sv.href} key={sv.slug}>
                  <ServiceIcon slug={sv.slug} />
                  <div>
                    <h3 className="h3 row-title">{sv.title}</h3>
                    <p>{sv.short}</p>
                  </div>
                  <span className="row-meta">{sv.from}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rule" aria-labelledby="h-faq">
        <div className="wrap section split">
          <div className="stack-sm sticky">
            <h2 className="h2" id="h-faq">
              Preguntas frecuentes
            </h2>
            <div className="slot slot--side slot--faq" data-slot="faq" aria-hidden="true" />
          </div>
          <Faq items={faqHome} />
        </div>
      </section>

      <section className="rule">
        <div className="wrap section end-grid">
          <div className="closing">
            <h2 className="h2">Cuéntanos qué necesita tu negocio</h2>
            <p>
              Escríbenos por WhatsApp. Te respondemos con una propuesta: precio, plazo estimado y forma de pago, antes de empezar.
            </p>
            <div className="actions" data-dock-hide>
              <WaButton source="home_cierre" />
            </div>
          </div>
          <div className="slot slot--end" data-slot="g" aria-hidden="true" />
        </div>
      </section>
    </main>
  );
}
