import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

// Etiqueta que sigue al cursor sobre los proyectos ("Ver preview").
// Puerto de initCursorTag() en core.js.
export function useCursorTag(label) {
  const zoneRef = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!zoneRef.current || !finePointer || reduceMotion) return undefined;
    const zone = zoneRef.current;

    const tag = document.createElement('div');
    tag.textContent = label;
    tag.className = 'pointer-events-none fixed left-0 top-0 z-[200] -translate-x-1/2 -translate-y-1/2 scale-50 rounded-r2 bg-signal px-3 py-1.5 text-[.6875rem] font-bold uppercase tracking-[.16em] text-signal-ink opacity-0 transition-opacity duration-200';
    document.body.appendChild(tag);

    let x = 0;
    let y = 0;
    let pending = false;

    const draw = () => {
      pending = false;
      tag.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(1)`;
    };

    const onEnter = (e) => {
      x = e.clientX;
      y = e.clientY;
      tag.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(.5)`;
      requestAnimationFrame(() => {
        tag.style.opacity = '1';
        draw();
      });
    };

    const onMove = (e) => {
      x = e.clientX;
      y = e.clientY;
      if (pending) return;
      pending = true;
      requestAnimationFrame(draw);
    };

    const onLeave = () => {
      tag.style.opacity = '0';
    };

    zone.addEventListener('pointerenter', onEnter);
    zone.addEventListener('pointermove', onMove);
    zone.addEventListener('pointerleave', onLeave);

    return () => {
      zone.removeEventListener('pointerenter', onEnter);
      zone.removeEventListener('pointermove', onMove);
      zone.removeEventListener('pointerleave', onLeave);
      tag.remove();
    };
  }, [label, reduceMotion]);

  return zoneRef;
}
