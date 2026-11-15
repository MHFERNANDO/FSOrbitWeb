import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Display from '@/components/Display';
import WaButton from '@/components/WaButton';
import { useSeo } from '@/hooks/useSeo';

const LINKS = [
  { to: '/servicios', label: 'Servicios' },
  { to: '/proyectos', label: 'Casos' },
  { to: '/precios', label: 'Planes y precios' },
  { to: '/proceso', label: 'Proceso' },
  { to: '/blog', label: 'Blog' },
  { to: '/contacto', label: 'Contacto' },
];

// Se usa para el 404 de navegacion interna (ruta "*") y para el archivo
// estatico 404.html que sirve Vercel (scripts/prerender.mjs).
export default function NotFound() {
  const { pathname } = useLocation();
  // La direccion se pinta al montar: el 404.html estatico sirve para
  // cualquier URL, asi que no puede traerla horneada.
  const [shown, setShown] = useState('');
  useEffect(() => setShown(pathname), [pathname]);
  useSeo({
    title: 'Página no encontrada | FS Orbit',
    description: 'Esta página no existe. Vuelve al inicio o revisa los servicios de desarrollo web de FS Orbit en Cuenca, Ecuador.',
    path: '/404',
    noindex: true,
  });

  return (
    <main id="main" className="wrap state">
      <Display lines={['Esta página', 'no existe']} scrub={false} />
      <p>
        La dirección puede estar mal escrita o la página se movió. No es algo que hayas hecho mal. Desde aquí llegas a todo el sitio:
      </p>
      <code suppressHydrationWarning>{shown}</code>
      <ul className="actions" aria-label="Páginas principales">
        {LINKS.map((l) => (
          <li key={l.to}>
            <Link className="link" to={l.to}>
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
      <div className="actions">
        <Link className="btn" to="/">
          Ir al inicio
        </Link>
        <WaButton variant="btn--ghost" source="404" text="Hola, buscaba una página de fsorbit.com y no la encontré" />
      </div>
    </main>
  );
}
