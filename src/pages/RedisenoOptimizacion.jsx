import ServicePage from './ServicePage';

export default function RedisenoOptimizacion() {
  return (
    <ServicePage
      path="/servicios/rediseno-y-optimizacion"
      breadcrumbLabel="Rediseño y Optimización Web"
      seoTitle="Rediseño y Optimización de Páginas Web | FS Orbit"
      seoDescription="¿Tu web es lenta o anticuada? La rediseñamos y optimizamos: carga rápida, código limpio y buena experiencia en celular. Desde Cuenca para todo Ecuador."
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
          question: '¿Pierdo mi diseño actual al optimizar?',
          answer: 'No. Mejoramos el código y el rendimiento manteniendo tu identidad visual — no es empezar de cero, es resolver lo que te está frenando.',
        },
        {
          question: '¿Qué tipo de problemas resuelven?',
          answer: 'Carga lenta, código desordenado, mala experiencia en celular y plugins pesados — los más comunes en sitios hechos con builders o sin mantenimiento.',
        },
      ]}
      ctaWhatsappText="Quiero optimizar mi página web actual"
    />
  );
}
