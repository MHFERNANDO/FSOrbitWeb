// Un solo ciclo de animacion para todo el sitio: el ticker de GSAP mueve
// a Lenis (scroll suave) y, en la home, tambien dibuja el lienzo WebGL.
// ScrollTrigger orquesta. Todo se carga despues del primer pintado: el
// HTML y el texto no esperan a estas librerias.
import { motionAllowed } from './capability.js';

let ready = null;
let api = null;

export function initScroll() {
  if (ready) return ready;
  ready = (async () => {
    const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
    gsap.registerPlugin(ScrollTrigger);
    let lenis = null;
    if (motionAllowed()) {
      const { default: Lenis } = await import('lenis');
      lenis = new Lenis({ autoRaf: false, anchors: true, lerp: 0.11 });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }
    api = { gsap, ScrollTrigger, lenis };
    return api;
  })();
  return ready;
}

export const scrollApi = () => api;

export function scrollToTop() {
  if (api?.lenis) api.lenis.scrollTo(0, { immediate: true, force: true });
  else window.scrollTo(0, 0);
}

export function lockScroll(locked) {
  if (!api?.lenis) return;
  if (locked) api.lenis.stop();
  else api.lenis.start();
}
