import ServicePage from './ServicePage';

export default function RedisenoOptimizacion() {
  return (
    <ServicePage
      path="/servicios/rediseno-y-optimizacion"
      breadcrumbLabel="Rediseño y Optimización Web"
      seoTitle="Rediseño y Optimización de Páginas Web | FS Orbit"
      seoDescription="¿Tu página web es lenta o quedó anticuada? La rediseñamos y optimizamos: mejor velocidad de carga, código limpio y experiencia móvil, desde Cuenca para todo Ecuador."
      kicker="Rediseño & Optimización"
      h1Segments={[{ text: 'Tu web lenta,' }, { break: true }, { text: 'rediseñada y rápida.', highlight: true }]}
      intro="¿Tu página web se quedó en el pasado? Transformamos sitios lentos y antiguos en plataformas rápidas y modernas, mejorando el código y la experiencia móvil sin perder tu esencia de marca."
      highlights={[
        {
          icon: 'bolt',
          title: 'Optimización & Upgrade',
          text: '¿Tu web se quedó en el pasado? Transformamos sitios lentos y antiguos en plataformas rápidas y modernas, mejorando el código y la experiencia móvil sin perder tu esencia.',
        },
        {
          icon: 'shield',
          title: 'Mantenimiento Web',
          text: 'Protegemos tu inversión con soporte técnico continuo. Corrección de errores, actualizaciones de seguridad y respaldos constantes para que nunca dejes de estar online.',
        },
      ]}
      faq={[
        {
          question: '¿Qué incluye el mantenimiento?',
          answer: 'Parches de seguridad, soporte técnico y backup diario, para que tu sitio nunca deje de estar online.',
        },
        {
          question: '¿Cómo saben si mi web necesita optimización?',
          answer: '{{TODO: describir el proceso real de auditoría/diagnóstico que usa el cliente, si lo tiene}}',
        },
        {
          question: '¿Cuánto cuesta rediseñar mi página actual?',
          answer: '{{TODO: el precio de rediseño no está en los planes publicados (Orbit Impact/Commerce/Deep Space) — confirmar si aplica alguno de esos o es cotización aparte}}',
        },
      ]}
      ctaWhatsappText="Quiero optimizar mi página web actual"
    />
  );
}
