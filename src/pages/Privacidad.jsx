import PageHead from '@/components/PageHead';
import { usePageSeo } from '@/hooks/usePageSeo';
import { renderInline } from '@/lib/inlineLinks';
import { contact } from '@/data/content';

const CRUMBS = [
  { name: 'Inicio', path: '/' },
  { name: 'Política de privacidad', path: '/politica-de-privacidad' },
];

export const PRIVACY_UPDATED = '15 de noviembre de 2026';

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
      'Este sitio no envía formularios a nuestros servidores. En la página de [contacto](/contacto) puedes armar un mensaje, pero ese texto no se guarda ni se nos envía desde el sitio: solo se abre WhatsApp con el mensaje escrito para que lo envíes tú. Si nos contactas por WhatsApp, teléfono o correo, recibimos la información que tú mismo nos envías por esos canales (por ejemplo tu número y tu mensaje).',
      'Analítica del sitio. Usamos Vercel Web Analytics para saber cuántas personas visitan cada página y qué botones se usan (por ejemplo, clics en WhatsApp, correo o teléfono). Son datos de uso agregados, sin tu nombre. Está pensada para medir visitas sin recurrir a cookies de seguimiento; los detalles están en la documentación de Vercel.',
      'Datos técnicos. Vercel, como proveedor de infraestructura, puede registrar datos técnicos de conexión (como la dirección IP) en sus propios registros.',
      'Almacenamiento del navegador. No instalamos cookies de publicidad ni de seguimiento propias, y el sitio no guarda datos personales en tu navegador.',
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
      'Para operar el sitio usamos a Vercel (alojamiento y analítica). El sitio también contiene enlaces a servicios de terceros: WhatsApp, Instagram y los sitios web de nuestros clientes, que se abren en una pestaña nueva. Al usarlos, aplican las políticas de privacidad de esos servicios, no esta.',
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
  usePageSeo({ path: '/politica-de-privacidad', crumbs: CRUMBS, dateModified: '2026-11-15' });

  return (
    <main id="main">
      <PageHead
        crumbs={CRUMBS}
        lines={['Política de', 'privacidad']}
        lead={`Qué datos recibe fsorbit.com, para qué los usamos y cómo puedes ejercer tus derechos. Última actualización: ${PRIVACY_UPDATED}.`}
      />
      <section className="wrap">
        <div className="article">
          {SECTIONS.map((s) => (
            <div key={s.h2}>
              <h2>{s.h2}</h2>
              {s.paragraphs.map((p) => (
                <p key={p.slice(0, 40)}>{renderInline(p)}</p>
              ))}
            </div>
          ))}
        </div>
        <div style={{ height: 'var(--section-y)' }} />
      </section>
    </main>
  );
}
