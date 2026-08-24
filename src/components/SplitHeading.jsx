import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const EASE_OUT = [0.22, 1, 0.36, 1];

function Word({ index, children }) {
  return (
    <span className="mb-[-0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom">
      <motion.span
        className="inline-block"
        initial={{ y: '110%' }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, amount: 0.12, margin: '0px 0px -8% 0px' }}
        transition={{ duration: 1.15, delay: index * 0.07, ease: EASE_OUT }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function Highlight({ children }) {
  const baseStyle = {
    backgroundImage: 'linear-gradient(var(--signal-a48), var(--signal-a48))',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '0 calc(100% - .04em)',
  };

  return (
    <motion.span
      className="text-signal"
      style={baseStyle}
      initial={{ backgroundSize: '0% .055em' }}
      whileInView={{ backgroundSize: '100% .055em' }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 1.1, delay: 0.42, ease: EASE_OUT }}
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
        const words = renderWords(seg.text);
        if (seg.highlight) return <Highlight key={i}>{words}</Highlight>;
        return <span key={i}>{words}</span>;
      })}
    </Tag>
  );
}
