import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import WaButton from './WaButton';

// Barra fija de WhatsApp para celular. Se muestra cuando no hay otro
// boton de WhatsApp a la vista (los marcados con data-dock-hide).
export default function Dock() {
  const { pathname } = useLocation();
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (pathname === '/contacto') return undefined;
    const visible = new Set();
    const update = () => setOn(visible.size === 0 && window.scrollY > 200);
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
      update();
    });
    const timer = setTimeout(() => {
      document.querySelectorAll('[data-dock-hide]').forEach((el) => io.observe(el));
    }, 300);
    window.addEventListener('scroll', update, { passive: true });
    return () => {
      clearTimeout(timer);
      io.disconnect();
      window.removeEventListener('scroll', update);
    };
  }, [pathname]);

  // En Contacto la pagina entera es el camino a WhatsApp: sin barra.
  const shown = on && pathname !== '/contacto';
  return (
    <div className="dock" data-on={shown} inert={!shown}>
      <WaButton source="dock" />
    </div>
  );
}
