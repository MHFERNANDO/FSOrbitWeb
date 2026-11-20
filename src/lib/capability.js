// Decide una sola vez si la home muestra el modelo ('seq') o la version
// estatica con la misma informacion ('static'). Va a estatica con ahorro de
// datos o un equipo con menos de 2 GB. Con "reducir movimiento" el modelo
// se muestra igual, pero sin giros automaticos (ver src/seq/sequence.js).
// El prerender siempre captura 'static' (es el HTML base de todos).
let cached = null;

export function motionAllowed() {
  if (typeof window === 'undefined') return false;
  if (document.documentElement.dataset.motion === 'on') return true;
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ?movimiento=1 fuerza las animaciones aunque el sistema pida reducirlas
// (util para revisar el sitio en un equipo con ese ajuste activo);
// ?movimiento=0 vuelve al comportamiento normal. Se recuerda en la sesion.
export function applyMotionOverride() {
  try {
    const param = new URLSearchParams(window.location.search).get('movimiento');
    if (param === '1') sessionStorage.setItem('fs-motion', 'on');
    if (param === '0') sessionStorage.removeItem('fs-motion');
    if (sessionStorage.getItem('fs-motion') === 'on') document.documentElement.dataset.motion = 'on';
  } catch {
    /* sin sessionStorage: se respeta el sistema */
  }
}

export function detectTier() {
  if (cached) return cached;
  cached = compute();
  return cached;
}

function compute() {
  if (typeof window === 'undefined' || window.__PRERENDER__) return 'static';
  if (navigator.connection?.saveData) return 'static';
  // Celulares con muy poca memoria: los cuadros decodificados no caben.
  if (navigator.deviceMemory && navigator.deviceMemory < 2) return 'static';
  // Con 'reducir movimiento' tambien se usa la secuencia, pero en modo
  // tranquilo (src/seq/sequence.js): solo cambia al hacer scroll.
  return 'seq';
}
