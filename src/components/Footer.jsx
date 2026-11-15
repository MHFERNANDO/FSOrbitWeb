import { Link } from 'react-router-dom';
import { contact, services, waLink } from '@/data/content';
import { trackClick } from '@/lib/analytics';

export default function Footer() {
  return (
    <footer className="site-foot">
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-about">
            <Link to="/" className="brand" aria-label="FS Orbit, inicio">
              <img src="/assets/Emblem-96.webp" width="34" height="34" alt="" loading="lazy" />
              FS Orbit
            </Link>
            <p>
              Estudio de desarrollo web de Cuenca, Azuay. Trabajamos de forma remota con negocios de todo Ecuador; no atendemos en
              una oficina abierta al público.
            </p>
          </div>
          <nav aria-label="Servicios">
            <h2>Servicios</h2>
            <ul>
              {services.map((s) => (
                <li key={s.href}>
                  <Link to={s.href}>{s.title}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Sitio">
            <h2>Sitio</h2>
            <ul>
              <li>
                <Link to="/proyectos">Casos</Link>
              </li>
              <li>
                <Link to="/precios">Planes y precios</Link>
              </li>
              <li>
                <Link to="/proceso">Proceso</Link>
              </li>
              <li>
                <Link to="/sobre-nosotros">Sobre nosotros</Link>
              </li>
              <li>
                <Link to="/blog">Blog</Link>
              </li>
              <li>
                <Link to="/politica-de-privacidad">Política de privacidad</Link>
              </li>
            </ul>
          </nav>
          <div>
            <h2>Contacto</h2>
            <ul>
              <li>
                <a
                  href={waLink('Hola, quiero cotizar un proyecto web')}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackClick('whatsapp', { source: 'footer_ventas' })}
                >
                  WhatsApp ventas: {contact.salesDisplay}
                </a>
              </li>
              <li>
                <a
                  href={waLink('Hola, necesito soporte técnico', contact.whatsappSupport)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackClick('whatsapp', { source: 'footer_soporte' })}
                >
                  WhatsApp soporte: {contact.supportDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${contact.email}`} onClick={() => trackClick('email', { source: 'footer' })}>
                  {contact.email}
                </a>
              </li>
              <li>
                <a href={contact.instagram} target="_blank" rel="noopener noreferrer">
                  Instagram @fs_orbit
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="foot-legal">
          <span>© {new Date().getFullYear()} FS Orbit. Cuenca, Ecuador.</span>
          <span>Este sitio está escrito a mano, sin plantillas.</span>
        </div>
      </div>
    </footer>
  );
}
