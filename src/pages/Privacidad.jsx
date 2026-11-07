import Reveal from '@/components/Reveal';
import SplitHeading from '@/components/SplitHeading';
import Breadcrumbs from '@/components/Breadcrumbs';
import { usePageSeo } from '@/hooks/usePageSeo';
import { renderInline } from '@/lib/inlineLinks';
import { contact } from '@/data/content';

const CRUMBS = [
  { name: 'Inicio', path: '/' },
  { name: 'Política de privacidad', path: '/politica-de-privacidad' },
];

// IMPORTANTE: este texto describe lo que el sitio HACE hoy: no tiene
// formularios; el contacto es por WhatsApp, telefono y correo (enlaces).
// Usa Vercel Web Analytics y enlaza a WhatsApp, Instagram y a sitios de
// clientes (vista previa en iframe). Si se agrega un servicio nuevo
// (formulario, otra analitica, pixeles, cookies...), actualizar esta
// pagina y la fecha.
//
// TODO(cliente): validar con un abogado el texto final y definir el
// plazo de conservacion y razon social/RUC si aplica.
export const PRIVACY_UPDATED = '7 de noviembre de 2026';

const SECTIONS = [
  {
    h2: 'Quién es responsable de tus datos',
    paragraphs: [
      `FS Orbit, con base en Cuenca, Azuay, Ecuador, es responsable del tratamiento de los datos que recibe a través de este sitio web (fsorbit.com). Puedes escribirnos a ${contact.email} para cualquier consulta sobre esta política.`,
    ],
  },
  {
    h2: 'Qué datos recibimos',
    paragraphs: [
      'Este sitio no tiene formularios: no te pedimos que escribas tus datos en la página. Si nos contactas por WhatsApp, teléfono o correo desde los enlaces de [contacto](/contacto), recibimos la información que tú mismo nos envías por esos canales (por ejemplo tu número y tu mensaje).',
      'Analítica del sitio. Usamos Vercel Web Analytics para saber cuántas personas visitan cada página y qué botones se usan (por ejemplo, clics en WhatsApp, correo o teléfono). Son datos de uso agregados, sin tu nombre. Está pensada para medir visitas sin recurrir a cookies de seguimiento; los detalles están en la documentación de Vercel.',
      'Datos técnicos. Vercel, como proveedor de infraestructura, puede registrar datos técnicos de conexión (como la dirección IP) en sus propios registros.',
      'Almacenamiento del navegador. El sitio guarda en tu navegador una marca de sesión (sin datos personales) para no repetir la animación de entrada en cada página. No instalamos cookies de publicidad ni de seguimiento propias.',
    ],
  },
  {
    h2: 'Para qué usamos tus datos',
    paragraphs: [
      'Usamos lo que nos envías por WhatsApp, teléfono o correo únicamente para responder tu consulta y, si nos lo pides, preparar una cotización. La analítica la usamos para entender qué partes del sitio funcionan y cuáles hay que mejorar. No vendemos tus datos ni los usamos para publicidad de terceros.',
    ],
  },
  {
    h2: 'Con quién se comparten',
    paragraphs: [
      'Para operar el sitio usamos a Vercel (alojamiento y analítica). El sitio también contiene enlaces a servicios de terceros: WhatsApp e Instagram, y una vista previa de sitios web de nuestros clientes que se abre en una ventana dentro de la página cuando la solicitas. Al usarlos, aplican las políticas de privacidad de esos servicios, no esta.',
    ],
  },
  {
    h2: 'Cuánto tiempo conservamos tus datos',
    paragraphs: [
      'Conservamos tus mensajes el tiempo necesario para atender tu consulta y, si se concreta un proyecto, el que corresponda a la relación con el cliente. Puedes pedirnos en cualquier momento que los eliminemos.',
    ],
  },
  {
    h2: 'Tus derechos',
    paragraphs: [
      `De acuerdo con la Ley Orgánica de Protección de Datos Personales del Ecuador, puedes solicitar acceso a tus datos, su rectificación o actualización, su eliminación, y oponerte a su tratamiento. Para ejercer cualquiera de estos derechos, escríbenos a ${contact.email} indicando qué solicitas.`,
    ],
  },
  {
    h2: 'Cambios en esta política',
    paragraphs: [
      `Si el sitio cambia la forma en que trata datos (por ejemplo, al sumar una nueva herramienta), actualizaremos esta página y su fecha. Última actualización: ${PRIVACY_UPDATED}.`,
    ],
  },
];

export default function Privacidad() {
  usePageSeo({ path: '/politica-de-privacidad', crumbs: CRUMBS, dateModified: '2026-11-07' });

  return (
    <main id="main">
      <header className="mx-auto max-w-(--maxw) px-(--gutter) pb-[clamp(48px,6vw,80px)] pt-[clamp(72px,10vw,152px)]">
        <Breadcrumbs crumbs={CRUMBS} />
        <Reveal as="span" type="fade" className="mb-s5 inline-block font-mono text-[length:var(--fs-mono)] uppercase tracking-[var(--tr-mono)] text-text-3">
          Legal
        </Reveal>
        <SplitHeading
          as="h1"
          className="max-w-[18ch] font-display text-[length:var(--fs-h1)] font-extrabold leading-[var(--lh-tight)] tracking-[var(--tr-display)]"
          segments={[{ text: 'Política de' }, { break: true }, { text: 'privacidad.', highlight: true }]}
        />
        <Reveal as="p" type="rise" className="mt-s5 max-w-[56ch] text-[length:var(--fs-lead)] text-text-2">
          {`Qué datos recibe fsorbit.com, para qué los usamos y cómo puedes ejercer tus derechos. Última actualización: ${PRIVACY_UPDATED}.`}
        </Reveal>
      </header>

      <section className="border-t border-[color:var(--line)]">
        <div className="mx-auto max-w-(--maxw) px-(--gutter) py-[var(--section-y)]">
          {SECTIONS.map((s, i) => (
            <Reveal
              as="article"
              type="rise"
              key={s.h2}
              className="grid gap-x-s7 gap-y-s3 border-b border-[color:var(--line)] py-s7 first:pt-0 md:grid-cols-[72px_minmax(0,1fr)_minmax(0,1.6fr)]"
            >
              <span className="font-mono text-text-3">{String(i + 1).padStart(2, '0')}</span>
              <h2 className="font-display text-[length:var(--fs-h4)] font-extrabold leading-[var(--lh-tight)]">{s.h2}</h2>
              <div className="grid max-w-[62ch] gap-s3 text-text-2">
                {s.paragraphs.map((p) => (
                  <p key={p.slice(0, 40)}>{renderInline(p)}</p>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
