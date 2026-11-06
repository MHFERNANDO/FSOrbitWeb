import { Link } from 'react-router-dom';

// Migas visibles. Reciben el mismo arreglo `crumbs` que usa el JSON-LD
// (BreadcrumbList) para que lo que ve la persona y lo que lee Google
// sea siempre identico.
export default function Breadcrumbs({ crumbs }) {
  if (!crumbs || crumbs.length < 2) return null;
  return (
    <nav aria-label="Migas de pan" className="mb-s6">
      <ol className="flex flex-wrap items-center gap-x-s2 gap-y-1 font-mono text-[length:var(--fs-small)] text-text-3">
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={c.path} className="flex items-center gap-s2">
              {last ? (
                <span aria-current="page" className="text-text-2">
                  {c.name}
                </span>
              ) : (
                <Link to={c.path} viewTransition className="underline-offset-4 transition-colors hover:text-text hover:underline">
                  {c.name}
                </Link>
              )}
              {!last && <span aria-hidden="true">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
