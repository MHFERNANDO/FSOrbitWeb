import { Link } from 'react-router-dom';
import Reveal from '@/components/Reveal';
import Icon from '@/components/Icon';
import { useSeo } from '@/hooks/useSeo';

const LINKS = [
  { to: '/servicios/diseno-web-cuenca', label: 'Diseño Web en Cuenca' },
  { to: '/servicios/tiendas-online', label: 'Tiendas Online' },
  { to: '/servicios/rediseno-y-optimizacion', label: 'Rediseño y Optimización' },
  { to: '/precios', label: 'Precios' },
  { to: '/proyectos', label: 'Proyectos' },
  { to: '/contacto', label: 'Contacto' },
];

// Se usa tanto para el 404 real (ruta "*" en App.jsx) como para el
// archivo estatico 404.html que Vercel sirve cuando no hay match —
// ver scripts/prerender.mjs.
export default function NotFound() {
  useSeo({
    title: 'Página no encontrada | FS Orbit',
    description: 'Esta página no existe. Volvé al inicio o explorá nuestros servicios de desarrollo web en Cuenca, Ecuador.',
    path: '/404',
    noindex: true,
  });

  return (
    <main id="main">
      <div className="mx-auto grid max-w-(--maxw) place-items-start gap-s7 px-(--gutter) py-[clamp(96px,14vw,196px)]">
        <Reveal as="span" type="fade" className="font-mono text-[length:var(--fs-mono)] uppercase tracking-[var(--tr-mono)] text-signal">
          Error 404
        </Reveal>
        <Reveal as="h1" type="rise" index={1} className="max-w-[16ch] font-display text-[length:var(--fs-h1)] font-extrabold leading-[var(--lh-tight)]">
          Esta página no existe.
        </Reveal>
        <Reveal as="p" type="rise" index={2} className="max-w-[48ch] text-text-2">
          Puede que el enlace esté roto o la página se haya movido. Probá con alguno de estos accesos directos:
        </Reveal>

        <Reveal as="div" type="rise" index={3} className="grid w-full gap-s3 sm:grid-cols-2">
          {LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              viewTransition
              className="group flex items-center justify-between gap-s3 rounded-r3 border border-[color:var(--line)] px-s5 py-s4 transition-colors hover:border-signal hover:text-signal"
            >
              {link.label}
              <Icon name="arrow-right" className="transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </Reveal>

        <Reveal as="div" type="rise" index={4}>
          <Link to="/" viewTransition className="inline-flex items-center gap-s2 font-mono text-[length:var(--fs-mono)] font-bold uppercase tracking-[var(--tr-mono)] text-signal">
            <Icon name="arrow-left" />
            Volver al inicio
          </Link>
        </Reveal>
      </div>
    </main>
  );
}
