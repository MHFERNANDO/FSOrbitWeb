// El modelo de la home, en 3D y en tiempo real (three.js).
//
// Es el logo de FS Orbit hecho de piezas solidas: orbitas de luz, el
// circulo con "FS" y 36 bloques (cajas redondeadas con borde de luz cian)
// que se reordenan en cada forma. Nunca esta quieto: cada forma tiene su
// propio movimiento y el scroll solo decide hacia que forma va.
//
//   0  logo       las orbitas giran, 8 bloques corren por ellas, "FS" late
//   1  plantilla  9 tarjetas grises iguales; una onda de luz las recorre
//   2  a medida   un layout de piezas desiguales que flotan
//   3  monitor    marco, base y pantalla con el caso
//   4  logo       otra vez, hasta el final de la pagina
//
// Donde se dibuja: cada seccion reserva un hueco ([data-slot]) y el modelo
// se renderiza dentro de ese rectangulo (viewport + scissor) en un unico
// lienzo fijo detras del contenido. En escritorio viaja de hueco en hueco;
// si el siguiente esta en la otra columna, o en celular, se apaga en uno y
// se enciende en el otro, para no pasar nunca por encima del texto.
import {
  AdditiveBlending,
  BufferGeometry,
  CanvasTexture,
  Color,
  Euler,
  Float32BufferAttribute,
  Group,
  InstancedBufferAttribute,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  PointsMaterial,
  Quaternion,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
  TextureLoader,
  TorusGeometry,
  Vector3,
  WebGLRenderer,
} from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { initScroll, setScrollHook } from '@/lib/scroll';
import { projects } from '@/data/content';

const FOV = 30;
const TAN = Math.tan((FOV * Math.PI) / 360);
const HALF = 2.05; // medio alto visible en un hueco cuadrado
const K = 36; // bloques

const CYAN = [0.0, 0.92, 0.97];
const SOFT = [0.45, 0.97, 1.0];
const DEEP = [0.05, 0.5, 0.53];
const BONE = [0.86, 0.94, 0.94];
const LEAD = [0.34, 0.39, 0.4];

const RING_R = 1.3;
const RING_AL = 0.42;
const SCREEN_W = 2.9;
const SCREEN_H = SCREEN_W / 2.06;
const SCREEN_Y = 0.22;

const smooth = (x) => {
  const t = Math.min(1, Math.max(0, x));
  return t * t * (3 - 2 * t);
};
const lerp = (a, b, t) => a + (b - a) * t;

// --------------------------------------------------------------- material
// Bloque oscuro con borde de luz: el brillo sale del angulo de vision
// (fresnel) y de un filo calculado en el espacio local de la caja, asi se
// lee como una pieza solida sin luces ni postproceso.
const BLOCK_VERT = /* glsl */ `
  attribute float aGlow;
  varying vec3 vN;
  varying vec3 vV;
  varying vec3 vCol;
  varying vec3 vLocal;
  varying vec3 vScale;
  varying float vGlow;
  void main() {
    vec4 mv = modelViewMatrix * instanceMatrix * vec4(position, 1.0);
    mat3 nm = mat3(modelViewMatrix) * mat3(instanceMatrix);
    vN = normalize(nm * normal);
    vV = normalize(-mv.xyz);
    vCol = instanceColor;
    vLocal = position;
    vScale = vec3(length(instanceMatrix[0].xyz), length(instanceMatrix[1].xyz), length(instanceMatrix[2].xyz));
    vGlow = aGlow;
    gl_Position = projectionMatrix * mv;
  }
`;
const BLOCK_FRAG = /* glsl */ `
  precision mediump float;
  uniform float uFade;
  varying vec3 vN;
  varying vec3 vV;
  varying vec3 vCol;
  varying vec3 vLocal;
  varying vec3 vScale;
  varying float vGlow;
  void main() {
    vec3 n = normalize(vN);
    float facing = abs(dot(n, normalize(vV)));
    float rim = pow(1.0 - facing, 2.0);
    // Filo de luz en el contorno de la cara frontal (en unidades reales).
    vec2 d = (0.5 - abs(vLocal.xy)) * vScale.xy;
    float edge = 1.0 - smoothstep(0.0, 0.022, min(d.x, d.y));
    float top = clamp(n.y * 0.5 + 0.5, 0.0, 1.0);
    vec3 body = vCol * (0.12 + 0.16 * top) * (0.6 + 0.4 * vGlow);
    vec3 light = vCol * (rim * 1.4 + edge * 1.1) * (0.55 + 0.6 * vGlow);
    gl_FragColor = vec4(body + light, uFade);
  }
`;

function makeFsTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.font = '680 168px "Mona Sans", "Instrument Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#8ff9ff';
  ctx.shadowColor = '#00f3fb';
  ctx.shadowBlur = 40;
  ctx.fillText('FS', 256, 136);
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#e8ffff';
  ctx.fillText('FS', 256, 136);
  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  return tex;
}

// Halo suave para las particulas de fondo.
function makeDotTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.35, 'rgba(255,255,255,0.45)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return new CanvasTexture(canvas);
}

// ------------------------------------------------------------ poses (CPU)
// Cada pose da, para cada bloque: posicion, tamano, color y brillo. Un
// bloque con tamano casi 0 esta "guardado" en esa forma: aparece o
// desaparece en la transicion, y eso hace que la forma se vea construirse.
const HIDDEN = [0.001, 0.001, 0.001];

