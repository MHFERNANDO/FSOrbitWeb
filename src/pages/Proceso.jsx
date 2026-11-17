import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import PageHead from '@/components/PageHead';
import Closing from '@/components/Closing';
import { usePageSeo } from '@/hooks/usePageSeo';
import { processSteps } from '@/data/content';
import { howToNode } from '@/seo/jsonld';
import { initScroll } from '@/lib/scroll';
import { motionAllowed } from '@/lib/capability';

const CRUMBS = [
  { name: 'Inicio', path: '/' },
  { name: 'Proceso', path: '/proceso' },
];

export default function Proceso() {
  usePageSeo({ path: '/proceso', crumbs: CRUMBS, nodes: [howToNode('/proceso', 'Cómo hacemos tu página web', processSteps)] });
  const steps = useRef(null);

  // La unica animacion de la pagina: la linea se llena al avanzar por los
  // pasos. Sin movimiento, la linea queda completa.
  useEffect(() => {
    const el = steps.current;
    if (!motionAllowed()) {
      el.style.setProperty('--fill', 1);
      return undefined;
    }
    let tween;
    let alive = true;
    initScroll().then(({ gsap }) => {
      if (!alive) return;
      tween = gsap.fromTo(
        el,
        { '--fill': 0 },
        { '--fill': 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 60%', end: 'bottom 60%', scrub: true } },
      );
    });
    return () => {
      alive = false;
      tween?.scrollTrigger?.kill();
      tween?.kill();
    };
  }, []);

  return (
    <main id="main">
      <PageHead
        crumbs={CRUMBS}
        lines={['Cómo hacemos', 'tu página web']}
        lead="Seis pasos, del primer mensaje al sitio publicado. En cada uno sabes qué hacemos nosotros y qué recibes tú."
      />

      <section className="wrap section--tight" aria-label="Pasos del proceso">
        <div className="steps" ref={steps}>
          <div className="steps-line" aria-hidden="true">
            <i />
          </div>
          <ol>
          {processSteps.map((s) => (
            <li className="step" key={s.title}>
              <h2 className="h3">{s.title}</h2>
              <p>{s.text}</p>
              <p className="step-get">
                <b>Qué recibes</b>
                {s.youGet}
              </p>
            </li>
          ))}
          </ol>
        </div>
      </section>

      <section className="rule">
        <div className="wrap section split">
          <h2 className="h2 sticky">Lo que se acuerda antes de empezar</h2>
          <div className="prose">
            <p>
              <strong>El plazo.</strong> Depende del alcance: una landing page de una sola vista lleva menos trabajo que una tienda
              online o un sistema a medida. Te damos un plazo estimado con la propuesta.
            </p>
            <p>
              <strong>El pago.</strong> Las formas y condiciones de pago se acuerdan con cada cliente según el alcance del proyecto.
            </p>
            <p>
              <strong>El código.</strong> La entrega del código y quién lo conserva se definen al contratar. Pregúntanos y lo dejamos
              claro para tu proyecto.
            </p>
            <p>
              <strong>Dominio y hosting.</strong> Se pagan aparte, porque son servicios anuales de otro proveedor. Los detalles de
              cada plan están en{' '}
              <Link className="link" to="/precios">
                planes y precios
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <Closing source="proceso" title="El paso uno es un mensaje" waText="Hola, quiero empezar una página web con FS Orbit" />
    </main>
  );
}
