import { Link } from 'react-router-dom';
import Shot from './Shot';

// Tarjeta de un caso: la captura real dentro de un marco de navegador, con
// el rubro, el nombre y los enlaces. Se usa en la home, en los servicios y
// al pie de cada caso, para que los casos se vean igual en todo el sitio.
export default function CaseCard({ project: p, headingLevel: Heading = 'h3' }) {
  const host = new URL(p.url).hostname.replace(/^www\./, '');
  return (
    <li className="case-card">
      <Link className="case-card-media" to={`/proyectos/${p.slug}`} aria-label={`Ver el caso de ${p.title}`}>
        <span className="browser-bar" aria-hidden="true">
          <i />
          <i />
          <i />
          <span>{host}</span>
        </span>
        <Shot project={p} sizes="(min-width: 900px) 44vw, 82vw" />
      </Link>
      <div className="case-card-body">
        <p className="small muted">{p.tag}</p>
        <Heading className="h3">{p.title}</Heading>
        <p>{p.description}</p>
        <div className="actions">
          <Link className="link" to={`/proyectos/${p.slug}`}>
            Ver el caso
          </Link>
          <a className="link" href={p.url} target="_blank" rel="noopener noreferrer">
            Abrir {host}
          </a>
        </div>
      </div>
    </li>
  );
}
