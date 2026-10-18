import ServicePage from './ServicePage';

export default function TiendasOnline() {
  return (
    <ServicePage
      path="/servicios/tiendas-online"
      breadcrumbLabel="Tiendas Online"
      seoTitle="Tiendas Online y E-commerce en Ecuador | FS Orbit"
      seoDescription="Desarrollo de tiendas online a medida en Ecuador, con sede en Cuenca. Catálogo de productos, pedidos por WhatsApp o pasarela de pago, gestión de inventario."
      kicker="E-commerce — Ecuador"
      h1Segments={[{ text: 'Tiendas online que' }, { break: true }, { text: 'venden 24/7.', highlight: true }]}
      intro="Construimos e-commerce a medida para negocios en Cuenca y en todo Ecuador: catálogo de productos, gestión de inventario y pedidos directos, sin depender de plantillas genéricas."
      highlights={[
        {
          icon: 'bag',
          title: 'E-commerce',
          text: 'Sistemas de venta online robustos y escalables. Gestiona inventario, pagos y envíos en una plataforma diseñada para vender 24/7.',
        },
        {
          icon: 'whatsapp',
          title: 'Pedidos directos',
          text: 'Botón de pedido directo a WhatsApp o pasarela de pago, según lo que tu negocio necesite.',
        },
      ]}
      faq={[
        {
          question: '¿Cuánto cuesta una tienda online?',
          answer: 'El plan Orbit Commerce (hasta 4 vistas, tienda completa) parte desde $500. Ver /precios para el detalle de qué incluye.',
        },
        {
          question: '¿Cómo reciben los pedidos mis clientes?',
          answer: 'El plan Orbit Commerce incluye un botón de pedido directo a WhatsApp. Si tu negocio necesita una pasarela de pago integrada, se cotiza aparte según el caso.',
        },
        {
          question: '¿Puedo gestionar yo el inventario?',
          answer: 'Sí, el plan incluye panel de gestión de inventario y capacitación de uso de la plataforma.',
        },
        {
          question: '¿Puedo empezar con un catálogo chico e ir agregando productos?',
          answer: 'Sí, el catálogo es dinámico: podés lanzar con los productos que tengas listos y agregar o editar el resto después.',
        },
      ]}
      ctaWhatsappText="Quiero cotizar una tienda online"
    />
  );
}
