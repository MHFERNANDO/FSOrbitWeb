import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Icon from './Icon';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { contact } from '@/data/content';

const OPTIONS = [
  {
    icon: 'target',
    title: 'Ventas y Proyectos',
    subtitle: 'Consultas comerciales',
    href: `https://wa.me/${contact.whatsappSales}?text=Hola!%20Me%20interesa%20un%20proyecto%20web.`,
  },
  {
    icon: 'shield',
    title: 'Soporte Técnico',
    subtitle: 'Ayuda con tu sitio',
    href: `https://wa.me/${contact.whatsappSupport}?text=Hola!%20Necesito%20soporte%20técnico.`,
  },
];

// Contenido del panel: separado para no duplicarlo entre la rama animada
// (AnimatePresence + motion.div) y la rama de movimiento reducido (div
// plano). Bajo movimiento reducido, algunos navegadores dejan una
// animacion de transform/opacity pegada en su estado inicial para
// siempre (ver Reveal.jsx) — con AnimatePresence eso significa que el
// panel nunca terminaria de "salir" y quedaria huerfano. Mas simple:
// ahi ni se intenta animar.
function ChatPanel({ panelRef, setOpen }) {
  return (
    <>
      <div className="flex items-center justify-between gap-s3 border-b border-[color:var(--line)] p-s5">
        <div className="flex items-center gap-s3">
          <span className="size-2 rounded-full bg-signal" style={{ boxShadow: '0 0 8px var(--signal-a48)' }} />
          <div>
            <p className="font-display text-sm font-bold text-text">FS Orbit Assistant</p>
            <p className="text-[length:var(--fs-small)] text-text-3">Online • Respuesta inmediata</p>
          </div>
        </div>
        <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar chat" className="text-text-3 hover:text-text">
          <Icon name="close" />
        </button>
      </div>

      <div className="grid gap-s4 p-s5">
        <div className="w-fit max-w-[85%] rounded-r3 bg-ink-800 p-s4 text-sm text-text-2">
          ¡Hola! 👋 Bienvenido a FS Orbit. ¿En qué podemos ayudarte hoy?
        </div>
        <p className="text-[length:var(--fs-small)] text-text-3">Selecciona un departamento:</p>

        <div className="grid gap-s2">
          {OPTIONS.map((opt) => (
            <a
              key={opt.title}
              href={opt.href}
              target="_blank"
              rel="noopener"
              className="flex items-center gap-s3 rounded-r3 border border-[color:var(--line)] p-s4 transition-colors hover:border-signal-a48"
            >
              <Icon name={opt.icon} className="text-signal" />
              <span className="grid">
                <strong className="text-sm text-text">{opt.title}</strong>
                <small className="text-[length:var(--fs-micro)] text-text-3">{opt.subtitle}</small>
              </span>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}

const PANEL_CLASS =
  'absolute bottom-[calc(100%+16px)] right-0 w-[min(340px,86vw)] overflow-hidden rounded-r4 border border-[color:var(--line-2)] bg-ink-900';

export default function ChatDock() {
  const [open, setOpen] = useState(false);
  const dockRef = useRef(null);
  const panelRef = useRef(null);
  const reduceMotion = useReducedMotion();
  useFocusTrap(panelRef, open);

  useEffect(() => {
    if (!open) return undefined;
    const onClick = (e) => {
      if (dockRef.current && !dockRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={dockRef} className="fixed bottom-s6 right-s6 z-[var(--z-dock)]">
      {reduceMotion ? (
        open && (
          <div ref={panelRef} role="dialog" aria-label="Chat FS Orbit" className={PANEL_CLASS} style={{ boxShadow: 'var(--shadow-panel)' }}>
            <ChatPanel panelRef={panelRef} setOpen={setOpen} />
          </div>
        )
      ) : (
        <AnimatePresence>
          {open && (
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-label="Chat FS Orbit"
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className={PANEL_CLASS}
              style={{ boxShadow: 'var(--shadow-panel)' }}
            >
              <ChatPanel panelRef={panelRef} setOpen={setOpen} />
            </motion.div>
          )}
        </AnimatePresence>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Cerrar chat' : 'Abrir chat'}
        aria-expanded={open}
        className="relative grid size-14 place-items-center rounded-full bg-signal text-signal-ink transition-transform hover:scale-105"
        style={{ boxShadow: '0 0 24px var(--signal-a48)' }}
      >
        <Icon name="chat" className="text-xl" />
        {!open && (
          <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-signal-a24" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
