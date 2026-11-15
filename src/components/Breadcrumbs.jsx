import { Link } from 'react-router-dom';

export default function Breadcrumbs({ crumbs }) {
  if (!crumbs || crumbs.length < 2) return null;
  return (
    <nav aria-label="Ruta de navegación">
      <ol className="crumbs">
        {crumbs.map((c, i) => (
          <li key={c.path}>
            {i === crumbs.length - 1 ? <span aria-current="page">{c.name}</span> : <Link to={c.path}>{c.name}</Link>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
