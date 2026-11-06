// Preguntas frecuentes por pagina. Respuestas directas de 2-3 frases,
// pensadas para que un buscador o una IA pueda citarlas.
//
// Regla: solo se afirma lo que esta confirmado en el sitio (precios
// publicados, caracteristicas de cada plan, servicios). Donde el dato no
// existe (plazos, hosting, formas de pago, propiedad del codigo) la
// respuesta es honesta y manda a cotizar por WhatsApp, en vez de
// inventar una politica.
//
// TODO(cliente): definir y publicar estas politicas cuando las tengas
// claras; entonces se pueden reemplazar las respuestas genericas:
//  - plazos de entrega por tipo de proyecto
//  - si hosting y dominio van incluidos o por cuenta del cliente
//  - formas de pago aceptadas y esquema (anticipo / pagos parciales)
//  - quien conserva la propiedad del codigo y que se entrega al final

const tiempo = {
  question: '¿Cuánto tarda en estar lista mi página web?',
  answer:
    'Depende del alcance: una landing page de una sola vista lleva menos trabajo que una tienda online o un sistema a medida. Escríbenos por WhatsApp contándonos qué necesitas y te damos un plazo estimado antes de empezar.',
};

const hosting = {
  question: '¿Qué incluye el hosting y el dominio?',
  answer:
    'Publicamos los sitios con certificado HTTPS sobre infraestructura moderna; nuestros propios proyectos corren en Vercel. Si el hosting y el dominio van incluidos en tu proyecto o los contratas tú, se define en la cotización antes de empezar.',
};

const mantenimiento = {
  question: '¿Ofrecen mantenimiento después de entregar la web?',
  answer:
    'Sí, con el servicio de Mantenimiento Web: parches de seguridad, soporte técnico y backup diario. Así tu sitio se mantiene actualizado y protegido después del lanzamiento.',
};

const pagos = {
  question: '¿Cómo se paga el proyecto?',
  answer:
    'Las formas y condiciones de pago se acuerdan con cada cliente antes de empezar, según el alcance del proyecto. Pregúntanos por WhatsApp y te las explicamos para tu caso.',
};

const codigo = {
  question: '¿De quién es el código de mi página?',
  answer:
    'La entrega del código y quién lo conserva se acuerdan con cada cliente al contratar. Pregúntanos antes de empezar y te lo dejamos claro para tu proyecto.',
};

const seo = {
  question: '¿El SEO está incluido?',
  answer:
    'Sí. Los planes incluyen SEO on-page estructural: metadatos, estructura semántica correcta y velocidad de carga. No es un extra que se cobra aparte.',
};

export const faqDisenoWeb = [
  {
    question: '¿Cuánto cuesta una página web en Cuenca con FS Orbit?',
    answer:
      'El plan de entrada, Orbit Impact (una landing page), parte desde $200. El precio final depende del número de vistas, el contenido y las integraciones; en la página de precios está el detalle de cada plan.',
  },
  tiempo,
  {
    question: '¿Necesito una landing page o un sitio de varias páginas?',
    answer:
      'Una landing page sirve cuando quieres que la visita haga una sola acción, como escribirte por WhatsApp. Un sitio de varias páginas conviene si tienes varios servicios que explicar y quieres aparecer en Google por cada uno.',
  },
  {
    question: '¿La web se ve bien en celular?',
    answer:
      'Sí, cada plan incluye diseño responsive: la web se adapta a celular, tablet y computador desde el primer día, no como un ajuste posterior.',
  },
  seo,
  hosting,
  mantenimiento,
  codigo,
];

export const faqTiendas = [
  {
    question: '¿Cuánto cuesta una tienda online en Ecuador?',
    answer:
      'El plan Orbit Commerce (hasta 4 vistas, tienda completa) parte desde $500. Incluye catálogo de productos, panel de inventario y capacitación de uso; el detalle está en la página de precios.',
  },
  {
    question: '¿Cómo reciben los pedidos mis clientes?',
    answer:
      'El plan Orbit Commerce incluye un botón de pedido directo a WhatsApp. Si tu negocio necesita una pasarela de pago integrada, lo evaluamos según tu caso.',
  },
  {
    question: '¿Puedo gestionar yo el inventario?',
    answer: 'Sí, el plan incluye panel de gestión de inventario y capacitación de uso de la plataforma.',
  },
  {
    question: '¿Puedo empezar con un catálogo chico e ir agregando productos?',
    answer:
      'Sí, el catálogo es dinámico: puedes lanzar con los productos que tengas listos y agregar o editar el resto después.',
  },
  tiempo,
  pagos,
  seo,
  hosting,
];

