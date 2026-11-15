import { lazy, Suspense } from 'react';
import { useEffect } from 'react';
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
// (19 rutas + sus datos) viajaba en un solo bundle de 480KB sin
// importar cual de las 10 pedia el visitante.
import Home from './pages/Home';
// Carga perezosa por ruta con precarga: el prerender deja el HTML de cada
// pagina ya pintado y main.jsx lo hidrata. Si el chunk de la ruta aun no
// llego cuando React hidrata, el <Suspense> pinta su fallback y no coincide
// con el HTML del servidor (error #418 y repintado completo, que ademas
// movia el footer: CLS 0.31 en movil). Por eso main.jsx espera
// preloadRoute() antes de hidratar y la ruta se renderiza sincrona.
function lazyRoute(loader) {
  let loaded = null;
  const Lazy = lazy(loader);
  function RouteComponent(props) {
    const Loaded = loaded;
    return Loaded ? <Loaded {...props} /> : <Lazy {...props} />;
  }
  RouteComponent.preload = () =>
    loader().then((mod) => {
      loaded = mod.default;
    });
  return RouteComponent;
}

const Proyectos = lazyRoute(() => import('./pages/Proyectos'));
const ProyectoDetalle = lazyRoute(() => import('./pages/ProyectoDetalle'));
const Servicio = lazyRoute(() => import('./pages/Servicio'));
const SobreNosotros = lazyRoute(() => import('./pages/SobreNosotros'));
const Privacidad = lazyRoute(() => import('./pages/Privacidad'));
const Blog = lazyRoute(() => import('./pages/Blog'));
const BlogPost = lazyRoute(() => import('./pages/BlogPost'));
const Precios = lazyRoute(() => import('./pages/Precios'));
const Contacto = lazyRoute(() => import('./pages/Contacto'));
const NotFound = lazyRoute(() => import('./pages/NotFound'));

// Que chunk necesita cada URL (misma tabla que las <Route> de abajo).
export function preloadRoute(pathname) {
  const p = pathname.replace(/\/+$/, '') || '/';
  let route = NotFound;
  if (p === '/') return Promise.resolve();
  if (p === '/proyectos') route = Proyectos;
  else if (/^\/proyectos\/[^/]+$/.test(p)) route = ProyectoDetalle;
  else if (/^\/servicios\/[^/]+$/.test(p)) route = Servicio;
  else if (p === '/sobre-nosotros') route = SobreNosotros;
  else if (p === '/politica-de-privacidad') route = Privacidad;
  else if (p === '/blog') route = Blog;
  else if (/^\/blog\/[^/]+$/.test(p)) route = BlogPost;
  else if (p === '/precios') route = Precios;
  else if (p === '/contacto') route = Contacto;
  return route.preload();
}

// Al navegar entre rutas: sin hash va al inicio de la pagina; con hash
// (/#servicios) baja a esa seccion en cuanto exista en el DOM.
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    const root = document.documentElement;
    const prev = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    let tries = 0;
    let timer;
    const go = () => {
      if (!hash) {
        window.scrollTo(0, 0);
        return;
      }
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (el) el.scrollIntoView({ block: 'start' });
      else if (tries++ < 20) timer = setTimeout(go, 100);
    };
    go();
    const restore = setTimeout(() => {
      root.style.scrollBehavior = prev;
    }, 50);
    return () => {
      clearTimeout(timer);
      clearTimeout(restore);
      root.style.scrollBehavior = prev;
    };
  }, [pathname, hash]);
  return null;
}

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

      <ScrollManager />
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
              <Route path="/servicios/:slug" element={<Servicio />} />
              <Route path="/sobre-nosotros" element={<SobreNosotros />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/politica-de-privacidad" element={<Privacidad />} />
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
