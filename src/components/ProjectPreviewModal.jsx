import { createContext, useContext, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Icon from './Icon';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useEscapeKey } from '@/hooks/useEscapeKey';

const PreviewContext = createContext(null);
export const useProjectPreview = () => useContext(PreviewContext);

// Puerto de initProjectPreview() en core.js: modal con iframe para ver un
// proyecto sin salir del sitio.
export function ProjectPreviewProvider({ children }) {
  const [url, setUrl] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const modalRef = useRef(null);
  const reduceMotion = useReducedMotion();
  useFocusTrap(modalRef, Boolean(url));

  const open = (targetUrl) => {
    setLoaded(false);
    setUrl(targetUrl);
  };
  const close = () => setUrl(null);
  useEscapeKey(Boolean(url), close);

  const body = (
    <div
      ref={modalRef}
      className="relative flex w-full max-w-[1100px] flex-col overflow-hidden rounded-r4 border border-[color:var(--line-2)] bg-ink-900"
      style={{ boxShadow: 'var(--shadow-panel)', height: 'min(720px, 86vh)' }}
    >
      <button
        type="button"
        onClick={close}
        aria-label="Cerrar vista previa"
        className="absolute right-s4 top-s4 z-10 grid size-9 place-items-center rounded-full bg-ink-1000/80 text-text-2 hover:text-text"
      >
        <Icon name="close" />
      </button>

      <div className="relative flex-1 bg-ink-1000">
        {!loaded && (
          <div className="absolute inset-0 grid place-items-center gap-s3 text-text-3">
            <span className="size-8 animate-spin rounded-full border-2 border-[color:var(--line-2)] border-t-signal" />
            <p>Cargando proyecto...</p>
          </div>
        )}
        <iframe
          src={url}
          title="Vista previa del proyecto"
          loading="lazy"
          allowFullScreen
          onLoad={() => setLoaded(true)}
          className="h-full w-full transition-opacity duration-300"
          style={{ opacity: loaded ? 1 : 0 }}
        />
      </div>

      <div className="flex justify-end border-t border-[color:var(--line)] p-s4">
        <a
          href={url}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-s2 rounded-r2 bg-signal px-s5 py-s3 font-mono text-[length:var(--fs-mono)] font-bold uppercase tracking-[var(--tr-mono)] text-signal-ink"
        >
          Visitar Web Oficial
          <Icon name="arrow-ur" />
        </a>
      </div>
    </div>
  );

  return (
    <PreviewContext.Provider value={{ open }}>
      {children}

      {/* Ver AdvisorModal.jsx: bajo movimiento reducido se salta
          AnimatePresence/motion por completo, no solo se acorta. */}
      {reduceMotion ? (
        url && (
          <div
            className="fixed inset-0 z-[var(--z-modal)] grid place-items-center bg-black/80 p-s5"
            onClick={(e) => e.target === e.currentTarget && close()}
            role="dialog"
            aria-modal="true"
            aria-label="Vista previa del proyecto"
          >
            {body}
          </div>
        )
      ) : (
        <AnimatePresence>
          {url && (
            <motion.div
              className="fixed inset-0 z-[var(--z-modal)] grid place-items-center bg-black/80 p-s5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => e.target === e.currentTarget && close()}
              role="dialog"
              aria-modal="true"
              aria-label="Vista previa del proyecto"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              >
                {body}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </PreviewContext.Provider>
  );
}
