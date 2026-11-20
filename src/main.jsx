import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { applyMotionOverride, detectTier } from './lib/capability.js';
import './index.css';
import App, { preloadRoute } from './App.jsx';

applyMotionOverride();

// La home tiene dos presentaciones con el mismo HTML: con escena 3D
// (html.gl) o estatica. Se decide antes de hidratar para que el layout no
// cambie despues. Solo se prueba la GPU si se entra por la home; al llegar
// por navegacion interna lo hace Home.jsx al montar.
if (window.location.pathname === '/' && detectTier() === 'seq') {
  document.documentElement.classList.add('seq');
}

const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
      <Analytics />
    </BrowserRouter>
  </StrictMode>
);

// Las rutas prerenderizadas (scripts/prerender.mjs) traen el DOM completo:
// se hidrata en vez de volver a montar. El shell sin prerender (dev, o el
// propio prerender visitando cada ruta) llega con #root vacio y monta.
const rootEl = document.getElementById('root');
if (rootEl.hasChildNodes()) {
  preloadRoute(window.location.pathname)
    .catch(() => {})
    .then(() => hydrateRoot(rootEl, app));
} else {
  createRoot(rootEl).render(app);
}
