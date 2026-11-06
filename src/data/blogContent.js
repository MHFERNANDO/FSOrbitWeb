// Cuerpo de cada articulo (intro + bloques). Se carga SOLO en BlogPost para
// no inflar el bundle de entrada; la metadata esta en blog.js.
//
// Reglas de contenido:
//  - Nada de cifras, estudios ni estadisticas que no podamos citar. Cuando
//    hace falta un numero, es un precio publicado de FS Orbit
//    (src/data/content.js: $200 / $500 / a medida).
//  - Los enlaces internos se escriben [texto](/ruta) y los renderiza
//    src/lib/inlineLinks.jsx como <Link> reales (HTML con <a href>).
//  - bloques: { h2 } | { p } | { ul: [..] } | { ol: [..] }
//
// TODO(cliente): si FS Orbit tiene casos o datos reales de clientes que
// mejoraron su posicionamiento o sus consultas, citarlos aqui con fuente.

export const blogContent = [
  {
    slug: 'cuanto-cuesta-una-pagina-web-en-ecuador',
    intro:
      'No existe un precio único para una página web: depende de lo que necesites que haga. Esta guía explica qué factores mueven el costo, qué tipos de sitio existen y qué preguntar antes de aceptar una cotización.',
    body: [
      { h2: 'El precio depende del alcance, no de la "página"' },
      {
        p: 'Dos sitios pueden verse parecidos y costar muy distinto, porque el trabajo está en lo que no se ve: cuántas pantallas tiene, si el diseño se hace a medida o se adapta de una plantilla, si hay un catálogo de productos, si se conecta con otros sistemas y quién escribe los textos. Por eso desconfía de quien te da un precio cerrado sin preguntarte nada sobre tu negocio.',
      },
      { h2: 'Los tres tipos de proyecto más comunes' },
      {
        ul: [
          'Landing page: una sola página pensada para que la visita haga una acción, por ejemplo escribirte por WhatsApp. Es el punto de entrada más económico y suficiente para muchos servicios profesionales.',
          'Sitio con varias páginas o tienda online: sirve cuando tienes varios servicios o productos y quieres aparecer en Google por cada uno. Requiere más diseño, más contenido y, en el caso de una tienda, un catálogo que puedas administrar.',
          'Software a medida: portales, sistemas internos o aplicaciones web con usuarios y base de datos. Aquí no hay precio de lista porque cada proyecto es distinto.',
        ],
      },
      { h2: 'Cuánto cuestan los planes de FS Orbit' },
      {
        p: 'Para que tengas una referencia concreta, estos son los precios base que publicamos. Son valores "desde": el costo final depende del alcance exacto del proyecto.',
      },
      {
        ul: [
          'Orbit Impact, una landing page con diseño propio y SEO on-page: desde $200.',
          'Orbit Commerce, una tienda online de hasta 4 vistas con catálogo, inventario y pedido por WhatsApp: desde $500.',
          'Deep Space System, software a medida: se cotiza según el proyecto.',
        ],
      },
      {
        p: 'El detalle de qué incluye cada plan está en la página de [precios de páginas web en Ecuador](/precios).',
      },
      { h2: 'Qué más puede sumar al costo' },
      {
        ul: [
          'Textos y fotos: si ya los tienes, el proyecto avanza más rápido; si hay que crearlos, es trabajo adicional.',
          'Dominio y hosting: son servicios recurrentes que se contratan con un proveedor. Pregunta siempre si van incluidos en la cotización o corren por tu cuenta.',
          'Integraciones: pasarelas de pago, sistemas de facturación o conexiones con otras herramientas suelen requerir trabajo extra.',
          'Mantenimiento: un sitio necesita actualizaciones y respaldos después del lanzamiento. Puedes revisar cómo funciona nuestro servicio de [mantenimiento web](/servicios/mantenimiento-web).',
        ],
      },
      { h2: 'Plantilla o diseño a medida' },
      {
        p: 'Una plantilla reduce el costo inicial, pero te limita: el diseño lo comparten otros negocios y suele traer código y funciones que nunca vas a usar, lo que puede volver el sitio más lento. Un sitio a medida cuesta más al comienzo y se adapta exactamente a lo que vendes. En FS Orbit trabajamos a medida; puedes ver cómo se aplica en nuestro servicio de [diseño de páginas web en Cuenca](/servicios/diseno-web-cuenca).',
      },
      { h2: 'Preguntas para comparar cotizaciones' },
      {
        ol: [
          '¿Qué incluye exactamente y qué queda fuera?',
          '¿El diseño es propio o parte de una plantilla?',
          '¿Quién conserva el código y la cuenta del dominio al terminar?',
          '¿Está incluido el SEO básico (títulos, descripciones, estructura, velocidad)?',
          '¿Cómo se ve el sitio en celular?',
          '¿Qué pasa si necesito un cambio después de la entrega?',
        ],
      },
      {
        p: 'Con esas seis respuestas por escrito puedes comparar dos propuestas aunque tengan precios muy distintos. Muchas veces la diferencia está en lo que una incluye y la otra no.',
      },
      { h2: 'Cómo pedir una cotización útil' },
      {
        p: 'Cuéntanos a qué se dedica tu negocio, qué quieres que haga la página (que te escriban, que te compren, que reserven) y si ya tienes dominio, logo y fotos. Con eso podemos darte un rango realista. Puedes ver [proyectos que hemos desarrollado](/proyectos) o escribirnos directamente por [contacto](/contacto) o WhatsApp.',
      },
    ],
  },

  {
    slug: 'pagina-web-vs-solo-instagram',
    intro:
      'Muchos negocios en Ecuador venden solo por Instagram y les funciona. La pregunta útil no es cuál es mejor, sino qué le falta a cada uno y qué pierdes si dependes de uno solo.',
    body: [
      { h2: 'Lo que Instagram hace bien' },
      {
        p: 'Instagram es excelente para mostrar tu trabajo, mantener contacto con tus clientes y responder mensajes rápido. Empezar no cuesta nada y no necesitas conocimientos técnicos. Si apenas estás arrancando, tener un perfil cuidado es un buen primer paso.',
      },
      { h2: 'Lo que Instagram no te da' },
      {
        ul: [
          'Que te encuentren en Google: alguien que busca "diseño de interiores en Cuenca" o "laboratorio clínico cerca" en el buscador difícilmente llega a tu perfil. Una página web propia es la forma de aparecer en esas búsquedas.',
          'Control sobre tu espacio: tu perfil vive en una plataforma ajena. Las reglas, el alcance y el diseño cambian cuando ellos lo deciden, no cuando tú lo necesitas.',
          'Información ordenada: precios, servicios, preguntas frecuentes, ubicación y formas de contacto en un solo lugar, sin que el cliente tenga que revisar publicaciones antiguas.',
          'Una dirección que puedes compartir en todos lados: tu propio dominio sirve en la tarjeta, en la factura, en la firma del correo y en Google Maps.',
        ],
      },
      { h2: 'Lo que aporta una página web' },
      {
        p: 'Una página web es el lugar donde tú decides qué se cuenta y cómo. Puedes explicar cada servicio con calma, mostrar casos reales, publicar tus precios y ofrecer un botón directo a WhatsApp. Además, es el sitio al que apuntan Google Maps, tus anuncios y tu perfil de Instagram. Si quieres ver cómo se arma, revisa nuestro servicio de [diseño de páginas web en Cuenca](/servicios/diseno-web-cuenca).',
      },
      { h2: 'Comparación rápida' },
      {
        ul: [
          'Aparecer en búsquedas de Google: la web puede; Instagram, de forma muy limitada.',
          'Mostrar tu día a día y novedades: Instagram es mejor.',
          'Explicar servicios y precios con detalle: la web es mejor.',
          'Ser dueño de tu espacio y tu dirección: la web.',
          'Costo inicial: Instagram es gratis; la web requiere inversión.',
        ],
      },
      { h2: 'No es uno o el otro' },
      {
        p: 'Lo que mejor funciona es combinarlos. Instagram atrae y genera confianza con contenido; la web recibe a quien quiere más información y lo lleva a escribirte. Cada publicación puede enviar a una página donde el cliente encuentre lo que necesita. Para que esa pieza funcione bien en celular y cargue rápido, es clave que esté bien construida.',
      },
      { h2: 'Qué debería tener tu primera página' },
      {
        p: 'No hace falta empezar con un sitio enorme. Una primera página efectiva explica en pocas líneas qué haces y para quién, muestra tus servicios o productos principales, responde las dudas más repetidas, indica dónde estás o a qué zonas atiendes y ofrece un botón visible para escribirte por WhatsApp. Con esa base ya tienes algo que compartir, que Google puede leer y que trabaja por ti cuando no estás respondiendo mensajes.',
      },
      { h2: 'Cuándo conviene dar el paso a una web' },
      {
        ul: [
          'Tus clientes te preguntan siempre lo mismo (precios, horarios, ubicación) y respondes uno por uno.',
          'Quieres que te encuentren personas que todavía no te conocen.',
          'Vendes un servicio que se decide con más información que una foto.',
          'Quieres anunciarte o aparecer en Google Maps y necesitas un destino propio.',
          'Tu negocio ya tiene clientes recurrentes y quieres dar una imagen más profesional.',
        ],
      },
      { h2: 'Cuánto cuesta empezar' },
      {
        p: 'Una landing page, que es una sola página enfocada en que te contacten, parte desde $200 con FS Orbit. Si vendes productos y quieres un catálogo, la opción de [tienda online en Ecuador](/servicios/tiendas-online) parte desde $500. Puedes ver el detalle en [precios](/precios) o comparar con [proyectos reales](/proyectos) de negocios de Cuenca.',
      },
      { h2: 'Conclusión' },
      {
        p: 'Si tu negocio ya vende por Instagram, no lo abandones: sigue siendo tu mejor vitrina. Pero si quieres que te encuentren en Google, ordenar tu información y no depender de una sola plataforma, una página web es la pieza que falta. Escríbenos por [contacto](/contacto) y revisamos contigo qué te conviene.',
      },
    ],
  },

  {
    slug: 'como-aparecer-en-google-maps-cuenca',
    intro:
      'Cuando alguien busca un servicio cerca de él, Google muestra un mapa con negocios antes que cualquier página web. Aparecer ahí es gratis, pero requiere crear tu ficha, verificarla y mantenerla al día. Estos son los pasos.',
    body: [
      { h2: 'Qué es tu ficha de Google' },
      {
        p: 'Tu ficha, llamada Perfil de Negocio de Google, es la tarjeta que aparece en Google Maps y en el buscador con tu nombre, dirección, teléfono, horario, fotos y reseñas. Se administra con una cuenta de Google y no tiene costo. Es la base de lo que se conoce como SEO local.',
      },
      { h2: 'Paso a paso para crearla' },
      {
        ol: [
          'Entra a business.google.com con la cuenta de Google que quieras usar para administrar el negocio.',
          'Escribe el nombre de tu negocio. Usa el nombre real, tal como lo ven tus clientes en el local o en tu publicidad.',
          'Elige la categoría principal que mejor te describa. Es una de las decisiones que más influye en qué búsquedas aparece tu ficha.',
          'Indica si tienes un local al que los clientes acuden o si atiendes en el lugar del cliente. Si atiendes a domicilio, puedes definir las zonas que cubres.',
          'Completa dirección, teléfono y sitio web.',
          'Verifica el negocio. Google ofrece distintos métodos según el caso; sigue el que te muestre en pantalla.',
        ],
      },
      { h2: 'Completa la ficha con cuidado' },
      {
        ul: [
          'Horario real y actualizado. Si cambia en feriados, avísalo en la ficha.',
          'Descripción clara de lo que haces, sin rellenar con palabras repetidas.',
          'Fotos propias del local, del equipo y de tu trabajo. Las fotos reales generan más confianza que las genéricas.',
          'Servicios o productos con su descripción, y precios si los puedes publicar.',
          'Enlace a tu página web y, si tienes, a tu WhatsApp.',
        ],
      },
      { h2: 'Mantén tus datos iguales en todas partes' },
      {
        p: 'Tu nombre, dirección y teléfono deben escribirse igual en Google, en tu web, en Instagram y en cualquier directorio. Si un lugar dice "Av." y otro "Avenida", o tiene un teléfono antiguo, Google puede dudar de cuál es el correcto. Revisa tus datos y unifícalos.',
      },
      { h2: 'Las reseñas importan' },
      {
        p: 'Las opiniones de clientes ayudan a otras personas a decidir y son parte de lo que Google considera al ordenar los resultados. Pide a tus clientes satisfechos que dejen su reseña, respóndelas con educación (también las malas) y nunca pagues ni inventes reseñas: va contra las reglas de Google y puede costarte la ficha.',
      },
      { h2: 'Por qué también necesitas una página web' },
      {
        p: 'La ficha muestra lo básico. Una página web propia permite explicar cada servicio con detalle, publicar preguntas frecuentes y aparecer en búsquedas que no son de mapa. Además, es el destino al que apunta el botón "Sitio web" de tu ficha. Si tu negocio está en la ciudad, una página bien hecha como la de nuestro servicio de [diseño de páginas web en Cuenca](/servicios/diseno-web-cuenca) refuerza lo que Google ve en tu ficha: mismo nombre, misma dirección, mismos servicios.',
      },
      {
        p: 'Puedes ver ejemplos en [nuestros proyectos](/proyectos), como el sitio de un laboratorio clínico de Cuenca que muestra horario, dirección y servicios en una sola página.',
      },
      { h2: 'Errores frecuentes' },
      {
        ul: [
          'Crear la ficha con un nombre distinto al real, agregando palabras clave de más.',
          'No verificarla y dejarla a medias.',
          'Dejar horarios o teléfonos desactualizados.',
          'No responder reseñas ni mensajes.',
          'Tener dos fichas para el mismo negocio.',
        ],
      },
      { h2: 'Cuánto tarda en notarse' },
      {
        p: 'No hay un plazo garantizado: depende de la competencia en tu rubro y de qué tan completa y activa esté tu ficha. Lo que sí está en tus manos es tenerla verificada, completa y coherente con tu web.',
      },
      { h2: 'Siguiente paso' },
      {
        p: 'Si ya tienes tu ficha pero no tienes web, o tu web está desactualizada, podemos ayudarte a que ambas se refuercen. Conoce los [precios de nuestros planes](/precios) o escríbenos por [contacto](/contacto).',
      },
    ],
  },
];

export const getPostContent = (slug) => blogContent.find((p) => p.slug === slug);
