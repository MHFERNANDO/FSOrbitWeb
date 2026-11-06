import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
import { RESPECT_REDUCED_MOTION, applyMotionPreference } from './lib/motion.js';
import './index.css';
import App, { preloadRoute } from './App.jsx';
import Preloader from './components/Preloader.jsx';

applyMotionPreference();

const app = (
  <StrictMode>
    <MotionConfig reducedMotion={RESPECT_REDUCED_MOTION ? 'user' : 'never'}>
      <BrowserRouter>
        <App />
        <Analytics />
      </BrowserRouter>
    </MotionConfig>
  </StrictMode>
);

// El Preloader vive en su propia raiz, fuera de #root: no existe en el
// HTML prerenderizado (el prerender lo captura ya desmontado), asi que si
// fuera parte del arbol de App rompería la hidratacion. Visualmente es lo
// mismo de antes: aparece en cuanto carga el JS y se desmonta al terminar
// su ciclo (duracion sin cambios, ver Preloader.jsx).
const preloaderEl = document.createElement('div');
document.body.appendChild(preloaderEl);
const preloaderRoot = createRoot(preloaderEl);
preloaderRoot.render(
  <Preloader
    onDone={() => {
      preloaderRoot.unmount();
      preloaderEl.remove();
    }}
  />,
);

// Las rutas prerenderizadas (scripts/prerender.mjs) traen el DOM completo:
// se hidrata en vez de volver a montar todo el arbol. El shell sin
// prerender (dev, o el propio prerender visitando cada ruta) llega con
// #root vacio y monta normal.
const rootEl = document.getElementById('root');
if (rootEl.hasChildNodes()) {
  // Se espera al chunk de la ruta antes de hidratar (ver preloadRoute en
  // App.jsx); si la precarga fallara, se hidrata igual.
  preloadRoute(window.location.pathname)
    .catch(() => {})
    .then(() => hydrateRoot(rootEl, app));
} else {
  createRoot(rootEl).render(app);
}
