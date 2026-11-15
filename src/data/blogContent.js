// Cuerpo de cada articulo (intro + bloques). Se carga SOLO en BlogPost para
// no inflar el bundle de entrada; la metadata esta en blog.js.
//
// Reglas de contenido:
//  - Voz de FS Orbit: un estudio de Cuenca que trabaja cerca de cada cliente.
//    No se inventan cifras, anios de experiencia, equipos ni opiniones.
//  - Solo se citan hechos propios ya publicados: planes y precios
//    (src/data/content.js: $200 / $500 / a medida) y lo que cada sitio de
//    cliente muestra (src/data/projectDetails.js).
//  - Los enlaces internos se escriben [texto](/ruta) y los renderiza
//    src/lib/inlineLinks.jsx como <Link> reales (HTML con <a href>).
//  - bloques: { h2 } | { p } | { ul: [..] } | { ol: [..] }
//
// TODO(cliente): cuando existan resenas, cifras o casos medidos de clientes,
// citarlos aqui con fuente.

export const blogContent = [
  {
    slug: 'cuanto-cuesta-una-pagina-web-en-ecuador',
    intro:
      'Una página web no tiene un precio único: depende de qué necesitas que haga por tu negocio. Así lo calculamos nosotros en FS Orbit, qué cambia el valor y qué conviene preguntar antes de aceptar cualquier cotización.',
    body: [
      { h2: 'Empezamos por lo que tu web tiene que lograr' },
      {
        p: 'Antes de hablar de dinero, hacemos tres preguntas: qué quieres que haga la persona que entra a tu sitio, cuántas pantallas hacen falta para eso y qué contenido tienes listo. Dos páginas pueden verse parecidas y costar muy distinto, porque el trabajo está en lo que no se ve: la estructura, el código, la velocidad y cómo se encuentra en Google.',
      },
      { h2: 'Nuestros tres puntos de partida' },
      {
        ul: [
          'Orbit Impact, desde $200: una landing page con diseño propio, animaciones de aparición, código optimizado, SEO on-page y formulario de captación. Pensada para servicios profesionales que necesitan presencia y velocidad.',
          'Orbit Commerce, desde $500: tienda online de hasta 4 vistas con catálogo dinámico, botón de pedido directo a WhatsApp, panel de inventario y capacitación para que la administres tú.',
          'Deep Space System, a cotizar: software a medida, como portales, sistemas internos o aplicaciones con usuarios y base de datos.',
        ],
      },
      {
        p: 'El "desde" es literal: es el precio base del plan, y el valor final depende del alcance exacto. El detalle de cada uno está en [precios de páginas web en Ecuador](/precios).',
      },
      { h2: 'Qué mueve el valor de un proyecto' },
      {
        ul: [
          'Número de vistas: una página no es lo mismo que una tienda con catálogo.',
          'Diseño a medida o adaptado de una plantilla: lo primero lleva más trabajo y da un resultado que solo es tuyo.',
          'Contenido: textos, fotos y precios listos aceleran el proyecto; crearlos lo amplía.',
          'Integraciones: conectar con otras herramientas o con una pasarela de pago suma trabajo.',
          'Dominio y hosting: son servicios anuales de otro proveedor. En FS Orbit van aparte del precio del diseño, y te decimos qué contratar antes de empezar.',
        ],
      },
      { h2: 'Por qué no trabajamos con plantillas' },
      {
        p: 'Una plantilla baja el costo inicial, pero el diseño y el código los comparten muchos sitios, y casi siempre traen funciones que nunca vas a usar. Eso se nota en la velocidad y en cómo se ve tu marca. Nosotros escribimos el sitio para tu negocio y solo incluimos lo necesario; es la base de nuestro servicio de [diseño de páginas web en Cuenca](/servicios/diseno-web-cuenca).',
      },
      { h2: 'Lo que realmente se pide en la práctica' },
      {
        p: 'Mirando los sitios que hemos publicado, cada uno resolvió algo distinto. Un laboratorio clínico necesitaba mostrar exámenes, precios referenciales y agendar por WhatsApp. Una tienda necesitaba un catálogo claro y pedidos directos. Un taller de inyección diésel necesitaba explicar sus servicios y equipos. Puedes verlos en el [portafolio](/proyectos). Ninguno partió de "una página bonita", sino de una tarea concreta del negocio.',
      },
      { h2: 'Preguntas para comparar cotizaciones' },
      {
        ol: [
          '¿Qué incluye exactamente y qué queda fuera?',
          '¿El diseño es propio o parte de una plantilla?',
          '¿Quién conserva el código y la cuenta del dominio al terminar?',
          '¿Está incluido el SEO básico (títulos, descripciones, estructura y velocidad)?',
          '¿Cómo se ve y funciona en celular?',
          '¿Cómo se atienden los cambios y el soporte después de la entrega?',
        ],
      },
      {
        p: 'Con esas respuestas por escrito puedes comparar propuestas aunque sus precios sean muy distintos: muchas veces la diferencia está en lo que una incluye y la otra no. Para lo que viene después de lanzar, mira cómo funciona el [mantenimiento web](/servicios/mantenimiento-web).',
      },
      { h2: 'Cómo pedir una cotización' },
      {
        p: 'Cuéntanos a qué se dedica tu negocio, qué quieres que haga la página (que te escriban, que te compren, que reserven) y si ya tienes dominio, logo y fotos. Con eso te proponemos un alcance y un valor concretos. Escríbenos desde [contacto](/contacto) o por WhatsApp.',
      },
    ],
  },

  {
    slug: 'pagina-web-vs-solo-instagram',
    intro:
      'Instagram es una buena vitrina, pero no es tuyo ni te encuentra quien busca en Google. Esto es lo que cada uno hace mejor y cómo combinarlos sin gastar de más.',
    body: [
      { h2: 'Lo que Instagram hace bien' },
      {
        p: 'Mostrar tu trabajo, mantener cerca a tus clientes y responder mensajes rápido. Empezar es gratis y no requiere nada técnico. Si estás arrancando, un perfil cuidado es un primer paso válido y no hay que despreciarlo.',
      },
      { h2: 'Lo que se queda corto' },
      {
        ul: [
          'Que te encuentren en Google: quien busca "laboratorio clínico en Cuenca" o "taller de inyección diésel" en el buscador difícilmente llega a un perfil de red social. Una página propia sí aparece.',
          'Información ordenada: precios, servicios, preguntas frecuentes y ubicación en un solo lugar, sin que el cliente tenga que revisar publicaciones antiguas.',
          'Control: las reglas, el alcance y el diseño de una plataforma ajena cambian cuando ella decide, no cuando tú lo necesitas.',
          'Una dirección propia para tu tarjeta, tu factura, tu firma de correo y tu ficha de Google Maps.',
        ],
      },
      { h2: 'Ejemplos de cosas que una web resuelve mejor' },
      {
        p: 'En los sitios que hemos construido, la web cumple tareas que un perfil no hace bien. El de un laboratorio clínico de Cuenca ordena sus exámenes con precios referenciales y explica cómo prepararse, por ejemplo el ayuno antes de ciertos análisis. La tienda de JF Vapes muestra su catálogo por categorías con precios visibles y manda cada consulta a WhatsApp. El taller Laboratorio Diesel MG explica sus servicios y los equipos con los que trabaja. Puedes revisarlos en el [portafolio](/proyectos).',
      },
      { h2: 'No es uno o el otro' },
      {
        p: 'Lo que mejor funciona es que se apoyen entre sí. Instagram atrae y genera confianza con contenido; la web recibe a quien quiere más información y lo lleva a escribirte. Cada publicación puede enviar a una página donde el cliente encuentre lo que necesita, y esa página debe cargar rápido en el celular.',
      },
      { h2: 'Qué debería tener tu primera página' },
      {
        p: 'No hace falta empezar con un sitio enorme. Una primera página efectiva explica qué haces y para quién, muestra tus servicios o productos principales, responde las dudas más repetidas, indica dónde estás o a qué zonas atiendes y ofrece un botón visible para escribirte por WhatsApp. Con eso ya tienes algo que compartir, que Google puede leer y que trabaja cuando tú no estás respondiendo mensajes.',
      },
      { h2: 'Señales de que ya necesitas una web' },
      {
        ul: [
          'Respondes siempre las mismas preguntas (precios, horarios, ubicación) una por una.',
          'Quieres que te encuentren personas que todavía no te conocen.',
          'Vendes algo que se decide con más información que una foto.',
          'Quieres aparecer en Google Maps y necesitas un destino propio al que apuntar.',
          'Quieres dar una imagen más profesional a clientes nuevos.',
        ],
      },
      { h2: 'Cómo se combinan en la práctica' },
      {
        ul: [
          'Pon el enlace de tu web en la biografía de Instagram y en cada publicación que hable de un servicio o un precio.',
          'Usa Instagram para mostrar el día a día y las novedades; deja en la web lo que no cambia: servicios, preguntas frecuentes y formas de contacto.',
          'Mantén el mismo nombre, logo y colores en ambos lugares para que el cliente reconozca que es el mismo negocio.',
          'Pide que quien te escriba por WhatsApp desde la web te diga de dónde viene; así sabes qué canal te trae clientes.',
        ],
      },
      { h2: 'Con qué empezar' },
      {
        p: 'Si lo tuyo es que te contacten, una landing page de una sola página es suficiente y parte desde $200 con el plan Orbit Impact. Si vendes productos y necesitas catálogo, el camino es una [tienda online](/servicios/tiendas-online), desde $500. Todo el detalle está en [precios](/precios), y si prefieres contarnos tu caso primero, escríbenos desde [contacto](/contacto).',
      },
    ],
  },

  {
    slug: 'como-aparecer-en-google-maps-cuenca',
    intro:
      'Cuando alguien busca algo cerca de él, Google muestra primero un mapa con negocios. Aparecer ahí es gratis, pero depende de crear tu ficha, verificarla y mantenerla coherente con tu página web. Estos son los pasos.',
    body: [
      { h2: 'Qué es tu ficha de Google' },
      {
        p: 'Se llama Perfil de Negocio de Google y es la tarjeta que sale en Maps y en el buscador con tu nombre, dirección, teléfono, horario, fotos y reseñas. Se administra con una cuenta de Google y no cuesta nada. Es la base de lo que se conoce como SEO local.',
      },
      { h2: 'Paso a paso para crearla' },
      {
        ol: [
          'Entra a business.google.com con la cuenta de Google con la que quieras administrar el negocio.',
          'Escribe el nombre real de tu negocio, tal como lo ven tus clientes en el local o en tu publicidad.',
          'Elige la categoría principal que mejor te describa; es una de las decisiones que más influye en qué búsquedas apareces.',
          'Indica si los clientes van a un local o si atiendes en su domicilio. Si es a domicilio, define las zonas que cubres.',
          'Completa dirección, teléfono y sitio web.',
          'Verifica el negocio con el método que Google te muestre en pantalla.',
        ],
      },
      { h2: 'Qué completar con cuidado' },
      {
        ul: [
          'Horario real, y avisar los cambios en feriados.',
          'Descripción clara de lo que haces, sin repetir palabras clave.',
          'Fotos propias del local y de tu trabajo; las reales generan más confianza que las genéricas.',
          'Servicios o productos con su descripción y, si puedes publicarlos, sus precios.',
          'Enlace a tu página web y a tu WhatsApp.',
        ],
      },
      { h2: 'Tus datos deben coincidir en todas partes' },
      {
        p: 'Nombre, dirección y teléfono deben escribirse igual en Google, en tu web, en Instagram y en cualquier directorio. Si un lugar dice "Av." y otro "Avenida", o conserva un teléfono viejo, Google duda de cuál es el correcto. Es un detalle pequeño que pesa.',
      },
      { h2: 'Reseñas' },
      {
        p: 'Las opiniones ayudan a otras personas a decidir y Google las considera al ordenar los resultados. Pídelas a clientes reales que quedaron conformes, responde con educación (también las malas) y nunca las compres ni las inventes: va contra las reglas de Google y puede costarte la ficha.',
      },
      { h2: 'Por qué la ficha necesita una web que la respalde' },
      {
        p: 'La ficha muestra lo básico. Tu página permite explicar cada servicio con detalle, publicar preguntas frecuentes y aparecer en búsquedas que no son de mapa; además es el destino del botón "Sitio web". Un ejemplo es el sitio de un laboratorio clínico de Cuenca que publica su dirección, su horario, sus exámenes con precios referenciales y la opción de toma de muestras a domicilio, en la misma página que Google enlaza desde su ficha. Puedes verlo, junto a otros, en el [portafolio](/proyectos). Si quieres algo así para tu negocio, mira el servicio de [diseño de páginas web en Cuenca](/servicios/diseno-web-cuenca).',
      },
      { h2: 'Errores frecuentes' },
      {
        ul: [
          'Registrar la ficha con un nombre distinto al real, agregando palabras clave de más.',
          'No verificarla y dejarla a medias.',
          'Dejar horarios o teléfonos desactualizados.',
          'No responder reseñas ni mensajes.',
          'Tener dos fichas para el mismo negocio.',
        ],
      },
      { h2: 'Cuánto tarda en notarse' },
      {
        p: 'No hay un plazo garantizado: depende de la competencia en tu rubro y de qué tan completa y activa esté tu ficha. Lo que sí controlas es tenerla verificada, completa y coherente con tu web.',
      },
      { h2: 'Después de crearla' },
      {
        p: 'Revisa tu ficha cada cierto tiempo: si cambias de horario, de teléfono o agregas un servicio, actualízalo en Google y en tu web el mismo día. Publica fotos nuevas de vez en cuando y responde los mensajes que lleguen desde el perfil. Una ficha activa transmite que el negocio está vivo.',
      },
      { h2: 'Siguiente paso' },
      {
        p: 'Si ya tienes ficha pero no tienes web, o tu web quedó desactualizada, podemos ayudarte a que ambas se refuercen. Conoce los [precios de los planes](/precios) o escríbenos desde [contacto](/contacto).',
      },
    ],
  },

  {
    slug: 'pagina-web-para-clinica-o-laboratorio-en-cuenca',
    intro:
      'Quien busca un laboratorio, un médico o una clínica en Cuenca casi siempre lo hace desde el celular y con una duda concreta: si atienden lo que necesita, cuánto cuesta, a qué hora abren y cómo sacar una cita. Una buena página web responde esas cuatro cosas antes de que la persona tenga que escribir.',
    body: [
      { h2: '¿Qué busca un paciente antes de escribirte?' },
      {
        p: 'Las preguntas se repiten en casi todos los consultorios y laboratorios: qué servicios o exámenes hacen, si necesitan cita previa, cuánto cuesta, cómo prepararse, dónde quedan y en qué horario atienden. Si tu web lo dice claro, el paciente llega a WhatsApp con la decisión casi tomada, y tu recepción deja de contestar lo mismo una y otra vez.',
      },
      { h2: '¿Qué secciones debe tener la página?' },
      {
        ul: [
          'Un inicio que diga en una frase qué eres y dónde estás, por ejemplo "laboratorio clínico en Cuenca", con un botón visible para agendar por WhatsApp.',
          'Servicios o exámenes ordenados por lo que el paciente busca, no por nombres técnicos internos.',
          'Precios referenciales cuando puedas publicarlos. Si varían, una frase honesta que diga de qué dependen.',
          'Preparación: ayuno, documentos o indicaciones previas, explicadas en lenguaje sencillo.',
          'Dirección, horario, mapa y teléfono, escritos igual que en tu ficha de Google.',
          'Preguntas frecuentes con respuestas cortas.',
        ],
      },
      { h2: '¿Conviene separar pacientes, empresas y médicos?' },
      {
        p: 'Si atiendes a públicos distintos, sí. Una persona que busca un examen de sangre necesita otra información que una empresa que pide exámenes ocupacionales para su personal, o un médico que quiere derivar pacientes. Darle a cada uno su propia sección evita que todos tengan que leer todo.',
      },
      { h2: '¿Cómo se ve esto en un caso real?' },
      {
        p: 'El sitio que hicimos para Accu-Lab, un laboratorio clínico en El Batán, muestra en el inicio los exámenes más solicitados con precios referenciales y dos acciones: agendar por WhatsApp y ver precios. Separa el contenido para pacientes, empresas y médicos, tiene una guía de preparación (por ejemplo el ayuno antes de glucosa y perfil lipídico), una página de exámenes a domicilio y publica su horario y dirección. El detalle está en el [caso de Accu-Lab](/proyectos/acculab-system).',
      },
      { h2: '¿Por qué WhatsApp y no un formulario largo?' },
      {
        p: 'Muchos pacientes prefieren escribir por WhatsApp antes que llenar datos, y un formulario largo se abandona en el celular. Lo que mejor funciona es un botón que abra la conversación con un mensaje ya escrito, por ejemplo "Hola, quisiera agendar un examen de glucosa". Así sabes desde el primer mensaje qué necesita la persona.',
      },
      { h2: '¿Qué cuidar con los datos de salud?' },
      {
        p: 'La página pública no debería pedir diagnósticos, resultados ni datos sensibles. Esa información se maneja por canales privados y con el consentimiento del paciente. La web sirve para orientar y para abrir la conversación; si algún día necesitas entregar resultados en línea, eso es un sistema aparte, con usuarios y claves, que se diseña con otras reglas de seguridad.',
      },
      { h2: '¿Cómo te encuentran en Google?' },
      {
        ol: [
          'Ten tu Perfil de Negocio de Google verificado y con el enlace a tu web. La guía paso a paso está en [cómo aparecer en Google Maps en Cuenca](/blog/como-aparecer-en-google-maps-cuenca).',
          'Usa en tu web las palabras que usa el paciente: "laboratorio clínico en Cuenca", "examen de sangre a domicilio", "consultorio de ginecología en Cuenca".',
          'Escribe una página o sección por cada servicio importante, en vez de una lista sin explicación.',
          'Haz que la página cargue rápido en celular: es donde suelen buscar los pacientes.',
        ],
      },
      { h2: '¿Cuánto cuesta y por dónde empezar?' },
      {
        p: 'Un consultorio con pocos servicios puede empezar con una landing page, desde $200 con el plan Orbit Impact. Un laboratorio con un catálogo grande de exámenes y paquetes suele necesitar varias páginas, y se cotiza según el alcance. El dominio y el hosting van aparte. Mira el detalle en [precios](/precios) o el servicio de [diseño de páginas web en Cuenca](/servicios/diseno-web-cuenca), y cuéntanos tu caso desde [contacto](/contacto).',
      },
    ],
  },

  {
    slug: 'pagina-web-para-inmobiliaria-en-cuenca',
    intro:
      'Una inmobiliaria vive de sus fichas: cada casa, departamento o terreno tiene que verse bien, cargar rápido y llevar a una conversación. Portales y redes ayudan, pero una web propia te permite mostrar tus propiedades a tu manera y aparecer en Google con tu nombre.',
    body: [
      { h2: '¿Por qué una web propia si ya publico en portales?' },
      {
        p: 'En un portal tu propiedad compite en la misma pantalla con las de otras inmobiliarias, y el diseño, las reglas y los contactos los controla el portal. En tu web, quien entra ve solo tu catálogo, con tu marca, y te escribe a ti. Lo ideal es usar ambos: el portal para alcance y tu web como el lugar donde está todo tu inventario ordenado.',
      },
      { h2: '¿Qué debe tener cada ficha de propiedad?' },
      {
        ul: [
          'Precio, o la frase "precio a consultar" si prefieres no publicarlo.',
          'Sector y referencia de ubicación, por ejemplo "Challuabamba" o "cerca del Parque de la Madre", sin exponer la dirección exacta si no quieres.',
          'Metros de terreno y de construcción, dormitorios, baños y parqueaderos.',
          'Fotos propias, ordenadas: fachada, áreas sociales, dormitorios, baños y vista.',
          'Un mapa aproximado del sector.',
          'Un botón de WhatsApp que mande el código o nombre de la propiedad en el mensaje.',
        ],
      },
      { h2: '¿Cómo deben ser los filtros?' },
      {
        p: 'Pocos y útiles: venta o arriendo, tipo (casa, departamento, terreno, local), sector y rango de precio. Más filtros que propiedades confunden. Si tu inventario es corto, a veces basta con separar venta y arriendo y mostrar todo en una sola lista.',
      },
      { h2: '¿Las fotos hacen lenta la página?' },
      {
        p: 'Pueden hacerlo si se suben tal como salen de la cámara. Cada foto debe guardarse en un formato liviano y en varios tamaños, para que el celular descargue solo la versión que necesita. Así una galería de veinte fotos no tarda en abrir, y Google valora que la página cargue rápido.',
      },
      { h2: '¿Cómo aparecer en Google por sector?' },
      {
        ol: [
          'Escribe el sector en el título de cada ficha: "Casa en venta en Misicata, Cuenca" dice más que "Casa moderna".',
          'Crea páginas por zona o tipo si tienes varias propiedades en ellas, por ejemplo "departamentos en arriendo en el centro de Cuenca".',
          'Da a cada propiedad su propia dirección web, que se pueda compartir y que Google pueda leer.',
          'Ten tu ficha de Google Maps verificada y con el enlace a tu web; mira [cómo aparecer en Google Maps en Cuenca](/blog/como-aparecer-en-google-maps-cuenca).',
        ],
      },
      { h2: '¿Qué pasa con las propiedades vendidas?' },
      {
        p: 'No las borres de golpe. Si una ficha ya recibe visitas desde Google, márcala como vendida o arrendada y sugiere propiedades parecidas; o redirige su dirección a la lista del mismo sector. Borrarla deja un enlace roto y se pierde lo que esa página había ganado en el buscador.',
      },
      { h2: '¿Quién actualiza el catálogo?' },
      {
        p: 'Tú, sin depender de nosotros para cada cambio. Para eso la web necesita un panel donde subas una propiedad, cambies su precio o la marques como vendida. Es lo mismo que hace el panel de inventario de una [tienda online](/servicios/tiendas-online), aplicado a propiedades.',
      },
      { h2: '¿Cuánto cuesta y por dónde empezar?' },
      {
        p: 'Si tienes pocas propiedades, puedes empezar con una página que las muestre todas y un botón de WhatsApp, desde $200. Un catálogo con panel de administración y filtros se parece más a una tienda online, que parte desde $500. El dominio y el hosting van aparte. Revisa los [precios](/precios) o escríbenos desde [contacto](/contacto) con el número de propiedades que manejas.',
      },
    ],
  },
];

export const getPostContent = (slug) => blogContent.find((p) => p.slug === slug);
