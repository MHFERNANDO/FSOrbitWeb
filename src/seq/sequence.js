// El modelo de la home: 180 cuadros renderizados en Blender
// (scripts/blender/orbita.py) que se dibujan en un lienzo con el scroll.
//
// Donde se dibuja: cada seccion reserva un hueco ([data-slot]). En
// escritorio el modelo viaja de un hueco al siguiente mientras bajas; si
// el siguiente esta en la otra columna, o en celular, se apaga en uno y se
// enciende en el otro (con un leve cambio de escala), asi nunca pasa por
// encima del texto.
//
// Que cuadro: lo decide la posicion del scroll. Al inicio y al final el
// logo gira solo (dos loops de 24 cuadros). En los casos el codigo forma
// un monitor y en su pantalla se dibuja la captura del caso.
//
// Con "reducir movimiento" el modelo sigue cambiando solo cuando la
// persona hace scroll: sin giros automaticos ni viajes, solo fundidos.
import { initScroll } from '@/lib/scroll';
import { motionAllowed } from '@/lib/capability';
import { homeCases } from '@/data/content';
import screen from './screen.json';

const FRAMES = screen.frames;
const HOLD = screen.hold ?? 131;
const LOOP_A = 0;
const LOOP_B = 156;
const LOOP_LEN = 24;
const LOOP_FPS = 12;

const smooth = (x) => {
  const t = Math.min(1, Math.max(0, x));
  return t * t * (3 - 2 * t);
};
const lerp = (a, b, t) => a + (b - a) * t;