function poseTemplate() {
  const out = [];
  const BW = 0.9;
  const BH = 0.62;
  const GX = 1.04;
  const GY = 0.76;
  for (let b = 0; b < 9; b++) {
    const cx = ((b % 3) - 1) * GX;
    const cy = (1 - Math.floor(b / 3)) * GY;
    out.push({ p: [cx, cy, 0], s: [BW, BH, 0.06], c: LEAD, g: 0.3, card: b });
    out.push({ p: [cx - 0.22, cy + 0.08, 0.05], s: [0.34, 0.26, 0.04], c: LEAD, g: 0.5, card: b });
    out.push({ p: [cx + 0.2, cy + 0.14, 0.05], s: [0.36, 0.05, 0.03], c: LEAD, g: 0.6, card: b });
    out.push({ p: [cx + 0.14, cy + 0.02, 0.05], s: [0.24, 0.05, 0.03], c: LEAD, g: 0.6, card: b });
  }
  return out;
}

// Un layout a medida: titular, bajada, imagen grande, avatar, boton,
// lineas de texto, tarjetas de servicios y pie. Piezas desiguales y a
// distinta profundidad.
function poseCustom() {
  return [
    { p: [-0.5, 0.92, 0.25], s: [1.7, 0.18, 0.08], c: BONE, g: 1 },
    { p: [-0.75, 0.66, 0.25], s: [1.2, 0.11, 0.06], c: BONE, g: 0.8 },
    { p: [1.0, 0.35, -0.3], s: [0.9, 1.35, 0.1], c: DEEP, g: 0.7 },
    { p: [1.0, 0.68, -0.18], s: [0.6, 0.42, 0.05], c: SOFT, g: 0.9 },
    { p: [0.42, -0.36, 0.45], s: [0.5, 0.5, 0.18], c: CYAN, g: 1 },
    { p: [-0.98, 0.34, 0.1], s: [0.95, 0.06, 0.03], c: CYAN, g: 0.7 },
    { p: [-1.05, 0.2, 0.1], s: [0.8, 0.06, 0.03], c: CYAN, g: 0.7 },
    { p: [-1.12, 0.06, 0.1], s: [0.66, 0.06, 0.03], c: CYAN, g: 0.7 },
    { p: [-1.1, -0.22, 0.4], s: [0.66, 0.2, 0.08], c: CYAN, g: 1.2 },
    { p: [-1.02, -0.82, 0.0], s: [0.82, 0.38, 0.06], c: DEEP, g: 0.6 },
    { p: [-0.1, -0.82, 0.0], s: [0.82, 0.38, 0.06], c: DEEP, g: 0.6 },
    { p: [0.82, -0.82, 0.0], s: [0.82, 0.38, 0.06], c: DEEP, g: 0.6 },
    { p: [-1.02, -0.74, 0.06], s: [0.5, 0.05, 0.02], c: CYAN, g: 0.8 },
    { p: [-0.1, -0.74, 0.06], s: [0.5, 0.05, 0.02], c: CYAN, g: 0.8 },
    { p: [0.82, -0.74, 0.06], s: [0.5, 0.05, 0.02], c: CYAN, g: 0.8 },
    { p: [-0.25, -1.22, -0.05], s: [2.7, 0.08, 0.04], c: DEEP, g: 0.5 },
    { p: [0.0, 1.22, -0.1], s: [3.0, 0.08, 0.04], c: DEEP, g: 0.5 },
    { p: [1.3, 1.22, -0.06], s: [0.3, 0.1, 0.04], c: CYAN, g: 1 },
  ];
}

function poseMonitor() {
  const top = SCREEN_Y + SCREEN_H / 2;
  const bottom = SCREEN_Y - SCREEN_H / 2;
  const fw = SCREEN_W + 0.2;
  return [
    { p: [0, top + 0.05, 0], s: [fw, 0.1, 0.12], c: CYAN, g: 1 },
    { p: [0, bottom - 0.05, 0], s: [fw, 0.1, 0.12], c: CYAN, g: 1 },
    { p: [-fw / 2 + 0.05, SCREEN_Y, 0], s: [0.1, SCREEN_H + 0.2, 0.12], c: CYAN, g: 1 },
    { p: [fw / 2 - 0.05, SCREEN_Y, 0], s: [0.1, SCREEN_H + 0.2, 0.12], c: CYAN, g: 1 },
    { p: [0, bottom - 0.32, -0.04], s: [0.16, 0.46, 0.1], c: DEEP, g: 0.8 },
    { p: [0, bottom - 0.58, 0], s: [1.2, 0.08, 0.36], c: DEEP, g: 0.9 },
  ];
}

// Reparte una lista de piezas en K bloques; los que sobran quedan guardados
// en la pieza que les toca (o en `anchor`), y desde ahi aparecen.
function fill(pieces, anchor) {
  const out = [];
  for (let i = 0; i < K; i++) {
    if (i < pieces.length) out.push(pieces[i]);
    else {
      const host = pieces[i % pieces.length];
      out.push({ p: anchor ? [...anchor] : [...host.p], s: HIDDEN, c: host.c, g: 0 });
    }
  }
  return out;
}

// ---------------------------------------------------------------------------

