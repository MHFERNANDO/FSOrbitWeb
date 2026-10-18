import { useEffect } from 'react';

const ORIGIN = 'https://fsorbit.com';
const JSONLD_ID = 'page-jsonld';

// Escribe el <head> por ruta: title, canonical, description, OG/Twitter
// y (opcional) JSON-LD propio de la pagina. Antes esto solo importaba
// para Google (que ejecuta JS antes de indexar) porque cualquier otro
// crawler recibia siempre el index.html generico de Vite. Desde que el
// build prerenderiza cada ruta con Puppeteer (scripts/prerender.mjs,
// que captura el DOM *despues* de que este hook corre), lo que se
// escribe aca queda horneado en el HTML estatico que reciben todos los
// crawlers, con o sin JS. Sigue siendo necesario para la navegacion
// interna via React Router (el prerender solo cubre la carga inicial
// de cada URL).
function setMeta(selector, attr, value) {
  const el = document.head.querySelector(selector);
  if (el) el.setAttribute(attr, value);
}

function setJsonLd(jsonLd) {
  const existing = document.getElementById(JSONLD_ID);
  if (existing) existing.remove();
  if (!jsonLd) return;

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = JSONLD_ID;
  script.textContent = JSON.stringify(Array.isArray(jsonLd) ? jsonLd : [jsonLd]);
  document.head.appendChild(script);
}

export function useSeo({ title, description, path, jsonLd, noindex = false }) {
  useEffect(() => {
    document.title = title;

    const url = `${ORIGIN}${path}`;
    setMeta('link[rel="canonical"]', 'href', url);
    setMeta('meta[name="description"]', 'content', description);
    setMeta('meta[property="og:url"]', 'content', url);
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="twitter:url"]', 'content', url);
    setMeta('meta[property="twitter:title"]', 'content', title);
    setMeta('meta[property="twitter:description"]', 'content', description);
    if (noindex) {
      setMeta('meta[name="robots"]', 'content', 'noindex, follow');
    }
    setJsonLd(jsonLd);

    return () => {
      setJsonLd(null);
      if (noindex) {
        setMeta('meta[name="robots"]', 'content', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, path, JSON.stringify(jsonLd), noindex]);
}
