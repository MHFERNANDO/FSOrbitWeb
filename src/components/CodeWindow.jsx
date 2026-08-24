import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

// Cada linea, ya tokenizada: [{ text, cls }]. cls referencia los mismos
// nombres que .keyword/.variable/.string/.boolean/.function/.punct de la
// version estatica (colores portados a src/index.css).
const LINES = [
  [{ t: 'const', c: 'keyword' }, { t: ' ', c: '' }, { t: 'fsOrbit', c: 'variable' }, { t: ' = ', c: 'punct' }, { t: '{', c: 'punct' }],
  [{ t: '  performance: ', c: 'punct' }, { t: "'100%'", c: 'string' }, { t: ',', c: 'punct' }],
  [{ t: '  security: ', c: 'punct' }, { t: "'Maximum'", c: 'string' }, { t: ',', c: 'punct' }],
  [{ t: '  custom: ', c: 'punct' }, { t: 'true', c: 'boolean' }, { t: ',', c: 'punct' }],
  [{ t: '  render: ', c: 'punct' }, { t: '() => ', c: 'punct' }, { t: 'innovate', c: 'function' }, { t: '()', c: 'punct' }],
  [{ t: '};', c: 'punct' }],
];

const CLASS_COLOR = {
  keyword: 'text-[#C792EA]',
  variable: 'text-text',
  string: 'text-signal',
  boolean: 'text-[#7FB3FF]',
  function: 'text-[#FFD479]',
  punct: 'text-text-3',
  '': 'text-text',
};

const GLYPHS = '01<>{}[]/\\|=+*#$%&_-';
const scramble = (text) => text.replace(/\S/g, () => GLYPHS[(Math.random() * GLYPHS.length) | 0]);

export default function CodeWindow() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduceMotion = useReducedMotion();
  const [revealedChars, setRevealedChars] = useState(reduceMotion ? Infinity : 0);

  const totalChars = LINES.reduce((sum, line) => sum + line.reduce((s, tok) => s + tok.t.length, 0), 0);

  useEffect(() => {
    if (!inView || reduceMotion) return undefined;
    const duration = 1100;
    const start = performance.now();
    let raf;

    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - p) ** 3;
      setRevealedChars(Math.round(eased * totalChars));
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    const timeout = setTimeout(() => {
      raf = requestAnimationFrame(tick);
    }, 220);

    return () => {
      clearTimeout(timeout);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [inView, reduceMotion, totalChars]);

  let consumed = 0;

  return (
    <div ref={ref} className="relative overflow-hidden rounded-r4 border border-[color:var(--line-2)] bg-ink-900">
      <div className="flex items-center gap-s2 border-b border-[color:var(--line)] px-s5 py-s3">
        <span className="size-2.5 rounded-full bg-[#FF5F57]" />
        <span className="size-2.5 rounded-full bg-[#FEBC2E]" />
        <span className="size-2.5 rounded-full bg-[#28C840]" />
        <span className="ml-s3 font-mono text-[length:var(--fs-micro)] text-text-3">fs-orbit.config.js</span>
      </div>

      <pre className="overflow-x-auto p-s6 font-mono text-[length:var(--fs-small)] leading-[1.7]">
        <code style={{ counterReset: 'line' }}>
          {LINES.map((line, li) => (
            <span key={li} className="relative block whitespace-pre pl-[62px] before:absolute before:left-0 before:w-11 before:text-right before:text-text-4 before:content-[counter(line,decimal-leading-zero)]" style={{ counterIncrement: 'line' }}>
              {line.map((tok, ti) => {
                const start = consumed;
                consumed += tok.t.length;
                const end = consumed;
                let display = tok.t;
                if (revealedChars < end) {
                  const localRevealed = Math.max(0, revealedChars - start);
                  display = tok.t.slice(0, localRevealed) + scramble(tok.t.slice(localRevealed));
                }
                return (
                  <span key={ti} className={CLASS_COLOR[tok.c]}>
                    {display}
                  </span>
                );
              })}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
