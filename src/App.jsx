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
          </Routes>
          <Footer />
          <ChatDock />
        </ProjectPreviewProvider>
      </AdvisorProvider>
    </>
  );
}
