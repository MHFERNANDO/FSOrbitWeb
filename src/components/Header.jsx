import { useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import WaButton from './WaButton';
import { lockScroll } from '@/lib/scroll';

const LINKS = [
  { to: '/servicios', label: 'Servicios' },
  { to: '/proyectos', label: 'Casos' },
  { to: '/precios', label: 'Planes' },
  { to: '/proceso', label: 'Proceso' },
  { to: '/contacto', label: 'Contacto' },
];

function Brand() {
  return (
    <Link to="/" className="brand" aria-label="FS Orbit, inicio">
      <img src="/assets/Emblem-96.webp" width="34" height="34" alt="" />
      FS Orbit
    </Link>
  );
}

export default function Header() {
  const sheet = useRef(null);
  const { pathname } = useLocation();

  const close = () => {
    if (sheet.current?.open) sheet.current.close();
  };

  // Al cambiar de pagina el menu se cierra solo.
  useEffect(() => {
    close();
  }, [pathname]);

  return (
    <>
      <header className="site-head">
        <div className="wrap">
          <Brand />
          <nav className="nav" aria-label="Principal">
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to}>
                {l.label}
              </NavLink>
            ))}
            <WaButton variant="btn--small" source="header" />
          </nav>
          <button
            type="button"
            className="menu-btn"
            aria-haspopup="dialog"
            onClick={() => {
              sheet.current?.showModal();
              lockScroll(true);
            }}
          >
            Menú
          </button>
        </div>
      </header>

      <dialog ref={sheet} className="sheet" aria-label="Menú" onClose={() => lockScroll(false)}>
        <div className="sheet-in">
          <div className="sheet-top">
            <Brand />
            <button type="button" className="menu-btn" onClick={close}>
              Cerrar
            </button>
          </div>
          <nav className="sheet-links" aria-label="Principal, celular">
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} onClick={close}>
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="sheet-foot">
            <WaButton source="menu" />
            <p className="small muted">Cuenca, Azuay. Proyectos en todo Ecuador.</p>
          </div>
        </div>
      </dialog>
    </>
  );
}
