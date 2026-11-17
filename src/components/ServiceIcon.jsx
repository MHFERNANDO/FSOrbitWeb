// Pictogramas de linea, uno por servicio. Ayudan a reconocer cada servicio
// al recorrer una lista; no son decoracion suelta.
const PATHS = {
  // ventana de navegador con un layout dentro
  'diseno-web-cuenca': (
    <>
      <rect x="3" y="4" width="18" height="16" rx="1.5" />
      <path d="M3 8h18" />
      <path d="M6.5 11.5h6M6.5 14.5h4M14.5 11.5h3v5h-3z" />
    </>
  ),
  // marco de prototipo con un puntero
  'diseno-ui-ux': (
    <>
      <path d="M4 4h12v8M4 4v12h8" />
      <path d="M4 8h12" />
      <path d="m13.5 13.5 6.5 2.4-2.8 1.1-1.1 2.8z" />
    </>
  ),
  // bolsa de compras
  'tiendas-online': (
    <>
      <path d="M5 8h14l-1 12H6z" />
      <path d="M9 10V7a3 3 0 0 1 6 0v3" />
    </>
  ),
  // escudo con visto
  'mantenimiento-web': (
    <>
      <path d="M12 3 5 6v5c0 4.4 3 8 7 10 4-2 7-5.6 7-10V6z" />
      <path d="m9 12 2.2 2.2L15.5 10" />
    </>
  ),
  // indicador de velocidad
  'rediseno-y-optimizacion': (
    <>
      <path d="M4.5 17a8 8 0 1 1 15 0" />
      <path d="m12 14 4-5" />
      <path d="M7 17h10" />
    </>
  ),
};

export default function ServiceIcon({ slug, className = '' }) {
  const glyph = PATHS[slug];
  if (!glyph) return null;
  return (
    <svg
      className={`svc-icon ${className}`}
      viewBox="0 0 24 24"
      width="28"
      height="28"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {glyph}
    </svg>
  );
}
