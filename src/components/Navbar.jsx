import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from './Icon';
import { useFocusTrap } from '@/hooks/useFocusTrap';

const EASE_OUT = [0.22, 1, 0.36, 1];

const NAV_LINKS = [
  { href: '/#servicios', label: 'Servicios' },
  { href: '/proyectos', label: 'Proyectos' },
  { href: '/precios', label: 'Precios' },
];

const DRAWER_CLASS =
  'fixed inset-0 z-[calc(var(--z-nav)+1)] flex flex-col items-start justify-center gap-s6 border-l border-[color:var(--line)] bg-ink-1000 px-(--gutter) md:hidden';

function DrawerLinks({ onNavigate, onHablemos }) {
  return (
    <>
      {NAV_LINKS.map((link) => (
        <li key={link.href}>
          <a
            href={link.href}
            onClick={onNavigate}
            className="font-display text-2xl font-extrabold tracking-[var(--tr-title)] text-text"
          >
            {link.label}
          </a>
        </li>
      ))}
      <li>
        <motion.div
          className="inline-block"
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.3, ease: EASE_OUT }}
        >
          <a
            href="/contacto"
            onClick={onHablemos}
            className="inline-flex rounded-r2 bg-signal px-5 py-[11px] font-mono text-[length:var(--fs-mono)] font-bold uppercase tracking-[var(--tr-mono)] text-signal-ink"
            style={{ display: 'inline-flex', boxShadow: 'none', transition: 'box-shadow 300ms ease-out' }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 6px 16px rgba(34, 228, 245, 0.14)'}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
          >
            Hablemos
          </a>
        </motion.div>
      </li>
    </>
  );
}

// Puerto de initNav() en core.js: barra sticky que se condensa al hacer
// scroll, barra de progreso de lectura sobre la hairline, y cajon movil.
export default function Navbar() {
  const location = useLocation();
  const isProyectos = location.pathname.startsWith('/proyectos');
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef(null);

  useFocusTrap(drawerRef, drawerOpen);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      setScrolled(y > 24);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(y / max, 1) : 0);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => window.removeEventListener('scroll', onScroll);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  useEffect(() => {
    if (!drawerOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setDrawerOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [drawerOpen]);

  const goHablemos = () => setDrawerOpen(false);

  return (
    <nav
      className="sticky top-0 z-[var(--z-nav)] flex items-center border-b border-[color:var(--line)] transition-[height,background-color]"
      style={{
        height: scrolled ? '62px' : 'var(--nav-h)',
        transitionDuration: 'var(--d3)',
        background: 'color-mix(in srgb, var(--color-ink-1000) 92%, transparent)',
        backdropFilter: 'blur(16px) saturate(150%)',
        WebkitBackdropFilter: 'blur(16px) saturate(150%)',
      }}
    >
      <div className="mx-auto flex w-full max-w-(--maxw) items-center justify-between gap-s5 px-(--gutter)">
        <Link to="/" viewTransition className="flex items-center" aria-label="FS Orbit — inicio">
          <img
            src="/assets/Logo.png"
            alt="FS Orbit"
            width={90}
            height={90}
            decoding="async"
            className="h-[42px] w-auto opacity-[.92] transition-[transform,opacity] duration-(--d4) hover:rotate-[-8deg] hover:scale-[1.06] hover:opacity-100"
            style={{ filter: 'brightness(0) invert(1)' }}
          />
        </Link>

        {isProyectos ? (
          <Link
            viewTransition
            to="/"
            className="inline-flex items-center gap-s3 font-mono text-[length:var(--fs-mono)] font-bold uppercase tracking-[var(--tr-mono)] text-text-2 transition-colors duration-(--d2) hover:text-signal [&:hover_svg]:-translate-x-1"
          >
            <Icon name="arrow-left" className="text-[1.35em] transition-transform duration-(--d3)" />
            Volver
          </Link>
        ) : (
          <>
            <button
              type="button"
              className="relative z-20 h-10 w-10 md:hidden"
              aria-label={drawerOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={drawerOpen}
              onClick={() => setDrawerOpen((v) => !v)}
            >
              <span
                className="absolute left-[9px] top-[15px] h-[1.5px] w-[22px] bg-text transition-transform duration-(--d3)"
                style={{ transform: drawerOpen ? 'translateY(5px) rotate(45deg)' : 'none' }}
              />
              <span
                className="absolute left-[9px] top-[20px] h-[1.5px] w-[22px] bg-text transition-[opacity,transform] duration-(--d3)"
                style={{ opacity: drawerOpen ? 0 : 1, transform: drawerOpen ? 'scaleX(0)' : 'none' }}
              />
              <span
                className="absolute left-[9px] top-[25px] h-[1.5px] bg-text transition-[width,transform] duration-(--d3)"
                style={{ width: drawerOpen ? '22px' : '14px', transform: drawerOpen ? 'translateY(-5px) rotate(-45deg)' : 'none' }}
              />
            </button>

            <ul className="hidden items-center gap-s7 md:flex">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="group relative block py-s2 font-mono text-[length:var(--fs-mono)] font-medium uppercase tracking-[var(--tr-mono)] text-text-2 transition-colors duration-(--d2) hover:text-text"
                  >
                    {link.label}
                    <span className="absolute inset-x-0 bottom-0 h-px origin-right scale-x-0 bg-signal transition-transform duration-(--d3) group-hover:origin-left group-hover:scale-x-100" />
                  </a>
                </li>
              ))}
              <li>
                <motion.div
                  className="inline-block"
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.3, ease: EASE_OUT }}
                >
                  <a
                    href="/contacto"
                    onClick={goHablemos}
                    className="inline-flex rounded-r2 bg-signal px-5 py-[11px] font-mono text-[length:var(--fs-mono)] font-bold uppercase tracking-[var(--tr-mono)] text-signal-ink"
                    style={{ display: 'inline-flex', boxShadow: 'none', transition: 'box-shadow 300ms ease-out' }}
                    onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 6px 16px rgba(34, 228, 245, 0.14)'}
                    onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
                  >
                    Hablemos
                  </a>
                </motion.div>
              </li>
            </ul>

            {createPortal(
              <AnimatePresence>
                {drawerOpen && (
                  <motion.ul
                    ref={drawerRef}
                    className={DRAWER_CLASS}
                    style={{ paddingTop: 'calc(var(--nav-h) + var(--spacing-s7))', paddingBottom: 'var(--gutter)' }}
                    initial={{ clipPath: 'circle(0% at calc(100% - 40px) 32px)' }}
                    animate={{ clipPath: 'circle(150% at calc(100% - 40px) 32px)' }}
                    exit={{ clipPath: 'circle(0% at calc(100% - 40px) 32px)' }}
                    transition={{ duration: 1.3, ease: [0.76, 0, 0.24, 1] }}
                  >
                    <DrawerLinks onNavigate={() => setDrawerOpen(false)} onHablemos={goHablemos} />
                  </motion.ul>
                )}
              </AnimatePresence>,
              document.body,
            )}
          </>
        )}
      </div>

      <span
        className="absolute inset-x-0 -bottom-px h-px origin-left bg-signal"
        style={{
          transform: `scaleX(${progress})`,
          opacity: progress > 0.001 ? 1 : 0,
          boxShadow: progress > 0.001 ? '0 0 6px var(--signal-a24)' : 'none',
          transitionProperty: 'opacity, box-shadow',
          transitionDuration: '0ms',
          transitionTimingFunction: 'ease-out'
        }}
        aria-hidden="true"
      />
    </nav>
  );
}
