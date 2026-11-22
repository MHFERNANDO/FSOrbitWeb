// Datos del sitio: contacto, servicios, planes, casos y proceso.
// Precios, nombres de plan y hechos de cada caso son la fuente de verdad;
// no se agregan cifras, clientes ni resultados que no esten confirmados.

export const contact = {
  whatsappSales: '593983113942',
  whatsappSupport: '593987582463',
  // Mismo numero de ventas para el link tel: (no hay otra linea fija).
  tel: '+593983113942',
  telDisplay: '+593 98 311 3942',
  salesDisplay: '098 311 3942',
  supportDisplay: '098 758 2463',
  email: 'fsorbitt@gmail.com',
  instagram: 'https://www.instagram.com/fs_orbit/',
  // Base en Cuenca; se atiende cualquier ubicacion del pais. No hay
  // direccion publica de oficina.
  city: 'Cuenca',
  region: 'Azuay',
  country: 'Ecuador',
};

export const waLink = (text, number = contact.whatsappSales) => `https://wa.me/${number}?text=${encodeURIComponent(text)}`;

export const services = [
  {
    slug: 'diseno-web-cuenca',
    href: '/servicios/diseno-web-cuenca',
    title: 'Diseño de páginas web',
    short: 'Landing pages y sitios de varias páginas escritos a medida.',
    description:
      'Diseñamos y programamos tu sitio con código propio: liviano, adaptado a celular y con la estructura que leen los buscadores.',
    features: ['Código liviano', 'Adaptada a celular', 'SEO on-page'],
    from: 'Desde $200',
  },
  {
    slug: 'diseno-ui-ux',
    href: '/servicios/diseno-ui-ux',
    title: 'Diseño UI/UX',
    short: 'Estructura, prototipo e interfaz antes de programar.',
    description:
      'Ordenamos el contenido, definimos el recorrido de la página y te mostramos un prototipo para que ajustes antes de que se construya.',
    features: ['Prototipos', 'Experiencia de usuario'],
    from: 'Se cotiza con el proyecto',
  },
  {
    slug: 'tiendas-online',
    href: '/servicios/tiendas-online',
    title: 'Tiendas online',
    short: 'Catálogo, inventario y pedidos directos a WhatsApp.',
    description:
      'Una tienda de hasta 4 vistas con catálogo dinámico, panel de inventario y un botón de pedido que abre la conversación por WhatsApp.',
    features: ['Catálogo dinámico', 'Gestión de stock', 'Pedido por WhatsApp'],
    from: 'Desde $500',
  },
  {
    slug: 'mantenimiento-web',
    href: '/servicios/mantenimiento-web',
    title: 'Mantenimiento web',
    short: 'Parches de seguridad, soporte técnico y backup diario.',
    description:
      'Corregimos errores, aplicamos actualizaciones de seguridad y guardamos respaldos diarios para que tu sitio siga en línea.',
    features: ['Parches de seguridad', 'Soporte técnico', 'Backup diario'],
    from: 'Se cotiza según el sitio',
  },
  {
    slug: 'rediseno-y-optimizacion',
    href: '/servicios/rediseno-y-optimizacion',
    title: 'Rediseño y optimización',
    short: 'Tu sitio actual, más rápido y bien resuelto en celular.',
    description:
      'Tomamos un sitio lento o antiguo y mejoramos su velocidad, su código y su experiencia en celular sin perder tu identidad.',
    features: ['Más velocidad', 'Mejor en celular', 'Código más limpio'],
    from: 'Se cotiza caso por caso',
  },
];

