import { useLayoutEffect, useRef } from 'react';
import { observeOnce, pausedAnimation, EASE_OUT } from '@/lib/inView';

// Reemplaza el motor [data-reveal] + IntersectionObserver a mano de
// legacy-static/js/core.js. Antes era un motion[as] de Framer Motion por
// reveal (~40 en la home), cada uno con su propio observer y su propio
// estado de React. Ahora es un elemento normal: un IntersectionObserver
// compartido dispara una Web Animation con los mismos keyframes, duracion,
// delay y curva — sin re-render de React ni trabajo por frame en el hilo
// principal. Sigue disparando una sola vez, igual que viewport.once.
const variants = {
  rise: [{ opacity: 0, transform: 'translateY(26px)' }, { opacity: 1, transform: 'none' }],
  fade: [{ opacity: 0 }, { opacity: 1 }],
  scale: [{ opacity: 0, transform: 'scale(0.965)' }, { opacity: 1, transform: 'none' }],
  left: [{ opacity: 0, transform: 'translateX(-28px)' }, { opacity: 1, transform: 'none' }],
  mask: [
    { opacity: 0, transform: 'translateY(14px)', clipPath: 'inset(0 0 100% 0)' },
    { opacity: 1, transform: 'none', clipPath: 'inset(0 0 0% 0)' },
  ],
};

// React 19: ref ya es una prop normal en componentes de funcion, no hace
// falta forwardRef para que useMagnetic/useCursorTag puedan engancharse
// al nodo real.
export default function Reveal({ as: Tag = 'div', type = 'rise', index = 0, className, children, ref, ...props }) {
  const localRef = useRef(null);

  const setRef = (node) => {
    localRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  };

  // Layout effect: el estado inicial (oculto) se aplica antes del primer
  // pintado tras montar/hidratar, como hacia initial="hidden".
  useLayoutEffect(() => {
    const el = localRef.current;
    if (!el) return undefined;
    const anim = pausedAnimation(el, variants[type] ?? variants.rise, {
      duration: 850,
      delay: index * 110,
      easing: EASE_OUT,
    });
    const stop = observeOnce(el, () => anim.play(), { amount: 0.12, margin: '0px 0px -8% 0px' });
    return () => {
      stop();
      anim.cancel();
    };
  }, [type, index]);

  return (
    <Tag ref={setRef} className={className} {...props}>
      {children}
    </Tag>
  );
}
