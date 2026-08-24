import { useEffect } from 'react';

// La SPA solo tiene un <title> en index.html; sin esto, navegar entre
// rutas via <Link> nunca actualiza la pestaña del navegador.
export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
