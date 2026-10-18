// Todo el copy del sitio, sacado literal de legacy-static/index.html y
// legacy-static/proyectos.html — ni un texto, precio o link reescrito.

export const contact = {
  whatsappSales: '593983113942',
  whatsappSupport: '593987582463',
  // Mismo numero de ventas, para el link tel: del header/footer (el
  // cliente confirmo que no hay otra linea fija).
  tel: '+593983113942',
  telDisplay: '+593 98 311 3942',
  email: 'fsorbitt@gmail.com',
  instagram: 'https://www.instagram.com/fs_orbit/',
  // Base en Cuenca, pero el cliente atiende cualquier ubicacion (no solo
  // Azuay/Cuenca) — confirmado, no hay direccion publica de oficina.
  city: 'Cuenca',
  region: 'Azuay',
  country: 'Ecuador',
};

export const services = [
  {
    number: '01',
    icon: 'globe',
    title: 'Desarrollo Web',
    description: 'Sitios de alto rendimiento, seguros y optimizados para SEO. Construimos la base sólida que tu empresa necesita para escalar.',
    features: ['Carga Ultra-rápida', 'Responsive Design'],
  },
  {
    number: '02',
    icon: 'layout',
    title: 'Diseño UI/UX',
    description: 'Interfaces modernas centradas en el usuario. No solo diseñamos cosas bonitas, creamos experiencias que convierten visitas en clientes.',
    features: ['Prototipado Pro', 'User Experience'],
  },
  {
    number: '03',
    icon: 'bag',
    title: 'E-commerce',
    description: 'Sistemas de venta online robustos y escalables. Gestiona inventario, pagos y envíos en una plataforma diseñada para vender 24/7.',
    features: ['Pagos Seguros', 'Gestión de Stock'],
  },
  {
    number: '04',
    icon: 'shield',
    title: 'Mantenimiento Web',
    description: 'Protegemos tu inversión con soporte técnico continuo. Corrección de errores, actualizaciones de seguridad y respaldos constantes para que nunca dejes de estar online.',
    features: ['Parches de Seguridad', 'Soporte Técnico', 'Backup Diario'],
  },
  {
    number: '05',
    icon: 'bolt',
    title: 'Optimización & Upgrade',
    description: '¿Tu web se quedó en el pasado? Transformamos sitios lentos y antiguos en plataformas rápidas y modernas, mejorando el código y la experiencia móvil sin perder tu esencia.',
    features: ['Mejora de WPO', 'Rediseño Adaptativo', 'Limpieza de Código'],
  },
];

export const pricingPlans = [
  {
    icon: 'target',
    name: 'Orbit Impact',
    price: '$200',
    period: '/desde',
    description: 'Perfecto para servicios profesionales que buscan autoridad visual y velocidad.',
    features: [
      '1 Landing Page Principal',
      'Diseño de Autor (Sin Plantillas)',
      'Animaciones de Alto Nivel (Reveal effects)',
      'Optimización "Pure Code" (Carga < 1s)',
      'SEO On-Page Estructural',
      'Formulario de captación avanzado',
    ],
    cta: 'Iniciar Proyecto',
    ctaVariant: 'secondary',
    whatsappText: 'Me interesa el plan Orbit Impact',
    popular: false,
  },
  {
    icon: 'bag',
    name: 'Orbit Commerce',
    price: '$500',
    period: '/desde',
    description: 'E-commerce robusto diseñado para vender 24/7 sin fricciones.',
    features: [
      'Hasta 4 Vistas (Tienda Completa)',
      'Catálogo de productos dinámico',
      'Botón de Pedido Directo a WhatsApp',
      'Panel de gestión de inventario',
      'SEO On-Page Estructural',
      'Capacitación de uso de plataforma',
    ],
    cta: 'Lanzar Tienda',
    ctaVariant: 'primary',
    whatsappText: 'Me interesa el plan Orbit Commerce',
    popular: true,
  },
  {
    icon: 'chip',
    name: 'Deep Space System',
    price: 'Custom',
    period: '',
    description: 'Software a medida: Portales médicos, sistemas internos o apps web.',
    features: [
      'Arquitectura de Vistas Ilimitada',
      'Desarrollo con React / Next.js',
      'Gestión de Base de Datos',
      'Roles de Usuario y Autenticación',
      'Integración con APIs de terceros',
      'Arquitectura Escalable (Misión Crítica)',
    ],
    cta: 'Consultar Ingeniería',
    ctaVariant: 'secondary',
    whatsappText: 'Necesito una consultoría para un Sistema Custom',
    popular: false,
  },
];

// Portada (index) — solo los dos destacados
export const featuredWork = [
  {
    title: 'Acculab',
    tag: 'Plataforma de Análisis Clínicos',
    img: 'AccuLabPreview',
    alt: 'Acculab - Plataforma Médica',
    url: 'https://acculab.bio',
  },
  {
    title: 'Gravity Studio',
    tag: 'Landing Page',
    img: 'GravityPreview',
    alt: 'Gravity Studio - Landing Page',
    url: 'https://gravityestudiocreativo.com',
  },
];

// Galeria completa (proyectos) — orden y datos identicos al HTML original
export const projects = [
  {
    slug: 'gravity-studio',
    code: '// 01_GRAVITY_STUDIO',
    title: 'Gravity Studio',
    description: 'Landing Page',
    tags: ['JS_ENGINE', 'MARKETING'],
    img: 'GravityPreview',
    alt: 'Gravity Studio',
    url: 'https://gravityestudiocreativo.com',
  },
  {
    slug: 'acculab-system',
    code: '// 02_ACCULAB_SYSTEM',
    title: 'Acculab System',
    description: 'Arquitectura médica de misión crítica optimizada para datos en tiempo real.',
    tags: ['JS_ENGINE', 'HEALTH_TECH'],
    img: 'AccuLabPreview',
    alt: 'Acculab',
    url: 'https://acculab.bio',
  },
  {
    slug: 'jf-vapes-store',
    code: '// 03_JF_VAPES_STORE',
    title: 'JF Vapes Store',
    description: 'E-commerce de alto impacto diseñado para la máxima conversión móvil.',
    tags: ['ECOMMERCE', 'UI_PRECISION'],
    img: 'JFVapesPreview',
    alt: 'JF Vapes',
    url: 'https://jf-vapes-pagina-web-w6bo.vercel.app',
  },
  {
    slug: 'laboratorio-diesel-mg',
    code: '// 04_LAB_DIESEL_MG',
    title: 'Laboratorio Diesel MG',
    description: 'Plataforma web especializada para servicios de laboratorio e inyección diésel.',
    tags: ['CORPORATIVE', 'AUTOMOTIVE'],
    img: 'LabDieselPreview',
    alt: 'Laboratorio Diesel MG',
    url: 'https://laboratorio-diesel-mg.vercel.app/',
  },
];

export const advisorSteps = {
  step1: {
    label: '01/02',
    question: '¿Qué servicio necesitas?',
    options: [
      { icon: 'globe', value: 'Web Nueva', label: 'Crear Web desde cero' },
      { icon: 'bolt', value: 'Optimización', label: 'Optimizar mi web actual' },
      { icon: 'bag', value: 'E-commerce', label: 'Tienda Online' },
    ],
  },
  step2: {
    label: '02/02',
    question: '¿Cuál es tu prioridad?',
    options: [
      { icon: 'target', value: 'Ventas', label: 'Vender más' },
      { icon: 'bolt', value: 'Velocidad', label: 'Carga ultra-rápida' },
      { icon: 'layout', value: 'Diseño', label: 'Imagen Profesional' },
    ],
  },
};
