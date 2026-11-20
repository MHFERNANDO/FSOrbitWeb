// El modelo de la home: 180 cuadros renderizados en Blender
// (scripts/blender/orbita.py) que se dibujan en un lienzo con el scroll.
//
// Donde se dibuja: cada escena reserva un hueco ([data-slot]). En
// escritorio el modelo viaja de un hueco al siguiente mientras bajas; en
// celular aparece en el hueco de cada escena (se funde entre uno y otro),
// asi nunca pasa por encima del texto.
//
// Que cuadro: lo decide la posicion del scroll. Al inicio y al final el
// atomo gira solo (dos loops de 24 cuadros). En los casos, el codigo forma
// un monitor y en su pantalla se dibuja la captura del caso que estas
// leyendo.
import { initScroll } from '@/lib/scroll';
import { homeCases } from '@/data/content';
import screen from './screen.json';

const FRAMES = screen.frames;
const LOOP_A = [0, 23];
const LOOP_B = [156, 179];
const LOOP_FPS = 12;

const smooth = (x) => {
  const t = Math.min(1, Math.max(0, x));
  return t * t * (3 - 2 * t);
};
const lerp = (a, b, t) => a + (b - a) * t;

export async function startSequence(root) {
  const { gsap } = await initScroll();
  const mobile = window.matchMedia('(max-width: 899px)').matches;
  // 720 px en escritorio, 480 en celular (los huecos miden menos).
  const dir = `/seq/${mobile ? 480 : 720}`;

  // ---------------------------------------------------------- lienzo
  const canvas = document.createElement('canvas');
  canvas.className = 'seq-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  let W = 0;
  let H = 0;
  let dpr = 1;
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
  }
  resize();

  // ---------------------------------------------------------- cuadros
  // Orden de carga: el loop del inicio, luego uno de cada seis (para tener
  // algo que mostrar en cualquier punto) y despues el resto.
  const images = new Array(FRAMES).fill(null);
  const order = [];
  const seen = new Set();
  const push = (i) => {
    if (i >= 0 && i < FRAMES && !seen.has(i)) {
      seen.add(i);
      order.push(i);
    }
  };
  for (let i = LOOP_A[0]; i <= LOOP_A[1]; i++) push(i);
  for (let i = 0; i < FRAMES; i += 6) push(i);
  for (let i = 0; i < FRAMES; i++) push(i);

  let alive = true;
  let cursor = 0;
  function loadNext() {
    if (!alive || cursor >= order.length) return;
    const i = order[cursor++];
    const img = new Image();
    img.decoding = 'async';
    img.src = `${dir}/f_${String(i).padStart(3, '0')}.webp`;
    img
      .decode()
      .then(() => {
        images[i] = img;
        dirty = true;
      })
      .catch(() => {})
      .finally(loadNext);
  }
  for (let k = 0; k < 4; k++) loadNext();

  function nearestLoaded(i) {
    if (images[i]) return images[i];
    for (let d = 1; d < FRAMES; d++) {
      if (images[i - d]) return images[i - d];
      if (images[i + d]) return images[i + d];
    }
    return null;
  }

  // Capturas de los casos para la pantalla del monitor (solo escritorio).
  const shots = homeCases.map((c) => {
    const img = new Image();
    img.decoding = 'async';
    img.src = `/assets/${c.img}-960.webp`;
    return img;
  });

  // ---------------------------------------------------------- medidas
  const q = (sel) => root.querySelector(sel);
  // Los huecos de servicios y del cierre estan fuera del recorrido.
  const page = root.closest('main') || document;
  const slots = [...page.querySelectorAll('[data-slot]')];
  const steps = [...root.querySelectorAll('.case-step')];
  let marks = null;
  function measure() {
    const vh = window.innerHeight;
    const top = (el) => el.getBoundingClientRect().top + window.scrollY;
    const span = (el, lead) => {
      const start = top(el) - vh * lead;
      const end = Math.max(start + vh * 0.5, top(el) + el.offsetHeight - vh);
      return [start, end];
    };
    const s2 = q('.scene-2');
    const s3 = q('.scene-3');
    const s4 = q('.scene-4');
    const cases = q('.cases');
    const s5 = q('.scene-5');
    marks = {
      t1: span(s2, 0.55),
      t2: span(s3, 0.55),
      t3: [top(s4) - vh * 0.6, top(cases) - vh * 0.05],
      t4: [top(s5) - vh * 0.75, top(s5) - vh * 0.15],
    };
    if (mobile) {
      // Sin escenas fijas: la transformacion ocurre mientras la escena entra.
      marks.t1 = [top(s2) - vh * 0.7, top(s2) + vh * 0.1];
      marks.t2 = [top(s3) - vh * 0.7, top(s3) + vh * 0.1];
    }
  }
  measure();

  // Cuadro segun el scroll (y el reloj, en los dos loops).
  function frameAt(y, time) {
    const m = marks;
    const seg = ([a, b], f0, f1) => Math.round(lerp(f0, f1, Math.min(1, Math.max(0, (y - a) / (b - a)))));
    if (y < m.t1[0]) return LOOP_A[0] + (Math.floor(time * LOOP_FPS) % 24);
    if (y <= m.t1[1]) return seg(m.t1, 24, 59);
    if (y < m.t2[0]) return 59;
    if (y <= m.t2[1]) return seg(m.t2, 60, 95);
    if (y < m.t3[0]) return 95;
    if (y <= m.t3[1]) return seg(m.t3, 96, 131);
    if (y < m.t4[0]) return 131;
    if (y <= m.t4[1]) return seg(m.t4, 132, 155);
    return LOOP_B[0] + (Math.floor(time * LOOP_FPS) % 24);
  }

  // Huecos visibles en este momento, en orden de la pagina.
  function slotRects() {
    return slots
      .map((el) => ({ el, r: el.getBoundingClientRect() }))
      .filter(({ r }) => r.width > 0 && r.height > 0)
      .map(({ el, r }) => {
        const s = Math.min(r.width, r.height);
        return { el, x: r.left + (r.width - s) / 2, y: r.top + (r.height - s) / 2, s, cy: r.top + r.height / 2 };
      });
  }

  // Donde dibujar: lista de { x, y, s, alpha }.
  function placements() {
    const rects = slotRects();
    if (!rects.length) return [];
    const c = H * 0.5;
    let i = rects.findIndex((r) => r.cy > c);
    if (i === -1) return [{ ...rects[rects.length - 1], alpha: 1 }];
    if (i === 0) return [{ ...rects[0], alpha: 1 }];
    const a = rects[i - 1];
    const b = rects[i];
    const t = (c - a.cy) / (b.cy - a.cy);
    // En celular, o cuando el siguiente hueco esta en la otra columna, el
    // modelo no cruza por encima del texto: se apaga en un hueco y se
    // enciende en el otro.
    if (mobile || Math.abs(b.x - a.x) > W * 0.25) {
      const k = smooth((t - 0.35) / 0.3);
      return [
        { ...a, alpha: 1 - k },
        { ...b, alpha: k },
      ].filter((p) => p.alpha > 0.01);
    }
    const k = smooth((t - 0.2) / 0.6);
    return [{ x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), s: lerp(a.s, b.s, k), alpha: 1, el: k < 0.5 ? a.el : b.el }];
  }

  // Caso que se esta leyendo (para la pantalla del monitor).
  function caseMix() {
    const c = H * 0.5;
    // Se toma el texto del caso (mitad superior del paso), no su centro: la
    // pantalla cambia cuando empiezas a leer el siguiente.
    const centers = steps.map((el) => {
      const r = el.getBoundingClientRect();
      return r.top + r.height * 0.3;
    });
    let i = centers.findIndex((y) => y > c);
    if (i === -1) return [[centers.length - 1, 1]];
    if (i === 0) return [[0, 1]];
    const t = smooth(((c - centers[i - 1]) / (centers[i] - centers[i - 1]) - 0.15) / 0.3);
    return [
      [i - 1, 1 - t],
      [i, t],
    ];
  }

  // ---------------------------------------------------------- dibujo
  let dirty = true;
  let lastKey = '';
  let shown = false;
  function draw(time) {
    const y = window.scrollY;
    const f = frameAt(y, time);
    const places = placements();
    const key = `${f}|${places.map((p) => `${p.x | 0},${p.y | 0},${p.s | 0},${p.alpha.toFixed(2)}`).join(';')}`;
    if (!dirty && key === lastKey) return;
    const img = nearestLoaded(f);
    if (!img) return;
    lastKey = key;
    dirty = false;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const screenOn = !mobile && f >= screen.screenFrom && f <= screen.screenTo ? smooth(1 - Math.abs(f - 131) / 11) : 0;
    for (const p of places) {
      ctx.globalAlpha = p.alpha;
      ctx.drawImage(img, p.x, p.y, p.s, p.s);
      if (screenOn > 0 && p.el?.dataset.slot === 'd') {
        const sx = p.x + screen.x * p.s;
        const sy = p.y + screen.y * p.s;
        const sw = screen.w * p.s;
        const sh = screen.h * p.s;
        for (const [k, w] of caseMix()) {
          const shot = shots[k];
          if (!shot?.complete || !shot.naturalWidth || w <= 0) continue;
          ctx.globalAlpha = p.alpha * screenOn * w;
          ctx.drawImage(shot, sx, sy, sw, sh);
        }
      }
    }
    ctx.globalAlpha = 1;
    if (!shown) {
      shown = true;
      document.documentElement.classList.add('seq-on');
    }
  }

  const tick = (time) => draw(time);
  gsap.ticker.add(tick);

  let lastW = window.innerWidth;
  const onResize = () => {
    resize();
    dirty = true;
    if (!mobile || window.innerWidth !== lastW) measure();
    lastW = window.innerWidth;
  };
  window.addEventListener('resize', onResize);
  // Las medidas cambian cuando cargan fuentes e imagenes.
  const remeasure = setInterval(measure, 1500);
  const onVisibility = () => (document.hidden ? gsap.ticker.remove(tick) : gsap.ticker.add(tick));
  document.addEventListener('visibilitychange', onVisibility);

  return function dispose() {
    alive = false;
    gsap.ticker.remove(tick);
    clearInterval(remeasure);
    window.removeEventListener('resize', onResize);
    document.removeEventListener('visibilitychange', onVisibility);
    canvas.remove();
    document.documentElement.classList.remove('seq-on');
  };
}