// Los tres planes publicados. `includes` es la lista vigente de cada plan,
// sin agregados. "Desde" = precio base; el final depende del alcance.
export const pricingPlans = [
  {
    slug: 'orbit-impact',
    name: 'Orbit Impact',
    price: '$200',
    priceLabel: 'Desde $200',
    kind: 'Landing page',
    description: 'Una landing page para servicios profesionales que necesitan presencia y velocidad.',
    scope: 'Una sola vista',
    idealFor: 'Ideal si ofreces un servicio y quieres que te escriban por WhatsApp desde una sola página.',
    includes: [
      'Una landing page principal',
      'Diseño de autor, sin plantillas',
      'Animaciones al desplazar la página',
      'Código propio, sin plugins (Pure Code)',
      'SEO on-page estructural',
      'Formulario de captación',
    ],
    cta: 'Escribir por WhatsApp sobre Orbit Impact',
    whatsappText: 'Me interesa el plan Orbit Impact',
    servicePath: '/servicios/diseno-web-cuenca',
  },
  {
    slug: 'orbit-commerce',
    name: 'Orbit Commerce',
    price: '$500',
    priceLabel: 'Desde $500',
    kind: 'Tienda online',
    description: 'Una tienda online para vender por catálogo y recibir los pedidos por WhatsApp.',
    scope: 'Hasta 4 vistas',
    idealFor: 'Ideal si vendes productos y quieres mostrar tu catálogo con precios.',
    includes: [
      'Hasta 4 vistas (tienda completa)',
      'Catálogo de productos dinámico',
      'Botón de pedido directo a WhatsApp',
      'Panel de gestión de inventario',
      'SEO on-page estructural',
      'Capacitación de uso de la plataforma',
    ],
    cta: 'Escribir por WhatsApp sobre Orbit Commerce',
    whatsappText: 'Me interesa el plan Orbit Commerce',
    servicePath: '/servicios/tiendas-online',
  },
  {
    slug: 'deep-space-system',
    name: 'Deep Space System',
    price: 'Custom',
    priceLabel: 'Se cotiza',
    kind: 'Software a medida',
    description: 'Software a medida: portales médicos, sistemas internos o aplicaciones web.',
    scope: 'Vistas sin límite',
    idealFor: 'Ideal si necesitas usuarios con acceso, una base de datos o un sistema interno.',
    includes: [
      'Arquitectura de vistas ilimitada',
      'Desarrollo con React / Next.js',
      'Gestión de base de datos',
      'Roles de usuario y autenticación',
      'Integración con APIs de terceros',
      'Arquitectura escalable',
    ],
    cta: 'Escribir por WhatsApp sobre un sistema a medida',
    whatsappText: 'Necesito una consultoría para un Sistema Custom',
    servicePath: null,
  },
];

// Lo que vale para los tres planes (sale de la FAQ de precios).
export const planNotes = {
  all: ['Diseño propio, sin plantillas', 'Código optimizado', 'SEO on-page estructural: metadatos, estructura semántica y velocidad de carga'],
  notIncluded: [
    'Dominio y hosting. Son servicios anuales de otro proveedor; antes de empezar te decimos qué contratar.',
    'Mantenimiento después de la entrega. Es un servicio aparte que se cotiza según el sitio.',
  ],
  priceMoves: ['El número de vistas', 'Las integraciones que necesites', 'El contenido que haya que preparar'],
};

// Dimensiones reales de cada captura (para width/height y evitar CLS).
const IMG_SIZE = {
  GravityPreview: { w: 1918, h: 927 },
  AccuLabPreview: { w: 1902, h: 930 },
  JFVapesPreview: { w: 1893, h: 885 },
  LabDieselPreview: { w: 1896, h: 908 },
};

