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

// IMPORTANTE: este texto describe lo que el sitio HACE hoy (formulario de
// contacto -> /api/contact -> Resend; Vercel Web Analytics; WhatsApp,
// Instagram y vista previa de sitios de clientes como enlaces/iframes de
// terceros). Si se agrega un servicio nuevo (otra analitica, pixeles,
// cookies, newsletter, etc.), actualizar esta pagina y la fecha.
//
// TODO(cliente): validar con un abogado el texto final y definir:
//  - plazo exacto de conservacion de los mensajes recibidos
//  - nombre legal / RUC del responsable, si aplica
export const PRIVACY_UPDATED = '5 de noviembre de 2026';

const SECTIONS = [
  {
    h2: '1. Quién es responsable de tus datos',
    paragraphs: [
      `FS Orbit, con base en Cuenca, Azuay, Ecuador, es responsable del tratamiento de los datos que recibe a través de este sitio web (fsorbit.com). Puedes escribirnos a ${contact.email} para cualquier consulta sobre esta política.`,
    ],
  },
  {
    h2: '2. Qué datos recibimos',
    paragraphs: [
      'Formulario de contacto. El sitio tiene un formulario en la página de [contacto](/contacto). Si lo envías, recibimos los datos que escribes en él: tu nombre, el nombre de tu negocio (opcional), el tipo de proyecto, un presupuesto aproximado (opcional) y tu mensaje. El formulario no te pide correo ni teléfono; si los incluyes en el mensaje, los recibimos también.',
      'Analítica del sitio. Usamos Vercel Web Analytics para saber cuántas personas visitan cada página y qué botones se usan (por ejemplo, clics en WhatsApp, correo o teléfono, y el envío del formulario). Son datos de uso agregados, sin tu nombre. Vercel Web Analytics está pensado para medir visitas sin recurrir a cookies de seguimiento; los detalles de su funcionamiento están en la documentación de Vercel.',
      'Datos técnicos. Para evitar el envío masivo de mensajes no deseados (spam), el formulario limita cuántos envíos se aceptan desde una misma conexión en un corto período; para ello se usa temporalmente la dirección IP, sin guardarla en una base de datos. Vercel, como proveedor de infraestructura, puede registrar datos técnicos de conexión en sus propios registros.',
      'Almacenamiento del navegador. El sitio guarda en tu navegador una marca de sesión (sin datos personales) para no repetir la animación de entrada en cada página. No instalamos cookies de publicidad ni de seguimiento propias.',
    ],
  },
  {
    h2: '3. Para qué usamos tus datos',
    paragraphs: [
      'Usamos los datos del formulario únicamente para responder tu consulta y, si nos lo pides, preparar una cotización. La analítica la usamos para entender qué partes del sitio funcionan y cuáles hay que mejorar. No vendemos tus datos ni los usamos para publicidad de terceros.',
    ],
  },
  {
    h2: '4. Con quién se comparten',
    paragraphs: [
      'Para operar el sitio usamos proveedores que procesan datos por cuenta nuestra: Vercel (alojamiento del sitio y analítica) y Resend (servicio de envío de correo electrónico con el que nos llega el mensaje del formulario).',
      'El sitio también contiene enlaces a servicios de terceros: WhatsApp e Instagram, y una vista previa de sitios web de nuestros clientes que se abre en una ventana dentro de la página cuando la solicitas. Al usarlos, aplican las políticas de privacidad de esos servicios, no esta.',
    ],
  },
  {
    h2: '5. Cuánto tiempo conservamos tus datos',
    paragraphs: [
      'Conservamos los mensajes recibidos el tiempo necesario para atender tu consulta y, si se concreta un proyecto, el que corresponda a la relación con el cliente. Puedes pedirnos en cualquier momento que los eliminemos.',
    ],
  },
  {
    h2: '6. Tus derechos',
    paragraphs: [
      'De acuerdo con la Ley Orgánica de Protección de Datos Personales del Ecuador, puedes solicitar acceso a tus datos, su rectificación o actualización, su eliminación, y oponerte a su tratamiento. Para ejercer cualquiera de estos derechos, escríbenos a ' + contact.email + ' indicando qué solicitas y desde qué mensaje o fecha nos contactaste.',
    ],
  },
  {
    h2: '7. Cambios en esta política',
    paragraphs: [
      `Si el sitio cambia la forma en que trata datos (por ejemplo, al sumar una nueva herramienta), actualizaremos esta página y su fecha. Última actualización: ${PRIVACY_UPDATED}.`,
    ],
  },
];

export default function Privacidad() {
  usePageSeo({ path: '/politica-de-privacidad', crumbs: CRUMBS, dateModified: '2026-11-05' });

  return (
    <main id="main">
      <header className="mx-auto max-w-(--maxw) px-(--gutter) pb-[clamp(56px,7vw,96px)] pt-[clamp(72px,10vw,152px)]">
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

      {SECTIONS.map((s) => (
        <section key={s.h2} className="border-t border-[color:var(--line)]">
          <div className="mx-auto grid max-w-(--maxw) gap-s6 px-(--gutter) py-s9 lg:grid-cols-[1fr_1.4fr] lg:gap-s9">
            <h2 className="font-display text-[length:var(--fs-h4)] font-extrabold leading-[var(--lh-tight)]">{s.h2}</h2>
            <div className="grid max-w-[62ch] gap-s4 text-text-2">
              {s.paragraphs.map((p) => (
                <p key={p.slice(0, 40)}>{renderInline(p)}</p>
              ))}
            </div>
          </div>
        </section>
      ))}
    </main>
  );
}
