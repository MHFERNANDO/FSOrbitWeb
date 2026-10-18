import ServicePage from './ServicePage';

export default function DisenoWebCuenca() {
  return (
    <ServicePage
      path="/servicios/diseno-web-cuenca"
      breadcrumbLabel="Diseño Web en Cuenca"
      seoTitle="Diseño Web en Cuenca, Ecuador | FS Orbit"
      seoDescription="Diseño y desarrollo de páginas web en Cuenca, Ecuador. Landing pages de autor, sin plantillas, con código propio, SEO técnico y animaciones de scroll."
      kicker="Diseño Web — Cuenca, Ecuador"
      h1Segments={[{ text: 'Páginas web' }, { break: true }, { text: 'diseñadas en Cuenca.', highlight: true }]}
      intro="Diseñamos y desarrollamos sitios web a medida para negocios en Cuenca y el resto de Ecuador: landing pages, sitios corporativos y presencia digital construida con código propio, sin plantillas de WordPress o builders."
      highlights={[
        {
          icon: 'globe',
          title: 'Desarrollo Web',
          text: 'Sitios de alto rendimiento, seguros y optimizados para SEO. Construimos la base sólida que tu empresa necesita para escalar.',
        },
        {
          icon: 'layout',
          title: 'Diseño UI/UX',
          text: 'Interfaces modernas centradas en el usuario. No solo diseñamos cosas bonitas, creamos experiencias que convierten visitas en clientes.',
        },
      ]}
      faq={[
        {
          question: '¿El SEO está incluido?',
          answer: 'Sí. Todos los planes incluyen SEO on-page estructural (metadatos, estructura semántica, velocidad de carga) como parte del desarrollo, no como extra.',
        },
        {
          question: '¿Cuánto cuesta una página web en Cuenca con FS Orbit?',
          answer: 'El plan de entrada (Orbit Impact, una landing page) parte desde $200. Ver /precios para el detalle completo de qué incluye cada plan.',
        },
        {
          question: '¿Cuánto tiempo toma el desarrollo?',
          answer: '{{TODO: tiempo de entrega real por plan — pendiente de confirmar con el cliente}}',
        },
        {
          question: '¿Puedo editar el contenido yo mismo después de la entrega?',
          answer: '{{TODO: confirmar con el cliente si se entrega algún panel de edición o el contenido es fijo}}',
        },
      ]}
      ctaWhatsappText="Quiero cotizar una página web en Cuenca"
    />
  );
}