// Casos publicados. Solo sitios reales que se pueden visitar.
export const projects = [
  {
    slug: 'acculab-system',
    title: 'Accu-Lab',
    tag: 'Laboratorio clínico en Cuenca',
    description:
      'Sitio web de un laboratorio clínico en Cuenca: catálogo de exámenes con precios referenciales, paquetes, toma a domicilio y agenda por WhatsApp.',
    img: 'AccuLabPreview',
    ...IMG_SIZE.AccuLabPreview,
    alt: 'Sitio web de Accu-Lab, laboratorio clínico en Cuenca',
    url: 'https://acculab.bio',
  },
  {
    slug: 'laboratorio-diesel-mg',
    title: 'Laboratorio Diesel MG',
    tag: 'Inyección diésel en Cuenca',
    description:
      'Sitio de un laboratorio de inyección diésel en Cuenca: servicios, sistemas que reparan, equipos de prueba y consultas por WhatsApp.',
    img: 'LabDieselPreview',
    ...IMG_SIZE.LabDieselPreview,
    alt: 'Sitio web de Laboratorio Diesel MG, laboratorio de inyección diésel en Cuenca',
    url: 'https://www.laboratoriodieselmg.com/',
  },
  {
    slug: 'gravity-studio',
    title: 'Gravity Studio',
    tag: 'Estudio creativo en Cuenca',
    description:
      'Sitio de un estudio creativo de Cuenca: cinco servicios, cuatro planes de redes sociales y contacto por formulario, WhatsApp y chat.',
    img: 'GravityPreview',
    ...IMG_SIZE.GravityPreview,
    alt: 'Sitio web de Gravity Estudio Creativo, estudio creativo en Cuenca',
    url: 'https://gravityestudiocreativo.com',
  },
  {
    slug: 'jf-vapes-store',
    title: 'JF Vapes Store',
    tag: 'Tienda online con entrega en Cuenca',
    description:
      'Tienda online con catálogo por categorías, precios visibles, preguntas frecuentes y pedidos por WhatsApp, con entrega en Cuenca.',
    img: 'JFVapesPreview',
    ...IMG_SIZE.JFVapesPreview,
    alt: 'Sitio web de la tienda online JF Vapes, con entrega en Cuenca',
    url: 'https://jf-vapes-pagina-web-w6bo.vercel.app',
  },
];

export const getProject = (slug) => projects.find((p) => p.slug === slug);
// Los tres casos que recorre la home.
export const homeCases = ['acculab-system', 'laboratorio-diesel-mg', 'gravity-studio'].map(getProject);

// Proceso: cada paso sale de lo que el sitio ya promete (FAQ y servicios).
export const processSteps = [
  {
    title: 'Nos escribes por WhatsApp',
    text: 'Cuéntanos qué necesita tu negocio, para qué sirve la página y si ya tienes dominio, logo o fotos. Si ya tienes un sitio, envíanos su dirección.',
    youGet: 'Una respuesta de quien va a diseñar y programar tu sitio, sin intermediarios.',
  },
  {
    title: 'Te enviamos una propuesta',
    text: 'Definimos el alcance: cuántas vistas, qué integraciones y qué contenido hace falta. Con eso te damos el precio, un plazo estimado y la forma de pago antes de empezar.',
    youGet: 'Precio, plazo estimado y condiciones de pago. También qué dominio y hosting contratar.',
  },
  {
    title: 'Ordenamos el contenido y armamos un prototipo',
    text: 'Partimos de una pregunta: qué quieres que haga la persona que entra a tu sitio. Desde ahí ordenamos el contenido y definimos el recorrido de la página.',
    youGet: 'Un prototipo para ver y probar. Opinas y ajustamos antes de construir.',
  },
  {
    title: 'Escribimos el código',
    text: 'Programamos el sitio a medida, sin plantillas ni constructores. Cada página lleva sus títulos, sus descripciones y una jerarquía de encabezados correcta, y se adapta a celular desde el primer día.',
    youGet: 'El sitio funcionando, igual al prototipo que aprobaste.',
  },
  {
    title: 'Publicamos',
    text: 'Subimos el sitio a tu dominio y enviamos el sitemap a Google Search Console para revisar que no aparezcan errores. Si es un rediseño, mantenemos las direcciones o redirigimos cada una con un 301.',
    youGet: 'Tu página en línea. En una tienda, también la capacitación para administrarla.',
  },
  {
    title: 'Seguimos si lo necesitas',
    text: 'Con el servicio de mantenimiento aplicamos parches de seguridad, damos soporte técnico y guardamos un backup diario. Es opcional y se cotiza según el sitio.',
    youGet: 'Alguien pendiente de que tu sitio siga funcionando.',
  },
];
