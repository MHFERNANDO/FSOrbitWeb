import { useLayoutEffect, useRef } from 'react';
import { observeOnce, pausedAnimation, EASE_OUT } from '@/lib/inView';

// Antes cada palabra era un motion.span con su propio useInView (un
// observer y un estado de React por palabra). Ahora el titulo entero
// tiene un solo observer compartido y cada palabra sube con una Web
// Animation propia: mismo recorrido (110% -> 0), misma duracion (1.2s),
// mismo escalonado (0.12s por palabra) y misma curva.
function Word({ children }) {
  return (
    <span className="mb-[-0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom">
      <span className="inline-block" data-word="">
        {children}
      </span>
    </span>
  );
}

export function Highlight({ children }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const anim = pausedAnimation(el, [{ backgroundSize: '0% .055em' }, { backgroundSize: '100% .055em' }], {
      duration: 2000,
      delay: 420,
      easing: EASE_OUT,
    });
    const stop = observeOnce(el, () => anim.play(), { amount: 0.12 });
    return () => {
      stop();
      anim.cancel();
    };
  }, []);

  return (
    <span
      ref={ref}
      className="text-signal"
      style={{
        backgroundImage: 'linear-gradient(var(--color-signal), var(--color-signal))',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '0 calc(100% - .04em)',
        backgroundSize: '100% .055em',
      }}
    >
      {children}
    </span>
  );
}

export default function SplitHeading({ as: Tag = 'h2', segments, className }) {
  const ref = useRef(null);
  // segments llega como literal nuevo en cada render del padre: la
  // dependencia es el texto, no la identidad del array.
  const textKey = segments.map((s) => (s.break ? '/' : s.text)).join('|');

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const anims = Array.from(el.querySelectorAll('[data-word]'), (word, i) =>
      pausedAnimation(word, [{ transform: 'translateY(110%)' }, { transform: 'none' }], {
        duration: 1200,
        delay: i * 120,
        easing: EASE_OUT,
      }),
    );
    const stop = observeOnce(el, () => anims.forEach((a) => a.play()), {
      amount: 0.12,
      margin: '0px 0px -8% 0px',
    });
    return () => {
      stop();
      anims.forEach((a) => a.cancel());
    };
  }, [textKey]);

  const renderWords = (text) =>
    text.split(/(\s+)/).map((chunk, i) => {
      if (!chunk.trim()) return chunk;
      return <Word key={`${i}-${chunk}`}>{chunk}</Word>;
    });

  return (
    <Tag ref={ref} className={className}>
      {segments.map((seg, i) => {
        // Espacio antes del <br>: visualmente no cambia nada, pero los
        // extractores de texto que solo quitan etiquetas (varios bots de
        // IA) leian "Páginas webdiseñadas" pegado.
        if (seg.break) return [' ', <br key={i} />];
        // Espacio real entre segmentos consecutivos sin <br> (p. ej.
        // "Ingeniería de" + "Alto Rendimiento"): sin esto el DOM queda
        // "...de</span><span>Alto..." pegado para cualquier crawler que
        // no ejecute JS o copie el texto.
        const needsSpace = i > 0 && !segments[i - 1].break;
        const words = renderWords(seg.text);
        const node = seg.highlight ? <Highlight key={i}>{words}</Highlight> : <span key={i}>{words}</span>;
        return needsSpace ? [' ', node] : node;
      })}
    </Tag>
  );
}