export async function startOrbit(root) {
  const { gsap, lenis } = await initScroll();
  const mobile = window.matchMedia('(max-width: 899px)').matches;
  let seedState = 7;
  const rand = () => {
    seedState = (seedState * 16807) % 2147483647;
    return (seedState - 1) / 2147483646;
  };

  // ---------------------------------------------------------- lienzo
  // Sin antialias en celular: con piezas solidas y pixel ratio 1.5 no se
  // nota, y es buena parte del costo de cada cuadro.
  const renderer = new WebGLRenderer({ antialias: !mobile, alpha: true, powerPreference: 'high-performance' });
  renderer.setClearColor(0x000000, 0);
  const canvas = renderer.domElement;
  canvas.className = 'seq-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);
  let W = 0;
  let H = 0;
  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2));
    renderer.setSize(W, H, false);
  }
  resize();

  const scene = new Scene();
  const camera = new PerspectiveCamera(FOV, 1, 0.1, 60);

  const logoGroup = new Group();
  const monGroup = new Group();
  const rotC = new Group();
  scene.add(logoGroup, monGroup, rotC);

  // ---------------------------------------------------------- bloques
  const blockGeo = new RoundedBoxGeometry(1, 1, 1, 3, 0.08);
  const glowAttr = new InstancedBufferAttribute(new Float32Array(K), 1);
  blockGeo.setAttribute('aGlow', glowAttr);
  const blockUniforms = { uFade: { value: 1 } };
  const blockMat = new ShaderMaterial({ vertexShader: BLOCK_VERT, fragmentShader: BLOCK_FRAG, uniforms: blockUniforms, transparent: true });
  const blocks = new InstancedMesh(blockGeo, blockMat, K);
  blocks.frustumCulled = false;
  blocks.instanceColor = new InstancedBufferAttribute(new Float32Array(K * 3), 3);
  scene.add(blocks);

  const seeds = Array.from({ length: K }, () => rand());
  const spin = Array.from({ length: K }, () => [rand() - 0.5, rand() - 0.5, rand() - 0.5]);
  const POSE_B = fill(poseTemplate());
  const POSE_C = fill(poseCustom());
  const POSE_D = fill(poseMonitor(), [0, SCREEN_Y, -0.1]);
  const AXIS_Z = new Vector3(0, 0, 1);

  // Logo: 8 bloques corren por las orbitas (2 por orbita); el resto queda
  // dentro del nucleo, detras de "FS".
  function poseLogo(time) {
    const out = [];
    for (let i = 0; i < K; i++) {
      if (i < 8) {
        const k = i % 4;
        const dir = k % 2 ? -1 : 1;
        const a = (i < 4 ? 0 : Math.PI) + time * 0.55 * dir + k * 0.7;
        const v = new Vector3(RING_R * Math.cos(a), -RING_R * Math.sin(a) * Math.sin(RING_AL), RING_R * Math.sin(a) * Math.cos(RING_AL));
        v.applyAxisAngle(AXIS_Z, (k * Math.PI) / 4);
        out.push({ p: v.toArray(), s: [0.13, 0.13, 0.13], c: i % 2 ? SOFT : CYAN, g: 1.3, group: logoGroup });
      } else {
        out.push({ p: [0, 0, -0.05], s: HIDDEN, c: CYAN, g: 0, group: logoGroup });
      }
    }
    return out;
  }

  // ---------------------------------------------------------- orbitas
  const ringMats = [];
  const ringGroup = new Group();
  logoGroup.add(ringGroup);
  const addRing = (radius, tube, rot, color, opacity) => {
    const m = new MeshBasicMaterial({ color, transparent: true, opacity, blending: AdditiveBlending, depthWrite: false });
    m.userData.base = opacity;
    ringMats.push(m);
    const mesh = new Mesh(new TorusGeometry(radius, tube, 6, mobile ? 120 : 180), m);
    mesh.rotation.order = 'ZYX';
    mesh.rotation.set(...rot);
    ringGroup.add(mesh);
  };
  for (let k = 0; k < 4; k++) {
    const rot = [Math.PI / 2 + RING_AL, 0, (k * Math.PI) / 4];
    addRing(RING_R, 0.008, rot, 0x00f3fb, 0.85);
    addRing(RING_R, 0.035, rot, 0x0b8f96, 0.16); // halo
  }
  addRing(1.62, 0.01, [0, 0, 0], 0x00f3fb, 0.7);
  addRing(1.62, 0.04, [0, 0, 0], 0x0b8f96, 0.14);
  addRing(0.5, 0.012, [0, 0, 0], 0x00f3fb, 0.8);

  // "FS" en el centro.
  const fsMat = new MeshBasicMaterial({ map: makeFsTexture(), transparent: true, blending: AdditiveBlending, depthTest: false });
  const fs = new Mesh(new PlaneGeometry(0.78, 0.39), fsMat);
  scene.add(fs);

  // Particulas de luz alrededor, a la deriva (dan profundidad).
  const DUST = mobile ? 70 : 140;
  const dustPos = new Float32Array(DUST * 3);
  for (let i = 0; i < DUST; i++) {
    const th = rand() * Math.PI * 2;
    const r = 1.8 + rand() * 0.8;
    dustPos.set([r * Math.cos(th), (rand() - 0.5) * 2.8, r * Math.sin(th) - 0.4], i * 3);
  }
  const dustGeo = new BufferGeometry();
  dustGeo.setAttribute('position', new Float32BufferAttribute(dustPos, 3));
  const dustMat = new PointsMaterial({
    map: makeDotTexture(),
    color: 0x0fb8bf,
    size: mobile ? 0.07 : 0.06,
    transparent: true,
    opacity: 0.6,
    blending: AdditiveBlending,
    depthWrite: false,
  });
  const dust = new Points(dustGeo, dustMat);
  scene.add(dust);

  // Pantalla del monitor: dos capas para fundir de un caso al otro.
  const loader = new TextureLoader();
  const shots = projects.map((c) => {
    const t = loader.load(`/assets/${c.img}-${mobile ? 480 : 960}.webp`);
    t.colorSpace = SRGBColorSpace;
    return t;
  });
  const screenGeo = new PlaneGeometry(SCREEN_W, SCREEN_H);
  const makeScreen = () => {
    const m = new MeshBasicMaterial({ transparent: true, opacity: 0, depthTest: false });
    const mesh = new Mesh(screenGeo, m);
    mesh.position.set(0, SCREEN_Y, 0.02);
    monGroup.add(mesh);
    return m;
  };
  const backing = new MeshBasicMaterial({ color: 0x030809, transparent: true, opacity: 0, depthTest: false });
  const back = new Mesh(screenGeo, backing);
  back.position.set(0, SCREEN_Y, 0.01);
  monGroup.add(back);
  const screenA = makeScreen();
  const screenB = makeScreen();
  screenA.map = shots[0];
  screenB.map = shots[0];

  // ---------------------------------------------------------- medidas
  const q = (sel) => root.querySelector(sel);
  const page = root.closest('main') || document;
  const slots = [...page.querySelectorAll('[data-slot]')];
  let marks = null;
  function measure() {
    const vh = window.innerHeight;
    const top = (el) => el.getBoundingClientRect().top + window.scrollY;
    const span = (el, lead) => {
      const start = top(el) - vh * lead;
      return [start, Math.max(start + vh * 0.5, top(el) + el.offsetHeight - vh)];
    };
    const s2 = q('.scene-2');
    const s3 = q('.scene-3');
    const s4 = q('.scene-4');
    const s5 = q('.scene-5');
    marks = mobile
      ? {
          t1: [top(s2) - vh * 0.75, top(s2) + vh * 0.05],
          t2: [top(s3) - vh * 0.75, top(s3) + vh * 0.05],
          t3: [top(s4) - vh * 0.8, top(s4) - vh * 0.1],
          t4: [top(s5) - vh * 0.8, top(s5) - vh * 0.1],
        }
      : {
          t1: span(s2, 0.55),
          t2: span(s3, 0.55),
          t3: [top(s4) - vh * 0.7, top(s4) + vh * 0.05],
          t4: [top(s5) - vh * 0.75, top(s5) - vh * 0.15],
        };
  }
  measure();

  // ------------------------------------------- pausas de scroll (escritorio)
  // Del monitor de los casos en adelante, al salir de cada hueco la rueda
  // queda retenida HOLD px: la pagina no se mueve mientras el modelo se
  // deshace en particulas. Despues la pagina sigue normal, las particulas
  // viajan al hueco siguiente y alli se rearman. La pagina nunca se desplaza
  // por codigo durante la pausa, asi que no hay saltos.
  const HOLD = 360;
  let pins = [];
  const cyAt = (inf, Y) =>
    inf.docCy !== undefined
      ? inf.docCy - Y
      : Math.min(Math.max(inf.stNat, Y + inf.top), inf.contBottom - inf.stH) + inf.off - Y;
  const solve = (inf, target, maxY) => {
    let lo = 0;
    let hi = maxY;
    if (cyAt(inf, 0) <= target) return 0;
    for (let n = 0; n < 40; n++) {
      const mid = (lo + hi) / 2;
      if (cyAt(inf, mid) > target) lo = mid;
      else hi = mid;
    }
    return hi;
  };
  function measurePins() {
    if (mobile || page === document) return;
    const sy = window.scrollY;
    const vh = window.innerHeight;
    const infos = [];
    let started = false;
    for (const el of slots) {
      if (el.dataset.slot === 'd') started = true;
      if (!started) continue;
      const r0 = el.getBoundingClientRect();
      if (!r0.width || !r0.height) continue;
      let st = el.parentElement;
      let stick = null;
      while (st && st !== page) {
        if (getComputedStyle(st).position === 'sticky') {
          stick = st;
          break;
        }
        st = st.parentElement;
      }
      if (stick) {
        const top = parseFloat(getComputedStyle(stick).top) || 0;
        stick.style.position = 'static';
        const sr = stick.getBoundingClientRect();
        const r = el.getBoundingClientRect();
        const pr = stick.parentElement.getBoundingClientRect();
        stick.style.position = '';
        infos.push({ el, stNat: sr.top + sy, stH: sr.height, contBottom: pr.bottom + sy, top, off: r.top - sr.top + r.height / 2 });
      } else {
        infos.push({ el, docCy: r0.top + sy + r0.height / 2 });
      }
    }
    const maxY = document.documentElement.scrollHeight;
    const out = [];
    let lastA = -Infinity;
    for (let i = 0; i < infos.length - 1; i++) {
      const Y = Math.max(solve(infos[i], vh * 0.42, maxY), lastA + 40);
      let A = solve(infos[i + 1], vh * 0.6, maxY);
      if (A < Y + vh * 0.3) A = Y + vh * 0.3;
      lastA = A;
      const old = pins[i];
      out.push({ a: infos[i], b: infos[i + 1], Y, A, prog: old?.prog ?? 0, shown: old?.shown ?? 0 });
    }
    pins = out;
  }
  measurePins();

  // La rueda: al cruzar el punto de una pausa, el gesto se convierte en
  // avance de la transformacion en vez de scroll (y al reves al subir).
  // Devuelve true si el gesto quedo retenido.
  function absorb(dy, cur, jumpTo) {
    if (!dy || !pins.length) return false;
    if (dy > 0) {
      for (const p of pins) {
        if (p.prog < 1 && cur <= p.Y + 1 && cur + dy >= p.Y - 0.5) {
          const used = Math.max(0, cur + dy - Math.max(cur, p.Y));
          if (cur < p.Y - 1) jumpTo(p.Y);
          p.prog = Math.min(1, p.prog + used / HOLD);
          return true;
        }
      }
    } else {
      for (let i = pins.length - 1; i >= 0; i--) {
        const p = pins[i];
        if (p.prog > 0 && cur >= p.Y - 1 && cur + dy <= p.Y + 0.5) {
          const used = Math.max(0, Math.min(cur, p.Y) - (cur + dy));
          if (cur > p.Y + 1) jumpTo(p.Y);
          p.prog = Math.max(0, p.prog - used / HOLD);
          return true;
        }
      }
    }
    return false;
  }
  let onWheel = null;
  if (!mobile && lenis) {
    // Con scroll suave (Lenis) el gancho decide antes de mover la pagina.
    setScrollHook((data) => {
      if (!absorb(data.deltaY, lenis.targetScroll, (y) => lenis.scrollTo(y))) return true;
      if (data.event?.cancelable) data.event.preventDefault();
      return false;
    });
  } else if (!mobile) {
    // Scroll nativo (movimiento reducido): misma logica sobre la rueda.
    onWheel = (e) => {
      if (e.ctrlKey) return;
      const dy = e.deltaY * (e.deltaMode === 1 ? 40 : e.deltaMode === 2 ? window.innerHeight : 1);
      if (absorb(dy, window.scrollY, (y) => window.scrollTo(0, y))) e.preventDefault();
    };
    window.addEventListener('wheel', onWheel, { passive: false });
  }

  const squareOf = (el) => {
    const r = el.getBoundingClientRect();
    const w = Math.min(r.width, r.height);
    return { el, x: r.left + (r.width - w) / 2, y: r.top + (r.height - w) / 2, w, h: w };
  };
  const grow = (r, g) => ({ ...r, x: r.x - (r.w * (g - 1)) / 2, y: r.y - (r.h * (g - 1)) / 2, w: r.w * g, h: r.h * g });
  function desktopPlacements(dt) {
    const y = window.scrollY;
    const target = lenis ? lenis.targetScroll : y;
    for (const p of pins) {
      // Si se llego por otro camino (barra, teclado, enlaces), la pausa
      // queda resuelta segun de que lado esta la pagina.
      if (y > p.Y + 2 && target > p.Y + 2) p.prog = 1;
      else if (y < p.Y - 2 && target < p.Y - 2) p.prog = 0;
      p.shown += (p.prog - p.shown) * (1 - Math.exp(-dt * 9));
      if (Math.abs(p.prog - p.shown) < 0.002) p.shown = p.prog;
    }
    let k = -1;
    for (let i = 0; i < pins.length; i++) if (y >= pins[i].Y - 2 && pins[i].shown > 0.001) k = i;
    // Antes de la primera pausa: el recorrido de siempre (inicio a casos).
    if (k < 0) return placements().map((pl) => ({ ...pl, shape: P }));
    const p = pins[k];
    if (p.shown < 0.999 || y <= p.Y + 2) {
      const sc = smooth(p.shown);
      const g = 1 + 0.35 * sc;
      return [{ ...grow(squareOf(p.a.el), g), alpha: 1, scatter: sc, zoom: g }];
    }
    const t = Math.min(1, Math.max(0, (y - p.Y) / (p.A - p.Y)));
    if (t >= 1) return [{ ...squareOf(p.b.el), alpha: 1 }];
    // Las particulas salen del punto de la pantalla donde se deshizo el
    // modelo (no se van con la pagina) y van hacia el hueco siguiente.
    const ra = squareOf(p.a.el);
    ra.y = cyAt(p.a, p.Y) - ra.h / 2;
    const rb = squareOf(p.b.el);
    const m = smooth(t / 0.75);
    const sc = 1 - smooth((t - 0.72) / 0.28);
    const g = 1 + 0.35 * sc;
    const w = lerp(ra.w, rb.w, m);
    const cx = lerp(ra.x + ra.w / 2, rb.x + rb.w / 2, m);
    const cy = lerp(ra.y + ra.h / 2, rb.y + rb.h / 2, m);
    return [{ ...grow({ el: rb.el, x: cx - w / 2, y: cy - w / 2, w, h: w }, g), alpha: 1, scatter: sc, zoom: g }];
  }

  // Forma (0-4) segun el scroll.
  function targetP(y) {
    const m = marks;
    const seg = ([a, b], p0) => p0 + Math.min(1, Math.max(0, (y - a) / (b - a)));
    if (y < m.t1[0]) return 0;
    if (y <= m.t1[1]) return seg(m.t1, 0);
    if (y < m.t2[0]) return 1;
    if (y <= m.t2[1]) return seg(m.t2, 1);
    if (y < m.t3[0]) return 2;
    if (y <= m.t3[1]) return seg(m.t3, 2);
    if (y < m.t4[0]) return 3;
    if (y <= m.t4[1]) return seg(m.t4, 3);
    return 4;
  }

  // Huecos con tamano, en orden de la pagina.
  function slotRects() {
    const out = [];
    for (const el of slots) {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height || r.bottom < -H || r.top > 2 * H) continue;
      const w = Math.min(r.width, r.height);
      out.push({ el, x: r.left + (r.width - w) / 2, y: r.top + (r.height - w) / 2, w, h: w, cy: r.top + r.height / 2 });
    }
    return out;
  }

  const head = document.querySelector('.site-head');
  function placements() {
    const out = placementsRaw();
    if (!mobile) return out;
    const top = head ? head.getBoundingClientRect().bottom : 64;
    const bottom = H - 96;
    for (const p of out) {
      // Del todo visible con el hueco entero a la vista; invisible cuando la
      // mitad del hueco ya quedo bajo la cabecera o la barra.
      const vis = Math.min(smooth((p.y + p.h * 0.5 - top) / (p.h * 0.5)), smooth((bottom - p.y - p.h * 0.5) / (p.h * 0.5)));
      p.alpha *= vis;
    }
    return out.filter((p) => p.alpha > 0.01);
  }
  function placementsRaw() {
    const rects = slotRects();
    if (!rects.length) return [];
    const c = H * 0.5;
    const i = rects.findIndex((r) => r.cy > c);
    if (i === -1) return [{ ...rects[rects.length - 1], alpha: 1 }];
    if (i === 0) return [{ ...rects[0], alpha: 1 }];
    const a = rects[i - 1];
    const b = rects[i];
    const t = (c - a.cy) / (b.cy - a.cy);
    // Entre dos huecos del logo (servicios, preguntas, cierre): el logo se
    // deshace en particulas que viajan al otro hueco y alli lo vuelven a armar.
    if (!mobile && shapeOf(a.el) === 4 && shapeOf(b.el) === 4) {
      // Tres tramos: se deshace en particulas, solo las particulas viajan,
      // y al llegar se vuelve a armar.
      // El modelo se queda quieto en pantalla mientras se deshace (la pagina
      // sigue subiendo por detras), viaja como particulas y espera quieto a
      // que el hueco siguiente llegue hasta el mientras se rearma.
      const D = b.cy - a.cy;
      const T0 = 0.1, T1 = 0.36, T2 = 0.62, T3 = 0.9;
      const y0 = c - T0 * D;
      const y1 = c + (1 - T3) * D;
      let cy;
      if (t < T0) cy = a.cy;
      else if (t < T1) cy = y0;
      else if (t < T2) cy = lerp(y0, y1, smooth((t - T1) / (T2 - T1)));
      else if (t < T3) cy = y1;
      else cy = b.cy;
      const sc = Math.min(smooth((t - T0) / (T1 - T0 - 0.04)), smooth((T3 - t) / (T3 - T2 - 0.04)));
      const m = smooth((t - T1) / (T2 - T1));
      const g = 1 + 0.35 * sc;
      const w = lerp(a.w, b.w, m) * g;
      const cx = lerp(a.x + a.w / 2, b.x + b.w / 2, m);
      return [{ el: m < 0.5 ? a.el : b.el, x: cx - w / 2, y: cy - w / 2, w, h: w, alpha: 1, scatter: sc, zoom: g }];
    }
    // Solo los huecos de las escenas (inicio a casos) se deslizan; el resto
    // (casos a planes, por ejemplo) se funde, para no cruzar las tarjetas.
    const scenes = shapeOf(a.el) < 3 && shapeOf(b.el) < 4;
    if (mobile || !scenes || Math.abs(b.x - a.x) > W * 0.25) {
      const k = smooth((t - 0.32) / 0.36);
      const grow = (r, s) => ({ ...r, x: r.x + (r.w * (1 - s)) / 2, y: r.y + (r.h * (1 - s)) / 2, w: r.w * s, h: r.h * s });
      return [
        { ...grow(a, 1 - 0.1 * k), alpha: 1 - k },
        { ...grow(b, 0.9 + 0.1 * k), alpha: k },
      ].filter((p) => p.alpha > 0.01);
    }
    const k = smooth((t - 0.2) / 0.6);
    const near = k < 0.5 ? a : b;
    return [{ el: near.el, x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), w: lerp(a.w, b.w, k), h: lerp(a.h, b.h, k), alpha: 1 }];
  }

  // El monitor va mostrando los sitios publicados, uno cada 3.5 s.
  const CASE_EVERY = 3.5;
  const activeCase = (time) => Math.floor(time / CASE_EVERY) % shots.length;

  // Forma que corresponde a cada hueco (celular).
  const SLOT_SHAPE = { a: 0, b: 1, c: 2, d: 3 };
  const shapeOf = (el) => SLOT_SHAPE[el?.dataset.slot] ?? 4;

  // ---------------------------------------------------------- estado vivo
  const pointer = { x: 0, y: 0, cx: 0, cy: 0 };
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const onMove = (e) => {
    pointer.x = (e.clientX / W - 0.5) * 2;
    pointer.y = (e.clientY / H - 0.5) * 2;
  };
  if (fine) window.addEventListener('pointermove', onMove, { passive: true });

  let P = 0;
  let introStart = null;
  let shownCase = 0;
  let fadeCase = 1;
  let shown = false;
  const AMPS = mobile ? [0.25, 0.45, 0.3, 0.25] : [0.35, 0.6, 0.4, 0.3];

  // Reutilizables (sin basura por cuadro).
  const m4 = new Matrix4();
  const ident = new Matrix4();
  const qA = new Quaternion();
  const qB = new Quaternion();
  const qT = new Quaternion();
  const eul = new Euler();
  const vA = new Vector3();
  const vB = new Vector3();
  const vS = new Vector3();
  const vF = new Vector3();
  const col = new Color();

  // Pose de cada forma con su movimiento propio.
  function shapePose(shape, time) {
    if (shape === 0 || shape === 4) return poseLogo(time);
    if (shape === 1) {
      // Una onda de luz recorre las tarjetas de la plantilla.
      return POSE_B.map((b) => {
        const card = b.card ?? 0;
        const wave = Math.pow(0.5 + 0.5 * Math.sin(time * 2.2 - (card % 3) * 1.1 + Math.floor(card / 3) * 0.8), 4);
        return { ...b, g: b.g + wave * 1.2, p: [b.p[0], b.p[1], b.p[2] + 0.05 * wave] };
      });
    }
    if (shape === 2) {
      return POSE_C.map((b, i) => ({
        ...b,
        p: [b.p[0], b.p[1] + 0.03 * Math.sin(time * 0.9 + i), b.p[2] + 0.06 * Math.sin(time * 0.7 + i * 1.7)],
        group: rotC,
      }));
    }
    return POSE_D.map((b) => ({ ...b, group: monGroup }));
  }

  function toWorld(b, out) {
    out.set(b.p[0], b.p[1], b.p[2]);
    if (b.group) out.applyMatrix4(b.group.matrix);
    return out;
  }

  function placeBlocks(p, time, intro, scatter = 0) {
    const i0 = Math.min(3, Math.floor(p));
    const t = p - i0;
    const from = shapePose(i0, time);
    const to = shapePose(i0 + 1, time);
    const amp = AMPS[i0];
    for (let i = 0; i < K; i++) {
      const a = from[i];
      const b = to[i];
      const lt = smooth((t - seeds[i] * 0.3) / 0.7);
      toWorld(a, vA);
      toWorld(b, vB);
      vA.lerp(vB, lt);
      // Arco: a mitad de camino cada bloque se separa un poco.
      const arc = Math.sin(lt * Math.PI) * amp;
      vA.x += spin[i][0] * arc * 2;
      vA.y += spin[i][1] * arc * 2;
      vA.z += spin[i][2] * arc * 2 + arc * 0.4;

      vS.set(lerp(a.s[0], b.s[0], lt), lerp(a.s[1], b.s[1], lt), lerp(a.s[2], b.s[2], lt));

      // Viaje entre huecos del logo: cada bloque se abre en una nube.
      // Todos los bloques (tambien los guardados) pasan a ser particulas
      // pequenas en una nube suelta que gira despacio.
      if (scatter > 0) {
        const ang = seeds[i] * Math.PI * 2 + time * (0.4 + seeds[i] * 0.5);
        const r = 0.5 + seeds[(i + 7) % K] * 1.1;
        vF.set(Math.cos(ang) * r, (seeds[(i + 3) % K] - 0.5) * 1.8, Math.sin(ang) * r * 0.6);
        vA.lerp(vF, scatter);
        vS.lerp(vF.set(0.055, 0.055, 0.055), scatter);
      }

      // Intro: los bloques llegan en espiral desde afuera.
      const il = smooth((intro - seeds[i] * 0.45) / 0.55);
      if (il < 1) {
        const ang = seeds[i] * Math.PI * 2 + (1 - il) * 2.4;
        const r = 3.4 + seeds[i] * 1.6;
        vF.set(Math.cos(ang) * r, (seeds[i] - 0.5) * 3, Math.sin(ang) * r - 1);
        vA.lerp(vF, 1 - il);
        vS.lerp(vF.set(0.14, 0.14, 0.14), 1 - il);
      }

      // Rotacion: la del grupo de cada forma, con un giro extra en el camino.
      qA.setFromRotationMatrix(m4.extractRotation(a.group ? a.group.matrix : ident));
      qB.setFromRotationMatrix(m4.extractRotation(b.group ? b.group.matrix : ident));
      qT.slerpQuaternions(qA, qB, lt);
      eul.set(spin[i][0] * arc * 4 + (1 - il) * 3, spin[i][1] * arc * 4 + (1 - il) * 2, spin[i][2] * arc * 2);
      qA.setFromEuler(eul);
      qT.multiply(qA);
      m4.compose(vA, qT, vS);
      blocks.setMatrixAt(i, m4);

      col.setRGB(lerp(a.c[0], b.c[0], lt), lerp(a.c[1], b.c[1], lt), lerp(a.c[2], b.c[2], lt));
      blocks.setColorAt(i, col);
      glowAttr.array[i] = lerp(a.g, b.g, lt) * (0.6 + 0.4 * il);
      // Como particulas: todas cian y encendidas, para que la nube se lea.
      if (scatter > 0) {
        col.setRGB(lerp(col.r, CYAN[0], scatter), lerp(col.g, CYAN[1], scatter), lerp(col.b, CYAN[2], scatter));
        blocks.setColorAt(i, col);
        glowAttr.array[i] = lerp(glowAttr.array[i], 1.8, scatter);
      }
    }
    blocks.instanceMatrix.needsUpdate = true;
    blocks.instanceColor.needsUpdate = true;
    glowAttr.needsUpdate = true;
  }

  function frame(time, deltaMs) {
    const dt = Math.min(0.1, deltaMs / 1000 || 0.016);

    // Intro: los bloques llegan y el logo se enciende al aparecer.
    if (introStart === null) introStart = time;
    const intro = smooth((time - introStart) / 2.0);

    // Escritorio: la forma sigue al scroll con inercia. Celular: la forma es
    // la del hueco que esta a la vista, y el cambio se reproduce solo (~1 s)
    // al llegar, para que nunca quede detenido a mitad de camino.
    const places = mobile ? placements() : desktopPlacements(dt);
    if (mobile) {
      const main = places.reduce((m, pl) => (pl.alpha > (m?.alpha ?? -1) ? pl : m), null);
      const target = shapeOf(main?.el);
      if (P > 3.5 && target < 3) P = 0;
      const step = dt * 1.1;
      P = Math.abs(target - P) <= step ? target : P + Math.sign(target - P) * step;
    } else {
      const target = targetP(window.scrollY);
      P += (target - P) * (1 - Math.exp(-dt * 5));
    }

    // Movimientos propios de cada forma.
    logoGroup.rotation.set(0.22 + 0.06 * Math.sin(time * 0.37), 0.12 * Math.sin(time * 0.23), time * 0.1);
    logoGroup.updateMatrix();
    logoGroup.updateMatrixWorld();
    rotC.rotation.set(0.08 + 0.05 * Math.sin(time * 0.31), -0.42 + 0.12 * Math.sin(time * 0.27), 0);
    rotC.updateMatrix();
    monGroup.rotation.set(0.04 * Math.sin(time * 0.33), 0.16 * Math.sin(time * 0.29), 0);
    monGroup.updateMatrix();
    monGroup.updateMatrixWorld();
    dust.rotation.y = time * 0.05;

    // Pesos de cada forma: logo (orbitas, FS) y monitor (pantalla).
    const ringIn = smooth((intro - 0.35) / 0.65);
    const pulse = 1 + 0.12 * Math.sin(time * 2.4);
    const applyShape = (S, sc = 0) => {
      placeBlocks(S, time, intro, sc);
      const a = Math.max(0, 1 - S * 1.6) + Math.max(0, 1 - (4 - S) * 1.6);
      ringGroup.scale.setScalar(Math.max(0.0001, a * (0.6 + 0.4 * ringIn) * (1 - sc)));
      fs.scale.setScalar(Math.max(0.0001, a * ringIn * (1 - sc)) * pulse);
      return [a, Math.max(0, 1 - Math.abs(S - 3) * 2.2) * (1 - sc)];
    };
    // Celular: cada hueco muestra su forma ya armada y el paso entre huecos
    // es un fundido; escritorio: una sola forma que sigue al scroll.
    let [wA, wD] = [0, 0];

    pointer.cx += (pointer.x - pointer.cx) * 0.05;
    pointer.cy += (pointer.y - pointer.cy) * 0.05;

    // Caso en pantalla: fundido de 0.6 s al cambiar.
    const want = activeCase(time);
    if (want !== shownCase && fadeCase >= 1) {
      screenB.map = shots[shownCase];
      screenB.needsUpdate = true;
      shownCase = want;
      screenA.map = shots[shownCase];
      screenA.needsUpdate = true;
      fadeCase = 0;
    }
    fadeCase = Math.min(1, fadeCase + dt / 0.6);

    renderer.setScissorTest(false);
    renderer.clear();
    renderer.setScissorTest(true);
    for (const p of places) {
      [wA, wD] = applyShape(p.shape ?? shapeOf(p.el), p.scatter || 0);
      blockUniforms.uFade.value = p.alpha;
      for (const m of ringMats) m.opacity = m.userData.base * p.alpha * ringIn * (0.85 + 0.15 * Math.sin(time * 2));
      fsMat.opacity = wA * p.alpha * ringIn;
      const sc = p.scatter || 0;
      dust.scale.setScalar(1 + 0.7 * sc);
      dustMat.opacity = (0.55 + 0.45 * sc) * p.alpha * intro;
      backing.opacity = wD * 0.95 * p.alpha;
      screenA.opacity = wD * p.alpha * fadeCase;
      screenB.opacity = wD * p.alpha * (1 - fadeCase);

      const aspect = p.w / p.h;
      const halfH = aspect >= 1 ? HALF : HALF / aspect;
      const dist = (halfH / TAN) * (p.zoom || 1);
      const calmD = 1 - 0.75 * wD;
      const yaw = (0.2 * Math.sin(time * 0.21) + pointer.cx * 0.18) * calmD;
      const pitch = (0.07 * Math.sin(time * 0.17) - pointer.cy * 0.1) * calmD;
      camera.aspect = aspect;
      camera.position.set(dist * Math.sin(yaw) * Math.cos(pitch), dist * Math.sin(pitch), dist * Math.cos(yaw) * Math.cos(pitch));
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
      fs.quaternion.copy(camera.quaternion);

      const gy = H - p.y - p.h;
      renderer.setViewport(p.x, gy, p.w, p.h);
      renderer.setScissor(p.x, gy, p.w, p.h);
      renderer.render(scene, camera);
    }
    if (!shown && places.length) {
      shown = true;
      document.documentElement.classList.add('seq-on');
    }
  }

  // En celular se dibuja a 30 cuadros por segundo: el movimiento se ve
  // igual de fluido y el hilo principal queda libre para el scroll.
  let acc = 0;
  const tick = (time, deltaMs) => {
    if (mobile) {
      acc += deltaMs;
      if (acc < 30) return;
      deltaMs = acc;
      acc = 0;
    }
    frame(time, deltaMs);
  };
  gsap.ticker.add(tick);

  let lastW = window.innerWidth;
  const onResize = () => {
    resize();
    if (!mobile || window.innerWidth !== lastW) {
      measure();
      measurePins();
    }
    lastW = window.innerWidth;
  };
  window.addEventListener('resize', onResize);
  const remeasure = setInterval(() => {
    measure();
    measurePins();
  }, 1500);
  const onVisibility = () => (document.hidden ? gsap.ticker.remove(tick) : gsap.ticker.add(tick));
  document.addEventListener('visibilitychange', onVisibility);

  function dispose() {
    gsap.ticker.remove(tick);
    setScrollHook(null);
    if (onWheel) window.removeEventListener('wheel', onWheel);
    clearInterval(remeasure);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('pointermove', onMove);
    document.removeEventListener('visibilitychange', onVisibility);
    scene.traverse((o) => {
      o.geometry?.dispose?.();
      o.material?.map?.dispose?.();
      o.material?.dispose?.();
    });
    shots.forEach((t) => t.dispose());
    renderer.dispose();
    canvas.remove();
    document.documentElement.classList.remove('seq-on');
  }

  // Si el navegador pierde el contexto grafico, vuelve la version estatica.
  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    dispose();
    document.documentElement.classList.remove('seq');
  });

  return dispose;
}
