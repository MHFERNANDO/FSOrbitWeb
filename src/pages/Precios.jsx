import { Link } from 'react-router-dom';
import PageHead from '@/components/PageHead';
import WaButton from '@/components/WaButton';
import Faq from '@/components/Faq';
import Closing from '@/components/Closing';
import { usePageSeo } from '@/hooks/usePageSeo';
import { planNodes, faqNode } from '@/seo/jsonld';
import { pricingPlans, planNotes } from '@/data/content';
import { faqPrecios as faq } from '@/data/faq';

const CRUMBS = [
  { name: 'Inicio', path: '/' },
  { name: 'Planes y precios', path: '/precios' },
];

export default function Precios() {
  usePageSeo({ path: '/precios', crumbs: CRUMBS, nodes: [...planNodes('/precios'), faqNode('/precios', faq)] });

  return (
    <main id="main">
      <PageHead
        crumbs={CRUMBS}
        lines={['Planes y precios', 'de páginas web']}
        lead="Tres niveles según lo que tu negocio necesita. Aquí está lo que incluye cada uno, lo que no incluye ninguno y qué hace que el precio suba."
      />

      <section className="wrap" aria-label="Planes">
        <div className="ledger">
          {pricingPlans.map((plan) => (
            <article className="ledger-row" key={plan.slug} id={plan.slug}>
              <div>
                <p className="ledger-price">{plan.priceLabel}</p>
                <h2 className="ledger-name">{plan.name}</h2>
                <p className="ledger-kind">
                  {plan.kind}, {plan.scope.toLowerCase()}
                </p>
              </div>
              <div className="ledger-desc">
                <p className="muted">{plan.description}</p>
                <p className="ledger-ideal">{plan.idealFor}</p>
                <WaButton variant="btn--ghost btn--small" text={plan.whatsappText} source={`precios_${plan.slug}`}>
                  {plan.cta}
                </WaButton>
                {plan.servicePath && (
                  <p>
                    <Link className="link small" to={plan.servicePath}>
                      Ver el servicio en detalle
                    </Link>
                  </p>
                )}
              </div>
              <div>
                <h3 className="small muted" style={{ marginBottom: 12 }}>
                  Incluye
                </h3>
                <ul className="ticks">
                  {plan.includes.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="wrap section">
        <div className="stack">
          <div className="split">
            <h2 className="h3">Qué significa “desde”</h2>
            <div className="prose stack-sm">
              <p>Es el precio base del plan. El costo final depende del alcance exacto del proyecto, y lo sabes antes de empezar.</p>
              <ul className="ticks">
                {planNotes.priceMoves.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="split">
            <h2 className="h3">Lo que traen los tres planes</h2>
            <ul className="ticks prose">
              {planNotes.all.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
          <div className="split">
            <h2 className="h3">Lo que no incluye ninguno</h2>
            <ul className="ticks ticks--no prose">
              {planNotes.notIncluded.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="rule">
        <div className="wrap section split">
          <h2 className="h2 sticky">Preguntas sobre precios</h2>
          <Faq items={faq} />
        </div>
      </section>

      <Closing
        source="precios_cierre"
        title="Pide tu precio exacto"
        text="Cuéntanos por WhatsApp qué necesitas. Te respondemos con el alcance, el precio final, un plazo estimado y la forma de pago."
        waText="Hola, quiero cotizar una página web"
      />
    </main>
  );
}
