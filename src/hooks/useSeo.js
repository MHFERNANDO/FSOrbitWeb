import { useEffect } from 'react';

const ORIGIN = 'https://fsorbit.com';

// Escribe el <head> por ruta. Sin esto la SPA sirve el mismo index.html
// para / y /proyectos, asi que ambas compartian <title>, description y —
// lo mas grave para SEO — el mismo <link rel="canonical"> apuntando a la
// raiz, que le dice a Google que /proyectos es un duplicado de / y no
// merece entrada propia en el indice.
//
// Google renderiza JS antes de indexar, asi que actualizar estas
// etiquetas desde el cliente si cuenta; lo que no se puede es depender de
// ellas para crawlers que no ejecutan JS (WhatsApp, Slack). Para esos, lo
// que vale es lo que ya viene servido en index.html — por eso ahi se deja
// la version de la home, que es la que se comparte.
function setMeta(selector, attr, value) {
  const el = document.head.querySelector(selector);
  if (el) el.setAttribute(attr, value);
}

export function useSeo({ title, description, path }) {
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
  }, [title, description, path]);
}
