import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

const SESSION_KEY = 'fsorbit-booted';
const STATUS_MESSAGES = ['Inicializando sistema', 'Cargando activos', 'Compilando interfaz', 'Listo'];

// Puerto directo de legacy-static/js/preloader.js. Dos lecciones de esa
// sesion se mantienen tal cual:
// 1) Nunca se salta del todo con movimiento reducido — antes desaparecia
//    en el mismo frame en que aparecia, es decir, nunca llegaba a verse.
// 2) Solo la primera visita de la sesion dura los 2s completos; las
//    navegaciones internas usan un pase de 700ms.
export default function Preloader({ onDone }) {
  const reduceMotion = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState(STATUS_MESSAGES[0]);
  const [done, setDone] = useState(false);
  const finishedRef = useRef(false);

  useEffect(() => {
    document.body.classList.add('is-loading');

    const returning = sessionStorage.getItem(SESSION_KEY) === 'true';
    const duration = returning || reduceMotion ? 700 : 2000;
    const messages = returning || reduceMotion ? [STATUS_MESSAGES[0], STATUS_MESSAGES[3]] : STATUS_MESSAGES;

    const start = performance.now();
    let raf;

    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - p) ** 2.4;

      setProgress(eased);
      setStatus(messages[Math.min(messages.length - 1, Math.floor(p * messages.length))]);

      if (p < 1) {
        raf = requestAnimationFrame(tick);
        return;
      }

      sessionStorage.setItem(SESSION_KEY, 'true');
      setDone(true);
      // Espera a que termine la cortina (--d5) antes de desmontar; bajo
      // movimiento reducido esa transicion ya viene recortada a 240ms.
      window.setTimeout(() => {
        if (finishedRef.current) return;
        finishedRef.current = true;
        document.body.classList.remove('is-loading');
        onDone();
      }, reduceMotion ? 280 : 1350);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="fixed inset-0 z-[var(--z-preloader)] flex items-center justify-center bg-ink-1000 transition-transform"
      style={{
        transitionDuration: 'var(--d5)',
        transitionTimingFunction: 'var(--e-io)',
        transform: done ? 'translateY(-101%)' : 'none',
      }}
      aria-hidden="true"
    >
      <div
        className="absolute -inset-px opacity-70"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.028) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.028) 1px, transparent 1px)',
          backgroundSize: '88px 88px',
          maskImage: 'radial-gradient(ellipse 60% 55% at 50% 50%, #000 0%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse 60% 55% at 50% 50%, #000 0%, transparent 75%)',
        }}
      />

      <div
        className="relative grid justify-items-center gap-s6 transition-[opacity,transform]"
        style={{
          transitionDuration: 'var(--d3)',
          transitionTimingFunction: 'var(--e-out)',
          opacity: done ? 0 : 1,
          transform: done ? 'translateY(-10px)' : 'none',
        }}
      >
        <svg className="size-[60px] overflow-visible" viewBox="0 0 60 60">
          <circle cx="30" cy="30" r="20" fill="none" stroke="var(--line-2)" strokeWidth="1" />
          <circle
            cx="30"
            cy="30"
            r="20"
            fill="none"
            stroke="var(--color-signal)"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeDasharray="126"
            strokeDashoffset="126"
            className="origin-[30px_30px] animate-[preloaderTrack_1.6s_var(--e-io)_infinite]"
            style={{ filter: 'drop-shadow(0 0 6px var(--signal-a48))' }}
          />
          <circle
            cx="30"
            cy="10"
            r="2.6"
            fill="var(--color-signal)"
            className="origin-[30px_10px] animate-[preloaderCore_1.6s_var(--e-io)_infinite]"
            style={{ filter: 'drop-shadow(0 0 8px var(--signal-a48))' }}
          />
        </svg>

        <div className="flex items-baseline gap-s5 font-mono">
          <span className="min-w-[15ch] text-[length:var(--fs-mono)] uppercase tracking-[var(--tr-mono)] text-text-3">
            {status}
          </span>
          <span className="text-[length:var(--fs-h4)] tabular-nums tracking-[.04em] text-signal">
            {String(Math.round(progress * 100)).padStart(3, '0')}
            <span className="ml-0.5 text-[.6em] text-text-4">%</span>
          </span>
        </div>

        <div className="h-px w-[min(220px,42vw)] overflow-hidden bg-[color:var(--line)]">
          <span
            className="block h-full origin-left bg-signal"
            style={{ transform: `scaleX(${progress})`, boxShadow: '0 0 8px var(--signal-a48)' }}
          />
        </div>
      </div>
    </div>
  );
}