export const faqRediseno = [
  {
    question: '¿Pierdo mi diseño actual al optimizar?',
    answer:
      'No. Mejoramos el código y el rendimiento manteniendo tu identidad visual: no es empezar de cero, es resolver lo que te está frenando.',
  },
  {
    question: '¿Qué tipo de problemas resuelven?',
    answer:
      'Carga lenta, código desordenado, mala experiencia en celular y plugins pesados, que son los más comunes en sitios hechos con constructores o sin mantenimiento.',
  },
  {
    question: '¿Cómo sé si mi página web es lenta?',
    answer:
      'Puedes medirla gratis en Google PageSpeed Insights escribiendo tu dirección web. Si el resultado en celular es bajo o la página tarda en mostrarse, hay margen de mejora y podemos revisarla contigo.',
  },
  {
    question: '¿Cuánto cuesta rediseñar o optimizar mi página?',
    answer:
      'Depende del estado de tu sitio y de lo que haya que cambiar, por eso se cotiza caso por caso. Escríbenos por WhatsApp con la dirección de tu web y te orientamos.',
  },
  tiempo,
  mantenimiento,
  seo,
];

export const faqUiux = [
  {
    question: '¿Qué es el diseño UI/UX?',
    answer:
      'UX es cómo funciona tu sitio para quien lo usa: que encuentre lo que busca y sepa qué hacer. UI es cómo se ve: colores, tipografía y componentes. Juntos hacen que una visita se convierta en una consulta.',
  },
  {
    question: '¿En qué se diferencia del diseño web?',
    answer:
      'El diseño UI/UX define la estructura y la experiencia; el desarrollo web la construye en código. En FS Orbit trabajamos ambas partes juntas, así lo diseñado se ve igual al publicarlo.',
  },
  {
    question: '¿Hacen prototipos antes de programar?',
    answer:
      'Sí, el servicio incluye prototipado: puedes ver y probar cómo funcionará el sitio antes de que se desarrolle, y ajustar a tiempo lo que no convenza.',
  },
  {
    question: '¿Puedo contratar solo el diseño, sin el desarrollo?',
    answer:
      'Escríbenos con tu caso y lo evaluamos. Lo habitual es diseñar y desarrollar en el mismo proyecto, porque así se evitan diferencias entre el diseño y el sitio final.',
  },
  tiempo,
  pagos,
  seo,
];

export const faqMantenimiento = [
  {
    question: '¿Qué incluye el mantenimiento web?',
    answer:
      'Corrección de errores, actualizaciones y parches de seguridad, soporte técnico y respaldos diarios. Está pensado para que tu sitio nunca deje de estar online.',
  },
  {
    question: '¿Por qué necesita mantenimiento una web que ya está terminada?',
    answer:
      'Porque el software que la sostiene recibe correcciones de seguridad con frecuencia y un sitio sin actualizar queda expuesto. Los respaldos permiten recuperarlo rápido si algo falla.',
  },
  {
    question: '¿Mantienen páginas que no hicieron ustedes?',
    answer:
      'Cuéntanos con qué tecnología está hecha tu página y te decimos si podemos hacernos cargo. Escríbenos por WhatsApp con la dirección de tu web.',
  },
  {
    question: '¿Qué pasa si mi web se cae?',
    answer:
      'Con el servicio activo, el soporte técnico revisa la causa y los respaldos diarios permiten restaurar la versión anterior. Escríbenos por WhatsApp apenas lo notes.',
  },
  {
    question: '¿Cuánto cuesta el mantenimiento?',
    answer:
      'Depende del tamaño y la tecnología del sitio, por eso se cotiza según cada caso. Escríbenos por WhatsApp y te damos una propuesta.',
  },
  pagos,
  hosting,
];

export const faqPrecios = [
  {
    question: '¿Cuánto cuesta una página web en Ecuador?',
    answer:
      'En FS Orbit una landing page (plan Orbit Impact) parte desde $200 y una tienda online (plan Orbit Commerce) desde $500. El software a medida (Deep Space System) se cotiza según el proyecto.',
  },
  {
    question: '¿Qué significa "desde" en el precio?',
    answer:
      'Es el precio base del plan. El costo final depende del alcance exacto del proyecto: número de vistas, integraciones y contenido.',
  },
  {
    question: '¿Qué incluyen los planes?',
    answer:
      'Todos incluyen diseño propio sin plantillas, código optimizado y SEO on-page estructural. Orbit Commerce suma catálogo dinámico, panel de inventario y pedido directo por WhatsApp.',
  },
  tiempo,
  hosting,
  pagos,
  mantenimiento,
  codigo,
];
