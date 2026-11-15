// Decide una sola vez si este dispositivo ve la escena 3D ('gl') o la
// version estatica con la misma informacion ('static').
//
// Va a 'static' cuando: el sistema pide menos movimiento, el navegador
// pide ahorro de datos, no hay WebGL2 con aceleracion real, la GPU es de
// gama baja conocida, o es un celular con poca memoria / pocos nucleos.
// El prerender siempre captura 'static' (es el HTML base de todos).
const LOW_GPU = /swiftshader|llvmpipe|software|basic render|mali-4|mali-t[67]|adreno \(tm\) [2-4]\d\d|powervr sgx|videocore/i;

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
  if (!motionAllowed()) return 'static';
  if (navigator.connection?.saveData) return 'static';

  const coarse = window.matchMedia('(pointer: coarse)').matches;
  if (coarse) {
    if (navigator.deviceMemory && navigator.deviceMemory <= 3) return 'static';
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) return 'static';
  }

  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: true, powerPreference: 'high-performance' });
    if (!gl) return 'static';
    const info = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : '';
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    if (LOW_GPU.test(renderer)) return 'static';
  } catch {
    return 'static';
  }
  return 'gl';
}
