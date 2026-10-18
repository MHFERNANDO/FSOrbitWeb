import { Link } from 'react-router-dom';
import Icon from './Icon';
import Reveal from './Reveal';
import { contact } from '@/data/content';

const FOOTER_LINKS = [
  { to: '/servicios/diseno-web-cuenca', label: 'Diseño Web en Cuenca' },
  { to: '/servicios/tiendas-online', label: 'Tiendas Online' },
  { to: '/servicios/rediseno-y-optimizacion', label: 'Rediseño y Optimización' },
  { to: '/precios', label: 'Precios' },
  { to: '/proyectos', label: 'Proyectos' },
  { to: '/contacto', label: 'Contacto' },
];

export default function Footer() {
  return (
    <footer className="border-t border-[color:var(--line)]">
      <div className="mx-auto grid max-w-(--maxw) gap-s8 px-(--gutter) py-s9 md:grid-cols-4">
        <Reveal as="div" type="rise" className="grid gap-s4">
          <img src="/assets/Logo.png" alt="FS Orbit" width={50} height={50} loading="lazy" decoding="async"
            className="h-[50px] w-[50px]" style={{ filter: 'brightness(0) invert(1)', opacity: 0.92 }} />
          <p className="max-w-[32ch] text-text-2">Transformando ideas en ecosistemas digitales de alto rendimiento.</p>
        </Reveal>

        <Reveal as="div" type="rise" index={1} className="grid content-start gap-s3">
          <h4 className="font-display text-[length:var(--fs-h4)] font-extrabold">Enlaces</h4>
          {FOOTER_LINKS.map((link) => (
            <Link key={link.to} to={link.to} viewTransition className="text-text-2 transition-colors hover:text-text">
              {link.label}
            </Link>
          ))}
        </Reveal>

        <Reveal as="div" type="rise" index={2} className="grid gap-s4">
          <h4 className="font-display text-[length:var(--fs-h4)] font-extrabold">Contacto Directo</h4>
          <div className="grid gap-s3">
            {[
              { number: contact.whatsappSales, label: '098 311 3942' },
              { number: contact.whatsappSupport, label: '098 758 2463' },
            ].map((wa) => (
              <a
                key={wa.number}
                href={`https://wa.me/${wa.number}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-s4 transition-transform duration-(--d3) hover:translate-x-1"
              >
                <span className="grid size-10 place-items-center rounded-r2 border border-[color:var(--line-2)] text-text-2 transition-colors group-hover:text-signal">
                  <Icon name="whatsapp" fill className="text-lg" />
                </span>
                <span className="grid">
                  <span className="text-[length:var(--fs-small)] text-text-3">WhatsApp</span>
                  <strong className="text-text">{wa.label}</strong>
                </span>
              </a>
            ))}
          </div>
        </Reveal>

        <Reveal as="div" type="rise" index={3} className="grid gap-s4">
          <h4 className="font-display text-[length:var(--fs-h4)] font-extrabold">Escríbenos</h4>
          <p className="text-text-2">¿Prefieres el correo o una llamada?</p>
          <a href={`mailto:${contact.email}`} className="text-text-2 underline-offset-4 transition-colors hover:text-signal hover:underline">
            {contact.email}
          </a>
          <a href={`tel:${contact.tel}`} className="text-text-2 underline-offset-4 transition-colors hover:text-signal hover:underline">
            {contact.telDisplay}
          </a>
          <a
            href={contact.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-s2 text-text-2 transition-colors hover:text-signal"
          >
            <Icon name="instagram" fill />
            Síguenos
          </a>
        </Reveal>
      </div>

      <div className="mx-auto flex max-w-(--maxw) flex-col items-center justify-between gap-s4 border-t border-[color:var(--line)] px-(--gutter) py-s5 text-[length:var(--fs-small)] text-text-3 sm:flex-row">
        <p>&copy; 2026 FS Orbit. Todos los derechos reservados.</p>
        <div className="flex items-center gap-s2">
          <span className="size-1.5 rounded-full bg-[color:var(--line-2)]" />
          Sistemas Operativos Online
        </div>
      </div>
    </footer>
  );
}