export async function startSequence(root) {
  const { gsap } = await initScroll();
  const mobile = window.matchMedia('(max-width: 899px)').matches;
  const calm = !motionAllowed();
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
  // Orden de carga: el loop del inicio, uno de cada seis (para tener algo
  // en cualquier punto) y despues el resto.
  const images = new Array(FRAMES).fill(null);
  const order = [];
  const seen = new Set();
  const push = (i) => {
    if (i >= 0 && i < FRAMES && !seen.has(i)) {
      seen.add(i);
      order.push(i);
    }
  };
  for (let i = 0; i < LOOP_LEN; i++) push(LOOP_A + i);
  for (let i = 0; i < FRAMES; i += 6) push(i);
  push(HOLD);
  for (let i = 0; i < FRAMES; i++) push(i);

  let alive = true;
  let dirty = true;
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

  // Capturas de los casos para la pantalla del monitor.
  const shots = homeCases.map((c) => {
    const img = new Image();
    img.decoding = 'async';
    img.src = `/assets/${c.img}-${mobile ? 480 : 960}.webp`;
    img.onload = () => (dirty = true);
    return img;
  });

  // ---------------------------------------------------------- medidas
  const q = (sel) => root.querySelector(sel);
  // Los huecos de servicios, preguntas y cierre estan fuera del recorrido.
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
    marks = mobile
      ? {
          // Sin escenas fijas: cada cambio ocurre mientras su seccion entra.
          t1: [top(s2) - vh * 0.75, top(s2) + vh * 0.05],
          t2: [top(s3) - vh * 0.75, top(s3) + vh * 0.05],
          t3: [top(s4) - vh * 0.6, top(cases) - vh * 0.2],
          t4: [top(s5) - vh * 0.8, top(s5) - vh * 0.1],
        }
      : {
          t1: span(s2, 0.55),
          t2: span(s3, 0.55),
          t3: [top(s4) - vh * 0.6, top(cases) - vh * 0.05],
          t4: [top(s5) - vh * 0.75, top(s5) - vh * 0.15],
        };
  }
  measure();

  // Cuadro segun el scroll (y el reloj, en los dos loops).
  function frameAt(y, time) {
    const m = marks;
    const seg = ([a, b], f0, f1) => Math.round(lerp(f0, f1, Math.min(1, Math.max(0, (y - a) / (b - a)))));
    const loop = (base) => (calm ? base : base + (Math.floor(time * LOOP_FPS) % LOOP_LEN));
    if (y < m.t1[0]) return loop(LOOP_A);
    if (y <= m.t1[1]) return seg(m.t1, 24, 59);
    if (y < m.t2[0]) return 59;
    if (y <= m.t2[1]) return seg(m.t2, 60, 95);
    if (y < m.t3[0]) return 95;
    if (y <= m.t3[1]) return seg(m.t3, 96, HOLD);
    if (y < m.t4[0]) return HOLD;
    if (y <= m.t4[1]) return seg(m.t4, HOLD + 1, 155);
    return loop(LOOP_B);
  }

  // Huecos con tamano, en orden de la pagina. Cada uno puede recortar
  // arriba y abajo el cuadro (data-crop) para usar mejor un hueco ancho.
  function slotRects() {
    const out = [];
    for (const el of slots) {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      const crop = parseFloat(el.dataset.crop || '0');
      const aspect = 1 / (1 - 2 * crop);
      const w = Math.min(r.width, r.height * aspect);
      const h = w / aspect;
      out.push({ el, crop, x: r.left + (r.width - w) / 2, y: r.top + (r.height - h) / 2, w, h, cy: r.top + r.height / 2 });
    }
    return out;
  }

  // Donde dibujar: lista de rectangulos con su opacidad.
  function placements() {
    const rects = slotRects();
    if (!rects.length) return [];
    const c = H * 0.5;
    const i = rects.findIndex((r) => r.cy > c);
    if (i === -1) return [{ ...rects[rects.length - 1], alpha: 1 }];
    if (i === 0) return [{ ...rects[0], alpha: 1 }];
    const a = rects[i - 1];
    const b = rects[i];
    const t = (c - a.cy) / (b.cy - a.cy);
    if (calm || mobile || Math.abs(b.x - a.x) > W * 0.25) {
      const k = smooth((t - 0.32) / 0.36);
      const grow = (r, s) => ({ ...r, x: r.x + (r.w * (1 - s)) / 2, y: r.y + (r.h * (1 - s)) / 2, w: r.w * s, h: r.h * s });
      return [
        { ...grow(a, 1 - 0.1 * k), alpha: 1 - k },
        { ...grow(b, 0.9 + 0.1 * k), alpha: k },
      ].filter((p) => p.alpha > 0.01);
    }
    const k = smooth((t - 0.2) / 0.6);
    const near = k < 0.5 ? a : b;
    return [
      {
        el: near.el,
        crop: near.crop,
        x: lerp(a.x, b.x, k),
        y: lerp(a.y, b.y, k),
        w: lerp(a.w, b.w, k),
        h: lerp(a.h, b.h, k),
        alpha: 1,
      },
    ];
  }

  // Caso que se esta leyendo (para el monitor fijo de escritorio).
  function caseMix() {
    // El caso cambia cuando su texto entra al ultimo cuarto de la pantalla.
    const c = H * 0.75;
    // Se toma el texto del caso (parte alta del paso), no su centro: la
    // pantalla cambia cuando empiezas a leer el siguiente.
    const marksY = steps.map((el) => {
      const r = el.getBoundingClientRect();
      return r.top + r.height * 0.3;
    });
    const i = marksY.findIndex((y) => y > c);
    if (i === -1) return [[marksY.length - 1, 1]];
    if (i === 0) return [[0, 1]];
    const t = smooth(((c - marksY[i - 1]) / (marksY[i] - marksY[i - 1]) - 0.15) / 0.3);
    return [
      [i - 1, 1 - t],
      [i, t],
    ];
  }

  // ---------------------------------------------------------- dibujo
  let lastKey = '';
  let shown = false;
  const half = (screen.screenTo - screen.screenFrom) / 2;
  let lastY = -1;
  let lastF = -1;
  function draw(time) {
    const y = window.scrollY;
    const f = frameAt(y, time);
    // Sin scroll, sin cambio de cuadro y sin nada nuevo cargado: nada que hacer.
    if (!dirty && y === lastY && f === lastF) return;
    lastY = y;
    lastF = f;
    const places = placements();
    const key = `${f}|${places.map((p) => `${p.x | 0},${p.y | 0},${p.w | 0},${p.alpha.toFixed(2)}`).join(';')}`;
    if (!dirty && key === lastKey) return;
    const img = nearestLoaded(f);
    if (!img) {
      lastF = -1;
      return;
    }
    lastKey = key;
    dirty = false;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const screenOn = smooth(1 - Math.abs(f - HOLD) / half);
    const n = img.naturalWidth;
    for (const p of places) {
      const band = 1 - 2 * p.crop;
      ctx.globalAlpha = p.alpha;
      ctx.drawImage(img, 0, p.crop * n, n, band * n, p.x, p.y, p.w, p.h);

      // Pantalla del monitor: la captura del caso correspondiente.
      const kind = p.el?.dataset.slot;
      if (screenOn <= 0 || (kind !== 'd' && kind !== 'case')) continue;
      const sx = p.x + screen.x * p.w;
      const sy = p.y + ((screen.y - p.crop) / band) * p.h;
      const sw = screen.w * p.w;
      const sh = (screen.h / band) * p.h;
      const mix = kind === 'case' ? [[Number(p.el.dataset.case), 1]] : caseMix();
      for (const [k, w] of mix) {
        const shot = shots[k];
        if (!shot?.complete || !shot.naturalWidth || w <= 0) continue;
        ctx.globalAlpha = p.alpha * screenOn * w;
        ctx.drawImage(shot, sx, sy, sw, sh);
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
    lastY = -1;
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
