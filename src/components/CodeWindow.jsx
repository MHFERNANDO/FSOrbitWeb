import { useLayoutEffect, useRef } from 'react';
import { observeOnce } from '@/lib/inView';

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
  string: 'text-[#8FD6A8]',
  boolean: 'text-[#7FB3FF]',
  function: 'text-[#FFD479]',
  punct: 'text-text-3',
  '': 'text-text',
};

const GLYPHS = '01<>{}[]/\\|=+*#$%&_-';
const scramble = (text) => text.replace(/\S/g, () => GLYPHS[(Math.random() * GLYPHS.length) | 0]);

export default function CodeWindow() {
  const ref = useRef(null);

  // Antes: un setState por frame durante 1.1s, re-renderizando las ~25
  // spans del bloque en cada cuadro. Ahora React pinta el texto real una
  // vez y el efecto de "descifrado" escribe textContent directo en cada
  // token (mismo reparto de caracteres, misma curva, mismo retardo).
  // suppressHydrationWarning: el HTML prerenderizado puede traer el texto
  // ya revuelto; no es un error de hidratacion.
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return undefined;
    const tokens = Array.from(root.querySelectorAll('[data-tok]'), (node) => ({ node, text: node.dataset.tok }));
    const totalChars = tokens.reduce((sum, tok) => sum + tok.text.length, 0);

    const paint = (revealed) => {
      let consumed = 0;
      for (const { node, text } of tokens) {
        const start = consumed;
        consumed += text.length;
        if (revealed >= consumed) {
          if (node.textContent !== text) node.textContent = text;
          continue;
        }
        const local = Math.max(0, revealed - start);
        node.textContent = text.slice(0, local) + scramble(text.slice(local));
      }
    };

    paint(0);

    let raf;
    let timeout;
    const stop = observeOnce(
      root,
      () => {
        const duration = 1100;
        timeout = setTimeout(() => {
          const start = performance.now();
          const tick = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - (1 - p) ** 3;
            paint(Math.round(eased * totalChars));
            if (p < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
        }, 220);
      },
      { amount: 0.4 },
    );

    return () => {
      stop();
      clearTimeout(timeout);
      if (raf) cancelAnimationFrame(raf);
      paint(totalChars);
    };
  }, []);

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
            <span key={li} className="relative block whitespace-pre pl-[62px] before:absolute before:left-0 before:w-11 before:text-right before:text-text-3 before:content-[counter(line,decimal-leading-zero)]" style={{ counterIncrement: 'line' }}>
              {line.map((tok, ti) => (
                <span key={ti} className={CLASS_COLOR[tok.c]} data-tok={tok.t} suppressHydrationWarning>
                  {tok.t}
                </span>
              ))}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
