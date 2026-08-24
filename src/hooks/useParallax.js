import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

// Parallax vertical de las capturas en /proyectos. Puerto de initParallax()
// en legacy-static/js/proyectos.js: escribe --shift, el compositor mueve
// la imagen sin disparar layout.
export function useParallax() {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!ref.current || reduceMotion) return undefined;
    const frame = ref.current;
    let active = false;
    let ticking = false;

    const update = () => {
      ticking = false;
      if (!active) return;
      const vh = window.innerHeight;
      const rect = frame.getBoundingClientRect();
      const progress = (rect.top + rect.height / 2 - vh / 2) / (vh / 2);
      frame.style.setProperty('--shift', `${(progress * -18).toFixed(2)}px`);
    };

    const onScroll = () => {
      if (ticking || !active) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting;
      onScroll();
    }, { rootMargin: '120px 0px' });

    observer.observe(frame);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [reduceMotion]);

  return ref;
}
