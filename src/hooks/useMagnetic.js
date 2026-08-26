import { useEffect } from 'react';

// Puerto de initMagnetic() en core.js: el boton persigue el puntero dentro
// de un radio. Solo con mouse fino (no touch) — en touch no hay hover que
// seguir. El gate de reduced-motion se quito a peticion del cliente, ver
// el comentario del bloque @media en index.css.
export function useMagnetic(ref, strength = 10) {
  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!ref.current || !finePointer) return undefined;
    const el = ref.current;

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      el.style.setProperty('--mx', `${dx * strength}px`);
      el.style.setProperty('--my', `${dy * strength * 0.6}px`);
      el.style.transition = 'transform 120ms linear';
      el.style.transform = 'translate(var(--mx, 0), var(--my, 0))';
    };

    const onLeave = () => {
      el.style.transition = 'transform var(--d4) var(--e-out)';
      el.style.transform = '';
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [ref, strength]);
}
