import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import IconSprite from './components/IconSprite';
import SiteBg from './components/SiteBg';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatDock from './components/ChatDock';
import Preloader from './components/Preloader';
import { AdvisorProvider } from './components/AdvisorModal';
import { ProjectPreviewProvider } from './components/ProjectPreviewModal';
import Home from './pages/Home';
import Proyectos from './pages/Proyectos';
import ProyectoDetalle from './pages/ProyectoDetalle';
import DisenoWebCuenca from './pages/DisenoWebCuenca';
import TiendasOnline from './pages/TiendasOnline';
import RedisenoOptimizacion from './pages/RedisenoOptimizacion';
import Precios from './pages/Precios';
import Contacto from './pages/Contacto';
import NotFound from './pages/NotFound';

export default function App() {
  const [booted, setBooted] = useState(false);
  const location = useLocation();

  return (
    <>
      {!booted && <Preloader onDone={() => setBooted(true)} />}

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
          <Footer />
          <ChatDock />
        </ProjectPreviewProvider>
      </AdvisorProvider>
    </>
  );
}
