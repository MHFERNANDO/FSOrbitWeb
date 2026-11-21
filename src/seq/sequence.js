// El modelo de la home: cuadros renderizados en Blender
// (scripts/blender/orbita.py) que se dibujan en un lienzo con el scroll.
//
// Donde se dibuja: cada seccion reserva un hueco ([data-slot]). En
// escritorio el modelo viaja de un hueco al siguiente mientras bajas; si
// el siguiente esta en la otra columna, o en celular, se apaga en uno y se
// enciende en el otro (con un leve cambio de escala), asi nunca pasa por
// encima del texto.
//
// Que cuadro: al cargar, el logo se arma desde el codigo disperso (intro)
// y luego gira sin parar, con el codigo corriendo por las orbitas. Al bajar,
// el scroll decide la transformacion (plantilla, layout, monitor) y entre
// dos cuadros se dibuja una mezcla, para que el cambio sea continuo. En los
// casos el codigo forma un monitor con la captura del caso en su pantalla.
// La linea de tiempo viene de screen.json (la escribe el script de Blender).
import { initScroll } from '@/lib/scroll';
import { homeCases } from '@/data/content';
import screen from './screen.json';

const FRAMES = screen.frames;
const HOLD = screen.hold;
const [INTRO_0, INTRO_1] = screen.intro;
const [LOOP_0, LOOP_1] = screen.loop;
const LOOP_LEN = LOOP_1 - LOOP_0 + 1;
const SEG = screen.segments;
const INTRO_FPS = 24;
const LOOP_FPS = 20;

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
  for (let i = INTRO_0; i <= LOOP_1; i++) push(i);
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

  // Reloj del intro y del loop. El intro arranca cuando sus cuadros ya
  // cargaron (o a los 2.5 s, con lo que haya); si la persona ya bajo, se omite.
  let introStart = null;
  let introDone = false;
  let loopStart = 0;
  const introReady = () => images.slice(INTRO_0, LOOP_0 + 2).every(Boolean);
  function idle(time) {
    if (!introDone) {
      if (introStart === null && (introReady() || time > 2.5)) introStart = time;
      if (introStart === null) return INTRO_0;
      const f = INTRO_0 + (time - introStart) * INTRO_FPS;
      if (f < INTRO_1) return f;
      introDone = true;
      loopStart = time;
    }
    return LOOP_0 + (((time - loopStart) * LOOP_FPS) % LOOP_LEN);
  }

  // Cuadro (con fraccion) segun el scroll y el reloj.
  function frameAt(y, time) {
    const m = marks;
    const seg = ([a, b], [f0, f1]) => lerp(f0, f1, Math.min(1, Math.max(0, (y - a) / (b - a))));
    if (y < m.t1[0]) return idle(time);
    introDone = true;
    if (y <= m.t1[1]) return seg(m.t1, SEG[0]);
    if (y < m.t2[0]) return SEG[0][1];
    if (y <= m.t2[1]) return seg(m.t2, SEG[1]);
    if (y < m.t3[0]) return SEG[1][1];
    if (y <= m.t3[1]) return seg(m.t3, SEG[2]);
    if (y < m.t4[0]) return HOLD;
    if (y <= m.t4[1]) return seg(m.t4, SEG[3]);
    return LOOP_0 + (((time - loopStart) * LOOP_FPS) % LOOP_LEN);
  }
  // El cuadro siguiente; el ultimo del loop sigue con el primero.
  const nextOf = (i) => (i === LOOP_1 ? LOOP_0 : Math.min(FRAMES - 1, i + 1));

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
    if (mobile || Math.abs(b.x - a.x) > W * 0.25) {
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
    // El caso cambia cuando su texto pasa la mitad de la pantalla.
    const c = H * 0.58;
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
  // Parallax con el mouse (solo escritorio): el modelo sigue apenas al
  // puntero, con inercia.
  const pointer = { x: 0, y: 0, cx: 0, cy: 0 };
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const onMove = (e) => {
    pointer.x = (e.clientX / W - 0.5) * 2;
    pointer.y = (e.clientY / H - 0.5) * 2;
  };
  if (fine) window.addEventListener('pointermove', onMove, { passive: true });

  let shown = false;
  const half = (screen.screenTo - screen.screenFrom) / 2;
  function draw(time) {
    const ff = frameAt(window.scrollY, time);
    const f = Math.floor(ff);
    const frac = ff - f;
    const img = nearestLoaded(f);
    if (!img) return;
    const next = frac > 0.02 ? images[nextOf(f)] : null;
    const places = placements();

    pointer.cx += (pointer.x - pointer.cx) * 0.06;
    pointer.cy += (pointer.y - pointer.cy) * 0.06;
    // Mientras el logo gira, flota apenas.
    const bob = f <= LOOP_1 || f > SEG[3][1] - 1 ? Math.sin(time * 1.4) * 4 : 0;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const screenOn = smooth(1 - Math.abs(ff - HOLD) / half);
    const n = img.naturalWidth;
    for (const p of places) {
      const band = 1 - 2 * p.crop;
      const shift = Math.min(14, p.w * 0.03);
      const x = p.x + pointer.cx * shift;
      const y = p.y + pointer.cy * shift * 0.7 + bob;
      ctx.globalAlpha = p.alpha;
      ctx.drawImage(img, 0, p.crop * n, n, band * n, x, y, p.w, p.h);
      if (next) {
        ctx.globalAlpha = p.alpha * frac;
        ctx.drawImage(next, 0, p.crop * n, n, band * n, x, y, p.w, p.h);
      }

      // Pantalla del monitor: la captura del caso correspondiente.
      const kind = p.el?.dataset.slot;
      if (screenOn <= 0 || (kind !== 'd' && kind !== 'case')) continue;
      const sx = x + screen.x * p.w;
      const sy = y + ((screen.y - p.crop) / band) * p.h;
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
    window.removeEventListener('pointermove', onMove);
    document.removeEventListener('visibilitychange', onVisibility);
    canvas.remove();
    document.documentElement.classList.remove('seq-on');
  };
}
