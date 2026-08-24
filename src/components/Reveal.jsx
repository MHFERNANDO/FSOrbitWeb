import { motion } from 'framer-motion';

// Reemplaza el motor [data-reveal] + IntersectionObserver a mano de
// legacy-static/js/core.js. whileInView + viewport.once ya resuelve el
// caso que tuvo que parchearse ahi (salto de scroll instantaneo que se
// salta la franja donde dispara el observer).
const variants = {
  rise: { hidden: { opacity: 0, y: 26 }, show: { opacity: 1, y: 0 } },
  fade: { hidden: { opacity: 0 }, show: { opacity: 1 } },
  scale: { hidden: { opacity: 0, scale: 0.965 }, show: { opacity: 1, scale: 1 } },
  left: { hidden: { opacity: 0, x: -28 }, show: { opacity: 1, x: 0 } },
  mask: {
    hidden: { opacity: 0, y: 14, clipPath: 'inset(0 0 100% 0)' },
    show: { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' },
  },
};

const EASE_OUT = [0.22, 1, 0.36, 1];

// React 19: ref ya es una prop normal en componentes de funcion, no hace
// falta forwardRef para que useMagnetic/useCursorTag puedan engancharse
// al nodo real que monta motion[as].
export default function Reveal({ as = 'div', type = 'rise', index = 0, className, children, ref, ...props }) {
  const MotionTag = motion[as] ?? motion.div;
  const v = variants[type] ?? variants.rise;

  return (
    <MotionTag
      ref={ref}
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.12, margin: '0px 0px -8% 0px' }}
      variants={v}
      transition={{ duration: 0.85, delay: index * 0.11, ease: EASE_OUT }}
      {...props}
    >
      {children}
    </MotionTag>
  );
}
