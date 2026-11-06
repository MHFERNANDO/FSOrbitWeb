// Contenido de las 5 paginas /servicios/* (se carga SOLO en Servicio.jsx;
// la metadata vive en servicePages.js para no inflar el bundle de entrada).
//
// Regla: lo que se afirma de FS Orbit sale de src/data/content.js (planes,
// precios, caracteristicas de cada servicio). El resto es explicacion
// general del tema, sin cifras ni resultados inventados.
//
// Los enlaces internos se escriben [texto](/ruta) y se renderizan como
// <Link> reales (ver src/lib/inlineLinks.jsx).
import { faqDisenoWeb, faqTiendas, faqRediseno, faqUiux, faqMantenimiento } from './faq.js';

export const serviceContent = [
  {
    slug: 'diseno-web-cuenca',
    kicker: 'Diseño Web — Cuenca, Ecuador',
    h1Segments: [{ text: 'Páginas web' }, { break: true }, { text: 'diseñadas en Cuenca.', highlight: true }],
    intro:
      'Diseñamos y desarrollamos sitios web a medida para negocios en Cuenca y el resto de Ecuador: landing pages, sitios corporativos y presencia digital construida con código propio, sin plantillas de WordPress o constructores.',
    highlights: [
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
    ],
    sections: [
      {
        h2: 'Qué incluye una página web de FS Orbit',
        paragraphs: [
          'Cada proyecto parte de una pregunta simple: qué quieres que haga la persona que entra a tu sitio. Escribirte por WhatsApp, reservar, comprar o entender un servicio. Desde ahí definimos la estructura, el diseño y los textos para que ese camino sea corto y claro, tanto en celular como en computador.',
          'El plan de entrada, Orbit Impact, incluye una landing page con diseño de autor (sin plantillas), animaciones de aparición, optimización de código, SEO on-page estructural y un formulario de captación. Parte desde $200; en la página de [precios](/precios) está el detalle completo y cómo se escala a una tienda o a un sistema a medida.',
        ],
      },
      {
        h2: 'Por qué importa que sea a medida',
        paragraphs: [
          'Una plantilla comparte diseño y código con miles de sitios, y suele traer funciones que nunca vas a usar. Eso se nota en la velocidad y en la imagen de tu marca. Escribir el sitio a medida nos permite incluir solo lo necesario, cuidar la estructura que leen los buscadores y adaptar cada sección a tu negocio.',
          'Esto también facilita el SEO técnico: títulos y descripciones por página, jerarquía de encabezados correcta, datos estructurados y tiempos de carga bajos, que son la base para aparecer en Google cuando alguien busca lo que haces en Cuenca.',
        ],
      },
      {
        h2: 'Para qué tipo de negocios',
        paragraphs: [
          'Trabajamos con servicios profesionales, laboratorios, talleres, estudios creativos, comercios y emprendimientos. Puedes ver cómo quedó el sitio de un [laboratorio clínico en Cuenca](/proyectos/acculab-system) o el de un [estudio creativo](/proyectos/gravity-studio) en nuestro portafolio.',
          'Si tu negocio ya tiene una web pero es lenta o está desactualizada, revisa el servicio de [rediseño y optimización](/servicios/rediseno-y-optimizacion). Y si lo que necesitas es vender productos, mira las [tiendas online](/servicios/tiendas-online).',
        ],
      },
    ],
    projects: ['acculab-system', 'gravity-studio'],
    faq: faqDisenoWeb,
    ctaWhatsappText: 'Quiero cotizar una página web en Cuenca',
  },

  {
    slug: 'diseno-ui-ux',
    kicker: 'Diseño UI/UX — Ecuador',
    h1Segments: [{ text: 'Diseño UI/UX que' }, { break: true }, { text: 'convierte visitas.', highlight: true }],
    intro:
      'Diseñamos interfaces claras y modernas, centradas en quien las usa. No se trata solo de que tu sitio se vea bien: se trata de que la persona entienda rápido qué ofreces y sepa exactamente qué hacer a continuación.',
    highlights: [
      {
        icon: 'layout',
        title: 'Prototipado',
        text: 'Antes de programar, puedes ver y probar cómo funcionará el sitio y ajustar lo que no convenza.',
      },
      {
        icon: 'target',
        title: 'Experiencia de usuario',
        text: 'Estructura, textos y llamadas a la acción pensadas para que la visita se convierta en una consulta.',
      },
    ],
    sections: [
      {
        h2: 'Qué es UI y qué es UX',
        paragraphs: [
          'UX (experiencia de usuario) es cómo funciona tu sitio para quien lo usa: si encuentra lo que busca, si entiende los pasos y si puede contactarte sin esfuerzo. UI (interfaz de usuario) es cómo se ve: colores, tipografía, botones, espaciados y componentes. Una buena interfaz sin una buena experiencia se ve bonita pero no vende; una buena experiencia con una interfaz descuidada genera desconfianza.',
          'En FS Orbit trabajamos las dos partes juntas y dentro del mismo proyecto de [diseño web en Cuenca](/servicios/diseno-web-cuenca). Así, lo que se diseña es exactamente lo que se programa, sin diferencias entre el prototipo y el sitio publicado.',
        ],
      },
      {
        h2: 'Cómo trabajamos el diseño',
        paragraphs: [
          'Empezamos por entender tu negocio y a tu cliente: quién llega a tu web, desde dónde y qué necesita saber para decidir. Con eso ordenamos el contenido, definimos el recorrido de la página y construimos un prototipo para que puedas verlo antes de que se desarrolle.',
          'Después se aplica la identidad visual: tipografía legible, contrastes adecuados, jerarquía clara entre títulos y textos y botones que se distinguen del resto. Cuidamos que todo funcione bien en pantallas pequeñas, porque la mayoría de las visitas a un negocio local llegan desde el celular.',
        ],
      },
      {
        h2: 'Qué mejora un buen diseño',
        paragraphs: [
          'Un diseño bien resuelto reduce las dudas: el visitante entiende de inmediato qué haces, ve tus precios o formas de contacto sin buscarlos y encuentra un botón claro para escribirte por WhatsApp. Eso suele ser la diferencia entre una visita que se va y una consulta que llega.',
          'También ayuda al posicionamiento. Un sitio ordenado, con encabezados lógicos, textos claros y buena velocidad es más fácil de entender para Google y para las herramientas de inteligencia artificial que resumen páginas web.',
        ],
      },
      {
        h2: 'Qué puedes esperar',
        paragraphs: [
          'Un proceso transparente: ves el prototipo, das tu opinión y ajustamos antes de construir. Si ya tienes un sitio y sientes que no comunica bien, podemos revisar su estructura dentro de un proyecto de [rediseño y optimización](/servicios/rediseno-y-optimizacion). Para ver el resultado en sitios reales, revisa nuestro [portafolio](/proyectos).',
        ],
      },
    ],
    projects: ['gravity-studio', 'jf-vapes-store'],
    faq: faqUiux,
    ctaWhatsappText: 'Quiero cotizar un diseño UI/UX para mi sitio web',
  },

  {
    slug: 'tiendas-online',
    kicker: 'E-commerce — Ecuador',
    h1Segments: [{ text: 'Tiendas online que' }, { break: true }, { text: 'venden 24/7.', highlight: true }],
    intro:
      'Construimos e-commerce a medida para negocios en Cuenca y en todo Ecuador: catálogo de productos, gestión de inventario y pedidos directos, sin depender de plantillas genéricas.',
    highlights: [
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
    ],
    sections: [
      {
        h2: 'Qué incluye el plan Orbit Commerce',
        paragraphs: [
          'Es el plan pensado para vender por internet: hasta 4 vistas (tienda completa), catálogo de productos dinámico, botón de pedido directo a WhatsApp, panel de gestión de inventario, SEO on-page estructural y capacitación para que aprendas a usar la plataforma. Parte desde $500 y puedes ver el detalle en [precios](/precios).',
          'Un catálogo dinámico significa que puedes lanzar con los productos que tengas listos y agregar, editar o retirar el resto después, sin volver a pasar por el desarrollo.',
        ],
      },
      {
        h2: 'Pedidos por WhatsApp o pasarela de pago',
        paragraphs: [
          'En Ecuador muchos clientes prefieren cerrar la compra por WhatsApp: preguntan, confirman disponibilidad y coordinan el pago y la entrega. Por eso cada producto de tu catálogo puede llevar a una conversación ya iniciada con el detalle de lo que quieren.',
          'Si tu negocio necesita cobrar dentro de la propia tienda, se evalúa la integración de una pasarela de pago según el caso. Lo importante es elegir el flujo que menos fricción le genere a tu cliente.',
        ],
      },
      {
        h2: 'Una tienda pensada para que te encuentren',
        paragraphs: [
          'Una tienda que nadie encuentra no vende. Por eso cada página lleva sus títulos y descripciones, una estructura ordenada por categorías y tiempos de carga bajos en celular, que es desde donde compra la mayoría. Todo parte de la misma base de [diseño de páginas web en Cuenca](/servicios/diseno-web-cuenca).',
          'Un ejemplo es [JF Vapes Store](/proyectos/jf-vapes-store): un catálogo por categorías con precios visibles, preguntas frecuentes y pedidos por WhatsApp, con entrega en Cuenca. Si ya tienes una tienda y funciona lenta, revisa también el servicio de [rediseño y optimización](/servicios/rediseno-y-optimizacion).',
        ],
      },
      {
        h2: 'Después del lanzamiento',
        paragraphs: [
          'Una tienda necesita cuidado continuo: actualizaciones, respaldos y soporte si algo falla. Puedes sumarlo con el servicio de [mantenimiento web](/servicios/mantenimiento-web).',
        ],
      },
    ],
    projects: ['jf-vapes-store'],
    faq: faqTiendas,
    ctaWhatsappText: 'Quiero cotizar una tienda online',
  },

  {
    slug: 'mantenimiento-web',
    kicker: 'Mantenimiento Web — Ecuador',
    h1Segments: [{ text: 'Mantenimiento web' }, { break: true }, { text: 'para un sitio siempre activo.', highlight: true }],
    intro:
      'Protegemos tu inversión con soporte técnico continuo: corrección de errores, actualizaciones de seguridad y respaldos constantes para que tu sitio nunca deje de estar online.',
    highlights: [
      {
        icon: 'shield',
        title: 'Parches de seguridad',
        text: 'Actualizaciones para mantener el sitio protegido frente a fallas conocidas.',
      },
      {
        icon: 'bolt',
        title: 'Soporte y backup diario',
        text: 'Atención técnica cuando algo falla y respaldos diarios para recuperar tu sitio rápido.',
      },
    ],
    sections: [
      {
        h2: 'Por qué un sitio terminado sigue necesitando mantenimiento',
        paragraphs: [
          'Una página web no es un folleto impreso: funciona sobre software que recibe correcciones con frecuencia. Si nadie lo actualiza, aparecen errores, el sitio se vuelve lento y queda expuesto a fallas de seguridad ya conocidas. Lo más costoso no es el mantenimiento, sino el día en que tu página se cae y no sabes a quién llamar.',
          'Con un servicio de mantenimiento, alguien está pendiente de que tu sitio siga funcionando después del lanzamiento, y tú te dedicas a atender a tus clientes.',
        ],
      },
      {
        h2: 'Qué incluye el servicio',
        paragraphs: [
          'Tres pilares: parches de seguridad, soporte técnico y backup diario. Los parches mantienen el sitio actualizado; el soporte resuelve errores y dudas cuando aparecen; y los respaldos diarios permiten volver a una versión anterior si algo sale mal, de modo que un error no se convierta en pérdida de información.',
          'El mantenimiento aplica a sitios que hicimos nosotros y, según el caso, a sitios hechos por otros. Cuéntanos cómo está construido el tuyo y evaluamos si podemos hacernos cargo.',
        ],
      },
      {
        h2: 'Para quién es útil',
        paragraphs: [
          'Para negocios que dependen de su página para recibir consultas o ventas: una [tienda online](/servicios/tiendas-online) que no puede estar caída, un sitio de servicios que recibe clientes por Google o una web que quedó sin nadie que la atienda. Si además notas que tu sitio está lento, el servicio de [rediseño y optimización](/servicios/rediseno-y-optimizacion) se enfoca en mejorar el código y la experiencia móvil.',
          'Puedes ver los trabajos que hemos publicado en el [portafolio](/proyectos) y consultar los planes de desarrollo en [precios](/precios). El mantenimiento se cotiza según el tamaño y la tecnología del sitio.',
        ],
      },
      {
        h2: 'Cómo empezar',
        paragraphs: [
          'Escríbenos por WhatsApp con la dirección de tu página y una breve descripción de lo que necesitas. Revisamos el sitio y te proponemos un plan de mantenimiento acorde a tu caso, sin compromiso.',
        ],
      },
    ],
    projects: ['laboratorio-diesel-mg', 'acculab-system'],
    faq: faqMantenimiento,
    ctaWhatsappText: 'Quiero cotizar el mantenimiento de mi página web',
  },

  {
    slug: 'rediseno-y-optimizacion',
    kicker: 'Rediseño & Optimización',
    h1Segments: [{ text: 'Tu web lenta,' }, { break: true }, { text: 'rediseñada y rápida.', highlight: true }],
    intro:
      '¿Tu página web se quedó en el pasado? Transformamos sitios lentos y antiguos en plataformas rápidas y modernas, mejorando el código y la experiencia móvil sin perder tu esencia de marca.',
    highlights: [
      {
        icon: 'bolt',
        title: 'Optimización & Upgrade',
        text: 'Mejora de rendimiento, rediseño adaptativo y limpieza de código para que tu sitio cargue mejor y se vea bien en cualquier pantalla.',
      },
      {
        icon: 'shield',
        title: 'Mantenimiento Web',
        text: 'Protegemos tu inversión con soporte técnico continuo, actualizaciones de seguridad y respaldos constantes.',
      },
    ],
    sections: [
      {
        h2: 'Señales de que tu web necesita una renovación',
        paragraphs: [
          'Tarda en cargar, se ve mal en el celular, cuesta encontrar tus datos de contacto o depende de plugins que ya nadie actualiza. También puede pasar que el diseño ya no represente al negocio que eres hoy. Una página así pierde visitas antes de que lean una sola línea.',
          'Una forma sencilla de empezar es medir tu sitio gratis en Google PageSpeed Insights, que te da un diagnóstico de velocidad en celular y computador. Si el resultado es bajo, hay margen de mejora.',
        ],
      },
      {
        h2: 'Qué hacemos en un proyecto de optimización',
        paragraphs: [
          'Revisamos el estado actual del sitio y definimos qué conservar y qué cambiar. Los trabajos más comunes son mejorar el rendimiento (WPO), rediseñar de forma adaptativa para que funcione bien en cualquier pantalla y limpiar el código para quitar lo que sobra, como plugins pesados o estilos duplicados.',
          'El objetivo es resolver lo que te está frenando sin empezar de cero: mantenemos tu identidad visual y mejoramos la base técnica. Si el sitio necesita reconstruirse, lo hablamos de forma abierta contigo antes de empezar.',
        ],
      },
      {
        h2: 'Por qué la velocidad y el móvil importan',
        paragraphs: [
          'La mayoría de las personas visita una web desde el celular y, si tarda, se va. Además, Google tiene en cuenta la experiencia de la página al decidir qué mostrar. Mejorar la velocidad y la visualización móvil beneficia a tus visitantes y a tu posicionamiento a la vez.',
          'Si prefieres construir un sitio nuevo en lugar de renovar el actual, conoce nuestro servicio de [diseño de páginas web en Cuenca](/servicios/diseno-web-cuenca) o revisa los [precios](/precios).',
        ],
      },
      {
        h2: 'Después de la mejora',
        paragraphs: [
          'Una vez optimizado, conviene mantenerlo al día. Con el servicio de [mantenimiento web](/servicios/mantenimiento-web) cuidamos que no vuelvan los problemas. Puedes ver trabajos terminados en el [portafolio](/proyectos).',
        ],
      },
    ],
    projects: ['laboratorio-diesel-mg', 'gravity-studio'],
    faq: faqRediseno,
    ctaWhatsappText: 'Quiero optimizar mi página web actual',
  },
];

export const getServiceContent = (slug) => serviceContent.find((s) => s.slug === slug);
