// INTERRUPTOR UNICO del respeto a "reducir movimiento" (prefers-reduced-motion).
//
// true  -> quien tenga activado "reducir animaciones" en su sistema ve el
//          sitio sin reveals, sin loops ni parallax; todo el contenido
//          queda visible y estatico.
// false -> el sitio se anima siempre, como pidio el cliente en una
//          iteracion anterior (ver el bloque "DECISION DEL CLIENTE" de
//          src/index.css).
//
// Esta en false por pedido del cliente (2026-11-07): las animaciones se ven siempre.
// Poner true para respetar el ajuste del sistema (WCAG 2.3.3).
// OJO: una maquina de pruebas con "reducir animaciones" activado en
// Windows (Configuracion > Accesibilidad > Efectos visuales > Efectos de
// animacion = apagado) vera el sitio sin animaciones. Para ver las
// animaciones ahi, activa ese ajuste o pon esta constante en false.
export const RESPECT_REDUCED_MOTION = false;

const query = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;

export const reducedMotion = () => RESPECT_REDUCED_MOTION && Boolean(query?.matches);

// Marca <html data-reduce-motion> para que el bloque CSS de index.css
// apague transiciones y animaciones CSS; se mantiene al dia si la
// persona cambia el ajuste con la pagina abierta.
export function applyMotionPreference() {
  if (typeof document === 'undefined') return;
  const sync = () => document.documentElement.toggleAttribute('data-reduce-motion', reducedMotion());
  sync();
  query?.addEventListener?.('change', sync);
}
