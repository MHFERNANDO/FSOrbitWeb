import { useEffect, useRef } from 'react';
import { fitOf } from '@/lib/fit';
import { initScroll } from '@/lib/scroll';
import { motionAllowed } from '@/lib/capability';

// Titular en Anybody cuyo ancho (eje wdth) cambia con el scroll.
//  lines   -> cada elemento es una linea (sin corte en pantallas anchas)
//  from/to -> ancho al empezar y al terminar el tramo de scroll
//  scrub   -> false (quieto) | { trigger, start, end } (ScrollTrigger)
//  wrap    -> en celular hace wrap normal y queda quieto (titulares largos)
//  mobile  -> [from, to] en celular cuando wrap es false
export default function Display({
  as: Tag = 'h1',
  lines,
  from = 84,
  to = 60,
  scrub = { start: 0, end: 560 },
  wrap = true,
  mobile = [64, 50],
  cap,
  className = '',
  id,
}) {
  const ref = useRef(null);
  const fit = fitOf(lines, Math.max(from, to));
  const fitMobile = fitOf(lines, Math.max(mobile[0], mobile[1]));

  useEffect(() => {
    if (!scrub || !motionAllowed()) return undefined;
    const el = ref.current;
    let mm;
    let alive = true;
    initScroll().then(({ gsap }) => {
      if (!alive || !el) return;
      const trigger = scrub.trigger ? el.closest(scrub.trigger) : undefined;
      const st = { trigger, start: scrub.start, end: scrub.end, scrub: true };
      mm = gsap.matchMedia();
      mm.add('(min-width: 768px)', () => {
        gsap.fromTo(el, { '--wd': from }, { '--wd': to, ease: 'none', scrollTrigger: { ...st } });
      });
      if (!wrap) {
        mm.add('(max-width: 767px)', () => {
          gsap.fromTo(el, { '--wm': mobile[0] }, { '--wm': mobile[1], ease: 'none', scrollTrigger: { ...st } });
        });
      }
    });
    return () => {
      alive = false;
      mm?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to, wrap]);

  return (
    <Tag id={id} className={`display ${wrap ? 'display--wrap' : ''} ${className}`}>
      <span
        ref={ref}
        className="display-in"
        style={{ '--fit': fit, '--fit-m': fitMobile, '--wd': from, '--wm': mobile[0], ...(cap ? { '--cap': cap } : {}) }}
      >
        {lines.map((line, i) => (
          <span key={line}>
            {line}
            {i < lines.length - 1 ? ' ' : ''}
          </span>
        ))}
      </span>
    </Tag>
  );
}
