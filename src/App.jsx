import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Dock from './components/Dock';
import ErrorBoundary from './components/ErrorBoundary';
import { initScroll, scrollApi, scrollToTop } from './lib/scroll';
// La home va en el bundle de entrada: es la ruta mas visitada y no debe
// esperar un import() para pintar. El resto se parte por ruta.
import Home from './pages/Home';

// Carga perezosa por ruta con precarga. El prerender deja el HTML de cada
// pagina ya pintado y main.jsx lo hidrata; si el chunk de la ruta aun no
// llego, el <Suspense> pintaria su fallback y no coincidiria con el HTML.
// Por eso main.jsx espera preloadRoute() antes de hidratar.
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

const Servicios = lazyRoute(() => import('./pages/Servicios'));
const Servicio = lazyRoute(() => import('./pages/Servicio'));
const Proyectos = lazyRoute(() => import('./pages/Proyectos'));
const ProyectoDetalle = lazyRoute(() => import('./pages/ProyectoDetalle'));
const Precios = lazyRoute(() => import('./pages/Precios'));
const Proceso = lazyRoute(() => import('./pages/Proceso'));
const Contacto = lazyRoute(() => import('./pages/Contacto'));
const SobreNosotros = lazyRoute(() => import('./pages/SobreNosotros'));
const Blog = lazyRoute(() => import('./pages/Blog'));
const BlogPost = lazyRoute(() => import('./pages/BlogPost'));
const Privacidad = lazyRoute(() => import('./pages/Privacidad'));
const NotFound = lazyRoute(() => import('./pages/NotFound'));

// Que chunk necesita cada URL (misma tabla que las <Route> de abajo).
export function preloadRoute(pathname) {
  const p = pathname.replace(/\/+$/, '') || '/';
  let route = NotFound;
  if (p === '/') return Promise.resolve();
  if (p === '/servicios') route = Servicios;
  else if (/^\/servicios\/[^/]+$/.test(p)) route = Servicio;
  else if (p === '/proyectos') route = Proyectos;
  else if (/^\/proyectos\/[^/]+$/.test(p)) route = ProyectoDetalle;
  else if (p === '/precios') route = Precios;
  else if (p === '/proceso') route = Proceso;
  else if (p === '/contacto') route = Contacto;
  else if (p === '/sobre-nosotros') route = SobreNosotros;
  else if (p === '/blog') route = Blog;
  else if (/^\/blog\/[^/]+$/.test(p)) route = BlogPost;
  else if (p === '/politica-de-privacidad') route = Privacidad;
  return route.preload();
}

// Al navegar: sin hash va al inicio; con hash baja a esa seccion en cuanto
// exista. Tambien recalcula los disparadores de scroll de la pagina nueva.
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    let tries = 0;
    let timer;
    const go = () => {
      if (!hash) return scrollToTop();
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (el) el.scrollIntoView({ block: 'start' });
      else if (tries++ < 20) timer = setTimeout(go, 100);
      return undefined;
    };
    go();
    const refresh = setTimeout(() => scrollApi()?.ScrollTrigger.refresh(), 200);
    return () => {
      clearTimeout(timer);
      clearTimeout(refresh);
    };
  }, [pathname, hash]);
  return null;
}

export default function App() {
  const location = useLocation();

  // Scroll suave: se carga despues del primer pintado.
  useEffect(() => {
    const start = () => initScroll();
    if ('requestIdleCallback' in window) requestIdleCallback(start, { timeout: 1200 });
    else setTimeout(start, 300);
  }, []);

  return (
    <>
      <a href="#main" className="skip">
        Ir al contenido
      </a>
      <ScrollManager />
      <Header />
      <ErrorBoundary pathname={location.pathname}>
        <Suspense fallback={<div style={{ minHeight: '70svh' }} aria-hidden="true" />}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/servicios" element={<Servicios />} />
            <Route path="/servicios/:slug" element={<Servicio />} />
            <Route path="/proyectos" element={<Proyectos />} />
            <Route path="/proyectos/:slug" element={<ProyectoDetalle />} />
            <Route path="/precios" element={<Precios />} />
            <Route path="/proceso" element={<Proceso />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/sobre-nosotros" element={<SobreNosotros />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/politica-de-privacidad" element={<Privacidad />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
      <Footer />
      <Dock />
    </>
  );
}
