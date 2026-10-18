import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

// Puerto de buildOdometer()/runOdometer() en core.js: cada digito es una
// tira real 0-9 duplicada (dos vueltas) para que haya recorrido que girar
// al aterrizar, en vez de reescribir textContent cuadro a cuadro.
export default function Odometer({ value }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [ran, setRan] = useState(false);

  useEffect(() => {
    if (inView) setRan(true);
  }, [inView]);

  const digits = String(value).split('');

  return (
    <span ref={ref} className="odo inline-flex leading-none" role="img" aria-label={value}>
      {digits.map((digit, i) => {
        const target = Number(digit);
        const dist = ran ? 10 + target : 0;
        return (
          <span key={i} className="block h-[1em] overflow-hidden">
            <span
              className="block"
              style={{
                transform: `translateY(${dist * -5}%)`,
                transitionProperty: 'transform',
                transitionDuration: '1550ms',
                transitionDelay: `${i * 120}ms`,
                transitionTimingFunction: 'var(--e-out)',
              }}
              aria-hidden="true"
            >
              {[0, 1].flatMap((pass) =>
                Array.from({ length: 10 }, (_, d) => (
                  <span key={`${pass}-${d}`} className="block h-[1em]">
                    {d}
                  </span>
                )),
              )}
            </span>
          </span>
        );
      })}
    </span>
  );
}
