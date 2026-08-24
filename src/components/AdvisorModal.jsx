import { createContext, useContext, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Icon from './Icon';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { advisorSteps, contact } from '@/data/content';

const AdvisorContext = createContext(null);
export const useAdvisor = () => useContext(AdvisorContext);

// Puerto de initAdvisor() en legacy-static/js/script.js: asesor de 3
// pasos que termina abriendo WhatsApp con la seleccion del usuario.
export function AdvisorProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [choice, setChoice] = useState({ servicio: '', prioridad: '' });
  const modalRef = useRef(null);
  const reduceMotion = useReducedMotion();
  useFocusTrap(modalRef, open);
  useEscapeKey(open, () => setOpen(false));

  const openModal = () => {
    setStep(0);
    setChoice({ servicio: '', prioridad: '' });
    setOpen(true);
  };

  const pick = (field, value) => {
    setChoice((c) => ({ ...c, [field]: value }));
    setStep((s) => s + 1);
  };

  const send = () => {
    const text = `¡Hola FS Orbit! 👋 Me interesa el servicio de *${choice.servicio}*. Mi prioridad principal es *${choice.prioridad}*. ¿Me podrían dar más info?`;
    window.open(`https://wa.me/${contact.whatsappSales}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
    setOpen(false);
  };

  const body = (
    <div className="relative w-full max-w-[520px] rounded-r4 border border-[color:var(--line-2)] bg-ink-900 p-s7" style={{ boxShadow: 'var(--shadow-panel)' }}>
      <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar" className="absolute right-s5 top-s5 text-text-3 hover:text-text">
        <Icon name="close" />
      </button>

      {step < 2 ? (
        <StepView
          data={step === 0 ? advisorSteps.step1 : advisorSteps.step2}
          onPick={(value) => pick(step === 0 ? 'servicio' : 'prioridad', value)}
        />
      ) : (
        <div className="grid justify-items-center gap-s5 text-center">
          <span className="grid size-14 place-items-center rounded-full bg-signal-a12 text-signal">
            <Icon name="check" className="text-2xl" />
          </span>
          <h2 className="font-display text-[length:var(--fs-h3)] font-extrabold">¡Todo listo!</h2>
          <p className="max-w-[36ch] text-text-2">
            Haz clic abajo para enviarnos los detalles por WhatsApp y recibir tu presupuesto.
          </p>
          <button
            type="button"
            onClick={send}
            className="inline-flex items-center gap-s3 rounded-r2 bg-signal px-s6 py-s4 font-mono text-[length:var(--fs-mono)] font-bold uppercase tracking-[var(--tr-mono)] text-signal-ink"
          >
            Enviar a WhatsApp
            <Icon name="whatsapp" fill />
          </button>
        </div>
      )}
    </div>
  );

  return (
    <AdvisorContext.Provider value={{ openModal }}>
      {children}

      {/* Movimiento reducido: sin AnimatePresence/motion — ver nota en
          Reveal.jsx sobre transform/opacity via WAAPI quedandose pegado
          en el estado inicial. Aqui el riesgo es peor: si la salida
          nunca "termina", el modal queda huerfano y bloquea la pagina. */}
      {reduceMotion ? (
        open && (
          <div
            className="fixed inset-0 z-[var(--z-modal)] grid place-items-center bg-black/70 p-s5"
            onClick={(e) => e.target === e.currentTarget && setOpen(false)}
            role="dialog"
            aria-modal="true"
          >
            <div ref={modalRef}>{body}</div>
          </div>
        )
      ) : (
        <AnimatePresence>
          {open && (
            <motion.div
              className="fixed inset-0 z-[var(--z-modal)] grid place-items-center bg-black/70 p-s5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => e.target === e.currentTarget && setOpen(false)}
              role="dialog"
              aria-modal="true"
            >
              <motion.div
                ref={modalRef}
                initial={{ opacity: 0, scale: 0.94, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 12 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              >
                {body}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </AdvisorContext.Provider>
  );
}

function StepView({ data, onPick }) {
  return (
    <div className="grid gap-s5">
      <span className="font-mono text-[length:var(--fs-mono)] uppercase tracking-[var(--tr-mono)] text-signal">
        {data.label}
      </span>
      <h2 className="font-display text-[length:var(--fs-h3)] font-extrabold">{data.question}</h2>
      <div className="grid gap-s3">
        {data.options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onPick(opt.value)}
            className="flex items-center gap-s4 rounded-r3 border border-[color:var(--line)] p-s5 text-left transition-colors hover:border-signal-a48 hover:bg-ink-800"
          >
            <Icon name={opt.icon} className="text-signal" />
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
