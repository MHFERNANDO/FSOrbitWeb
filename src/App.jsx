import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import IconSprite from './components/IconSprite';
import SiteBg from './components/SiteBg';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatDock from './components/ChatDock';
import { AdvisorProvider } from './components/AdvisorModal';
import { ProjectPreviewProvider } from './components/ProjectPreviewModal';
// Home va eager: es la ruta de entrada mas pisada y no tiene sentido
// esperar un import() async para la primera pintura. El resto de
// paginas se parte por ruta (React.lazy) — antes todo el sitio
// (10 rutas + sus datos) viajaba en un solo bundle de 480KB sin
// importar cual de las 10 pedia el visitante.
import Home from './pages/Home';
const Proyectos = lazy(() => import('./pages/Proyectos'));
const ProyectoDetalle = lazy(() => import('./pages/ProyectoDetalle'));
const DisenoWebCuenca = lazy(() => import('./pages/DisenoWebCuenca'));
const TiendasOnline = lazy(() => import('./pages/TiendasOnline'));
const RedisenoOptimizacion = lazy(() => import('./pages/RedisenoOptimizacion'));
const Precios = lazy(() => import('./pages/Precios'));
const Contacto = lazy(() => import('./pages/Contacto'));
const NotFound = lazy(() => import('./pages/NotFound'));

export default function App() {
  const location = useLocation();

  return (
    <>
      <a
        href="#main"
        className="fixed left-s5 top-[-200%] z-50 rounded-r2 bg-signal px-s5 py-s3 font-mono text-[length:var(--fs-small)] font-bold uppercase tracking-[var(--tr-mono)] text-signal-ink transition-transform duration-(--d2) focus-visible:top-s5"
      >
        Ir al contenido
      </a>

      <IconSprite />
      <SiteBg />

      <AdvisorProvider>
        <ProjectPreviewProvider>
          <Navbar />
          <Suspense fallback={<div className="min-h-[60svh]" aria-hidden="true" />}>
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/proyectos" element={<Proyectos />} />
              <Route path="/proyectos/:slug" element={<ProyectoDetalle />} />
              <Route path="/servicios/diseno-web-cuenca" element={<DisenoWebCuenca />} />
              <Route path="/servicios/tiendas-online" element={<TiendasOnline />} />
              <Route path="/servicios/rediseno-y-optimizacion" element={<RedisenoOptimizacion />} />
              <Route path="/precios" element={<Precios />} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <Footer />
          <ChatDock />
        </ProjectPreviewProvider>
      </AdvisorProvider>
    </>
  );
}
