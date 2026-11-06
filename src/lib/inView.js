import { reducedMotion } from './motion.js';

const NOOP_ANIMATION = { play() {}, pause() {}, cancel() {} };

// Un IntersectionObserver compartido por cada combinacion de opciones,
// en vez de uno por componente (antes: un useInView de Framer Motion por
// cada palabra de cada titulo y por cada <Reveal>). Dispara una sola vez
// por elemento — mismo contrato que viewport.once / useInView({ once }).
const observers = new Map();

function getObserver(amount, margin) {
  const key = `${amount}|${margin}`;
  let entry = observers.get(key);
  if (entry) return entry;

  const callbacks = new WeakMap();
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const cb = callbacks.get(e.target);
        io.unobserve(e.target);
        callbacks.delete(e.target);
        cb?.();
      }
    },
    { threshold: amount, rootMargin: margin },
  );
  entry = { io, callbacks };
  observers.set(key, entry);
  return entry;
}

export function observeOnce(el, onEnter, { amount = 0, margin = '0px' } = {}) {
  // Sin IntersectionObserver (navegador muy viejo o entorno raro) no hay
  // forma de saber cuando entra en pantalla: se dispara ya, para que el
  // contenido nunca se quede oculto en su estado inicial.
  if (typeof IntersectionObserver === 'undefined') {
    onEnter();
    return () => {};
  }
  const { io, callbacks } = getObserver(amount, margin);
  callbacks.set(el, onEnter);
  io.observe(el);
  return () => {
    io.unobserve(el);
    callbacks.delete(el);
  };
}

export const EASE_OUT = 'cubic-bezier(0.22, 1, 0.36, 1)';

// Crea la animacion pausada en t=0 para que el elemento quede en su
// estado inicial (fill backwards) hasta que entre en viewport. Al
// terminar se cancela: el estado final de cada reveal es el estilo
// natural del elemento, asi no queda un fill pisando transform/opacity
// de hovers o transiciones propias del componente.
export function pausedAnimation(el, keyframes, options) {
  // Con "reducir movimiento" (o sin Web Animations) no se anima nada: el
  // elemento se queda en su estilo natural, visible. Ver src/lib/motion.js.
  if (reducedMotion() || typeof el.animate !== 'function') return NOOP_ANIMATION;
  const anim = el.animate(keyframes, { fill: 'both', ...options });
  anim.pause();
  anim.onfinish = () => anim.cancel();
  return anim;
}
