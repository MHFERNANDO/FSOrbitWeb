import { Link } from 'react-router-dom';

const LINK_RE = /\[([^\]]+)\]\((\/[^)\s]*)\)/g;

// Convierte "texto [ancla](/ruta) texto" en nodos de React con <Link>
// reales (salen como <a href> en el HTML prerenderizado). Un solo formato
// para enlazar internamente desde los datos (blog, servicios, casos).
export function renderInline(text) {
  const out = [];
  let last = 0;
  let match;
  LINK_RE.lastIndex = 0;
  while ((match = LINK_RE.exec(text)) !== null) {
    if (match.index > last) out.push(text.slice(last, match.index));
    out.push(
      <Link
        key={`${match.index}-${match[2]}`}
        to={match[2]}
        viewTransition
        className="text-text underline decoration-[color:var(--line-2)] underline-offset-4 transition-colors hover:text-signal hover:decoration-signal"
      >
        {match[1]}
      </Link>,
    );
    last = match.index + match[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

// Version en texto plano (sin enlaces) para JSON-LD, meta y conteos.
export const stripInline = (text) => text.replace(LINK_RE, '$1');
