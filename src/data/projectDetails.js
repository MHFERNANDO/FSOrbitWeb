// Contenido ampliado de cada caso (/proyectos/:slug). Regla: solo hechos
// que se pueden verificar en el sitio publicado de cada cliente (leidos
// el 2026-11-05) — nada de cifras de trafico, ventas o conversion que no
// tengamos. Las frases "el sitio indica..." son afirmaciones del propio
// cliente en su web, no mediciones nuestras.
//
// TODO(cliente): si FS Orbit tiene metricas reales de alguno de estos
// proyectos (visitas, consultas por WhatsApp, posiciones en Google),
// agregarlas al arreglo `resultado` de ese caso con su fecha y fuente.
// TODO(cliente): confirmar con cada cliente el objetivo original del
// encargo; el apartado "reto" describe el objetivo que el sitio resuelve,
// no un brief documentado.

export const projectDetails = {
  'acculab-system': {
    sector: 'Laboratorio clínico en El Batán, Cuenca',
    servicePath: '/servicios/diseno-web-cuenca',
    serviceLabel: 'Diseño web en Cuenca',
    reto: [
      'Un laboratorio clínico necesita que quien entra a su web entienda en segundos tres cosas: qué exámenes realiza, cuánto cuestan y cómo agendar. Accu-Lab tiene un catálogo amplio de exámenes y paquetes, y el sitio debía ordenarlo sin abrumar a pacientes, empresas ni médicos.',
      'Además, buena parte de las consultas de un laboratorio llegan desde el celular y terminan en una conversación. El objetivo era llevar esa conversación a WhatsApp con el menor número de pasos posible.',
    ],
    solucion: [
      'El inicio comunica la propuesta de valor de frente: laboratorio clínico en Cuenca con resultados en 24 horas, con dos acciones claras, "Agendar por WhatsApp" y "Ver precios de exámenes". Debajo se listan los exámenes más solicitados con precios referenciales visibles y un botón para cotizar cada uno.',
      'El contenido se separa por tipo de visitante: pacientes, empresas (exámenes preocupacionales y ocupacionales) y médicos (convenios). Hay una sección de paquetes de exámenes agrupados por lo que se quiere evaluar, una guía de preparación (por ejemplo, el ayuno previo a glucosa y perfil lipídico), una página de exámenes a domicilio, preguntas frecuentes y los datos de ubicación y horario.',
      'El sitio incluye marcado schema.org para que los buscadores entiendan que es un laboratorio clínico ubicado en Cuenca.',
    ],
    tecnologias: [
      'HTML, CSS y JavaScript propios, sin WordPress ni constructores de páginas.',
      'Marcado schema.org para buscadores.',
      'Enlaces directos a WhatsApp para agendar y cotizar.',
    ],
    resultado: [
      'El sitio publicado indica resultados en 24 horas en la mayoría de exámenes, atención sin cita previa y toma de muestras a domicilio en Cuenca.',
      'Publica su horario (lunes a viernes de 07:00 a 18:00 y sábados de 08:00 a 13:00), su dirección en Consultorios El Batán y los precios referenciales de los exámenes más solicitados.',
      'Aún no tenemos métricas de tráfico ni de consultas del cliente para publicar; preferimos no inventarlas.',
    ],
  },

  'gravity-studio': {
    sector: 'Estudio creativo de marketing y producción audiovisual en Cuenca',
    servicePath: '/servicios/diseno-web-cuenca',
    serviceLabel: 'Diseño web en Cuenca',
    reto: [
      'Gravity Estudio Creativo ofrece cosas muy distintas entre sí: estrategia, producción audiovisual, diseño de contenido, campañas de pauta e imagen corporativa, además de planes mensuales de redes sociales. El reto era presentar todo eso sin que se sintiera una lista interminable.',
      'Un estudio creativo también vende con su propia web: tenía que verse a la altura de lo que promete y cerrar cada sección con una forma sencilla de contactar al equipo.',
    ],
    solucion: [
      'El sitio abre con una idea fuerte, "Creatividad que desafía la gravedad", y con las cifras que el propio estudio declara (más de 100 marcas y 8 años de trayectoria). Después ordena la oferta en cinco servicios, cada uno con su botón para cotizar.',
      'Los cuatro planes de social media (Inicial, Intermedio, Avanzado y Pro) se comparan en una sola vista, con el plan más popular destacado y una aclaración honesta: son paquetes iniciales y cada negocio recibe un plan a su medida.',
      'El cierre combina un formulario donde la persona elige qué plan le interesa, el botón de WhatsApp y un asistente de chat flotante para resolver dudas rápidas.',
    ],
    tecnologias: [
      'HTML, CSS y JavaScript propios, sin plantillas ni constructores de páginas.',
      'JavaScript propio para el formulario de contacto y el asistente de chat.',
      'Enlaces directos a WhatsApp desde cada servicio y cada plan.',
    ],
    resultado: [
      'El sitio publicado presenta cinco servicios y cuatro planes en una sola página, con contacto por formulario, WhatsApp y chat.',
      'Las cifras de trayectoria que muestra (más de 100 marcas, 8 años, clientes en todo Ecuador) son declaraciones del cliente en su web.',
      'Aún no tenemos métricas de tráfico ni de consultas del cliente para publicar; preferimos no inventarlas.',
    ],
  },

  'jf-vapes-store': {
    sector: 'Tienda online con entrega en Cuenca',
    servicePath: '/servicios/tiendas-online',
    serviceLabel: 'Tiendas online en Cuenca y Ecuador',
    reto: [
      'Una tienda con un catálogo que cambia seguido y clientes que compran desde el celular necesita dos cosas: que encontrar un producto sea inmediato y que preguntar o pedir cueste un solo toque. JF Vapes necesitaba un sitio ligero que cumpliera eso sin la complejidad de una plataforma de comercio electrónico completa.',
      'Al ser un producto para adultos, el sitio también debía incluir información clara y un aviso de uso responsable.',
    ],
    solucion: [
      'El catálogo se organiza por categorías con filtros visibles (todos, por capacidad), tarjetas con el precio a la vista y un botón de detalles. Cada producto lleva a una conversación por WhatsApp, con un acceso de "asesoría directa" siempre disponible.',
      'Una franja de beneficios resume lo que el cliente quiere saber antes de comprar: envíos el mismo día en Cuenca, equipos originales con sello de seguridad y atención por WhatsApp. Las preguntas frecuentes responden qué productos se venden, dónde se entrega y qué métodos de pago se aceptan.',
    ],
    tecnologias: [
      'HTML, CSS y JavaScript propios, sin plataformas de comercio electrónico de terceros.',
      'Publicado en Vercel.',
      'Pedidos y consultas mediante WhatsApp.',
    ],
    resultado: [
      'El sitio publicado indica entregas en Cuenca, atención por WhatsApp y pagos en efectivo, transferencia bancaria y deuna!.',
      'Muestra el catálogo con precios y una sección de preguntas frecuentes con el aviso de uso responsable.',
      'Aún no tenemos métricas de ventas ni de tráfico del cliente para publicar; preferimos no inventarlas.',
    ],
  },

  'laboratorio-diesel-mg': {
    sector: 'Laboratorio de inyección diésel en Cuenca',
    servicePath: '/servicios/diseno-web-cuenca',
    serviceLabel: 'Diseño web en Cuenca',
    reto: [
      'Un taller especializado en inyección diésel vende confianza técnica. Quien busca reparar inyectores o bombas quiere saber si el taller entiende su sistema (mecánico, Common Rail, UI, UP) y con qué equipos trabaja, antes de llamar.',
      'El sitio debía traducir ese conocimiento técnico a un lenguaje claro para dueños de camiones, buses y furgones, y llevar la consulta a WhatsApp.',
    ],
    solucion: [
      'La página organiza la información en el orden en que la consulta el cliente: servicios (diagnóstico computarizado, mantenimiento y reparación de inyectores, servicio de bombas, análisis de fallas del sistema de combustible, asesoría técnica y revisión de turbos), los sistemas que atienden y una tabla de equipos de prueba con su aplicación.',
      'Cada servicio tiene su detalle, hay una sección de preguntas frecuentes y un bloque de datos del laboratorio con la dirección (Calle Vieja y Mercedes Quinde, Cuenca) y los tipos de vehículos que atienden. El sitio incluye marcado schema.org para que los buscadores lo asocien con su ubicación.',
    ],
    tecnologias: [
      'HTML, CSS y JavaScript propios, sin plantillas ni constructores de páginas.',
      'Marcado schema.org con la ubicación del laboratorio.',
      'Publicado en Vercel, con consultas por WhatsApp.',
    ],
    resultado: [
      'El sitio publicado indica diez años de trayectoria, equipo técnico y bancos de prueba propios, y atención a camiones, buses, furgones y tractocamiones.',
      'Detalla los equipos que usan, entre ellos bancos de prueba para bombas e inyectores, un simulador VP44 y un escáner OBD2.',
      'Aún no tenemos métricas de tráfico ni de consultas del cliente para publicar; preferimos no inventarlas.',
    ],
  },
};
