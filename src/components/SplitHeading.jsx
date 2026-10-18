import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

const EASE_OUT = [0.22, 1, 0.36, 1];

function Word({ index, children }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.12, margin: '0px 0px -8% 0px' });

  return (
    <span ref={ref} className="mb-[-0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom">
      <motion.span
        className="inline-block"
        initial={{ y: '110%' }}
        animate={isInView ? { y: 0 } : { y: '110%' }}
        transition={{ duration: 1.2, delay: index * 0.12, ease: EASE_OUT }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function Highlight({ children }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.12 });

  const baseStyle = {
    backgroundImage: 'linear-gradient(var(--signal-a48), var(--signal-a48))',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '0 calc(100% - .04em)',
  };

  return (
    <motion.span
      ref={ref}
      className="text-signal"
      style={baseStyle}
      initial={{ backgroundSize: '0% .055em' }}
      animate={isInView ? { backgroundSize: '100% .055em' } : { backgroundSize: '0% .055em' }}
      transition={{ duration: 2.0, delay: 0.42, ease: EASE_OUT }}
    >
      {children}
    </motion.span>
  );
}

export default function SplitHeading({ as: Tag = 'h2', segments, className }) {
  let wordIndex = 0;

  const renderWords = (text) =>
    text.split(/(\s+)/).map((chunk, i) => {
      if (!chunk.trim()) return chunk;
      const idx = wordIndex++;
      return (
        <Word key={`${idx}-${chunk}`} index={idx}>
          {chunk}
        </Word>
      );
    });

  return (
    <Tag className={cn(className)}>
      {segments.map((seg, i) => {
        if (seg.break) return <br key={i} />;
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
