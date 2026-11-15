// El objeto en orbita hecho de codigo.
//
// Un solo lienzo WebGL para toda la home. Son ~1500 caracteres de codigo
// (instancias de un mismo cuadrado con un atlas de glifos) que tienen una
// posicion por escena y se mezclan en el shader segun el scroll:
//
//   T = 0  atomo del logo: cuatro orbitas, nucleo y halo, girando
//   T = 1  la plantilla: nueve cajas identicas, grises, mismo caracter
//   T = 2  el layout a medida: bloques desiguales con profundidad, en cian
//   T = 3  los casos: marcos alrededor de tres planos en fila; la camara
//          avanza de uno a otro
//   T = 4  el atomo otra vez, pequeno, junto a los planes
//
// Dibuja con el ticker de GSAP (el mismo ciclo que mueve a Lenis) y solo
// mientras el recorrido esta en pantalla y la pestana visible.
import {
  AdditiveBlending,
  CanvasTexture,
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  LinearFilter,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
  TextureLoader,
  Vector4,
  WebGLRenderer,
} from 'three';
import { initScroll } from '@/lib/scroll';
import { homeCases } from '@/data/content';

const FOV = 34;
const CAM_Z = 10;
const FOCUS = 6; // distancia a la que la camara "mira" cada caso
const GAP = 7; // separacion en profundidad entre casos
const GLYPHS = '<>/{}()[];=:.,"\'+-*&|!?#$_%@~^\\abcdefghijklmnopqrstuvwxyz012345';
const SAME = GLYPHS.indexOf('x');
const PLANE_RATIO = 2.06;

const VERT = /* glsl */ `
  attribute vec4 aOrb;   // inclinacion, giro, angulo inicial, radio
  attribute vec3 aB;
  attribute vec3 aC;
  attribute vec3 aD;
  attribute vec4 aRnd;   // semilla, glifo, tamano, velocidad
  uniform float uT;
  uniform float uTime;
  uniform float uSize;
  uniform vec4 uOffA;
  uniform vec4 uOffB;
  uniform vec4 uOffC;
  uniform vec4 uOffE;
  varying vec2 vUv;
  varying float vGlyph;
  varying float vAlpha;
  varying float vGray;

  float ease(float x) {
    x = clamp(x, 0.0, 1.0);
    return x * x * (3.0 - 2.0 * x);
  }
  // Cada caracter sale con un pequeno retraso propio.
  float seg(float k, float seed) {
    return ease((uT - k - seed * 0.3) / 0.7);
  }
  vec3 orbit(vec4 o, float speed) {
    float th = o.z + uTime * speed;
    vec3 p = vec3(cos(th) * o.w, 0.0, sin(th) * o.w);
    float cx = cos(o.x), sx = sin(o.x);
    p = vec3(p.x, p.y * cx - p.z * sx, p.y * sx + p.z * cx);
    float cz = cos(o.y), sz = sin(o.y);
    return vec3(p.x * cz - p.y * sz, p.x * sz + p.y * cz, p.z);
  }

  void main() {
    float seed = aRnd.x;
    vec3 a = orbit(aOrb, aRnd.w);
    float sp = uTime * 0.1;
    a.xz = mat2(cos(sp), -sin(sp), sin(sp), cos(sp)) * a.xz;

    vec3 pA = a * uOffA.w + uOffA.xyz;
    vec3 pB = aB * uOffB.w + uOffB.xyz;
    vec3 pC = aC * uOffC.w + uOffC.xyz;
    vec3 pE = a * uOffE.w + uOffE.xyz;

    float f1 = seg(0.0, seed);
    float f2 = seg(1.0, seed);
    float f3 = seg(2.0, seed);
    float f4 = seg(3.0, seed);

    vec3 p = mix(pA, pB, f1);
    p = mix(p, pC, f2);
    p = mix(p, aD, f3);
    p = mix(p, pE, f4);

    // A mitad de cada cambio los caracteres se desordenan; el mayor
    // desorden es entre la plantilla y el layout a medida.
    float mid = sin(f1 * 3.1416) * 0.3 + sin(f2 * 3.1416) * 0.95 + sin(f3 * 3.1416) * 0.5 + sin(f4 * 3.1416) * 0.4;
    vec3 n = vec3(sin(seed * 91.7 + uTime * 0.4), cos(seed * 57.3 + uTime * 0.3), sin(seed * 33.1 + 1.7));
    p += n * mid * 0.6;

    float gray = clamp(1.0 - abs(uT - 1.0) * 1.25, 0.0, 1.0);
    vGray = gray;
    vGlyph = gray > seed * 0.8 + 0.1 ? ${SAME}.0 : aRnd.y;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    mv.xy += position.xy * uSize * aRnd.z;
    gl_Position = projectionMatrix * mv;

    float d = -mv.z;
    float twinkle = 0.72 + 0.28 * sin(uTime * (0.6 + seed) + seed * 40.0);
    vAlpha = smoothstep(0.5, 2.6, d) * (1.0 - smoothstep(15.0, 27.0, d)) * twinkle * (0.4 + 0.6 * fract(seed * 7.31));
    vUv = uv;
  }
`;

const FRAG = /* glsl */ `
  precision mediump float;
  uniform sampler2D uAtlas;
  uniform float uFade;
  varying vec2 vUv;
  varying float vGlyph;
  varying float vAlpha;
  varying float vGray;
  void main() {
    float col = mod(vGlyph, 8.0);
    float row = floor(vGlyph / 8.0);
    vec2 uv = (vec2(col, 7.0 - row) + vUv) / 8.0;
    float a = texture2D(uAtlas, uv).a * vAlpha * uFade;
    if (a < 0.01) discard;
    vec3 cyan = vec3(0.0, 0.953, 0.984);
    vec3 lead = vec3(0.36, 0.41, 0.42);
    gl_FragColor = vec4(mix(cyan, lead, vGray) * a, a);
  }
`;

const rand = (a, b) => a + Math.random() * (b - a);
const ease = (x) => {
  const t = Math.min(1, Math.max(0, x));
  return t * t * (3 - 2 * t);
};
const smooth = (a, b, x) => ease((x - a) / (b - a));

async function makeAtlas() {
  try {
    await Promise.race([document.fonts.load('600 44px "JetBrains Mono"'), new Promise((r) => setTimeout(r, 1500))]);
  } catch {
    /* sigue con la monoespaciada del sistema */
  }
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 512;
  const ctx = canvas.getContext('2d');
  ctx.font = '600 44px "JetBrains Mono", ui-monospace, Menlo, Consolas, monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#fff';
  [...GLYPHS].forEach((ch, i) => ctx.fillText(ch, (i % 8) * 64 + 32, Math.floor(i / 8) * 64 + 34));
  const tex = new CanvasTexture(canvas);
  tex.minFilter = LinearFilter;
  tex.generateMipmaps = false;
  return tex;
}

// Lamina para un caso sin capturas: lo dice, no inventa una imagen.
function plateTexture(title) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = Math.round(1024 / PLANE_RATIO);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#0d1416';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#0b6f74';
  ctx.lineWidth = 3;
  ctx.setLineDash([14, 12]);
  ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#eaf2f2';
  ctx.font = '800 84px Anybody, sans-serif';
  if ('fontStretch' in ctx) ctx.fontStretch = 'condensed';
  ctx.fillText(title, canvas.width / 2, canvas.height / 2 + 4);
  ctx.fillStyle = '#93a6a8';
  ctx.font = '400 34px "Instrument Sans", sans-serif';
  if ('fontStretch' in ctx) ctx.fontStretch = 'normal';
  ctx.fillText('Caso en preparación', canvas.width / 2, canvas.height / 2 + 64);
  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  return tex;
}

// ---- posiciones por escena -------------------------------------------------

// Punto sobre el perimetro de un rectangulo (u de 0 a 1).
function rectPoint(x0, y0, x1, y1, u) {
  const w = x1 - x0;
  const h = y1 - y0;
  let d = u * 2 * (w + h);
  if (d < w) return [x0 + d, y1];
  d -= w;
  if (d < h) return [x1, y1 - d];
  d -= h;
  if (d < w) return [x1 - d, y0];
  return [x0, y0 + (d - w)];
}

function fillOrbits(orb, rnd, n) {
  for (let i = 0; i < n; i++) {
    const r = Math.random();
    let tilt;
    let turn;
    let radius;
    let speed;
    let size = rand(0.75, 1.25);
    if (r < 0.7) {
      const ring = i % 4;
      tilt = 0.4 + rand(-0.015, 0.015);
      turn = (ring * Math.PI) / 4;
      radius = 1.3 * (1 + rand(-0.03, 0.03));
      speed = (ring % 2 ? -1 : 1) * rand(0.16, 0.24);
    } else if (r < 0.84) {
      tilt = rand(0, Math.PI);
      turn = rand(0, Math.PI);
      radius = rand(0.08, 0.32);
      speed = rand(0.6, 1.3);
    } else {
      tilt = rand(0, Math.PI);
      turn = rand(0, Math.PI);
      radius = rand(1.45, 1.75);
      speed = rand(0.03, 0.09);
      size = rand(0.45, 0.8);
    }
    orb.set([tilt, turn, rand(0, Math.PI * 2), radius], i * 4);
    rnd.set([Math.random(), Math.floor(Math.random() * GLYPHS.length), size, speed], i * 4);
  }
}

// La plantilla: 3 x 3 cajas iguales, cada una con el mismo relleno.
function fillTemplate(out, n) {
  const bw = 0.8;
  const bh = 0.5;
  const gap = 0.14;
  for (let i = 0; i < n; i++) {
    const box = i % 9;
    const cx = ((box % 3) - 1) * (bw + gap);
    const cy = (1 - Math.floor(box / 3)) * (bh + gap);
    const x0 = cx - bw / 2;
    const y0 = cy - bh / 2;
    const r = Math.random();
    let p;
    if (r < 0.55) p = rectPoint(x0, y0, x0 + bw, y0 + bh, Math.random());
    else if (r < 0.8) p = rectPoint(x0 + 0.07, y0 + 0.23, x0 + 0.35, y0 + 0.43, Math.random());
    else p = [x0 + 0.07 + Math.random() * 0.6, y0 + (Math.random() < 0.5 ? 0.08 : 0.15)];
    out.set([p[0], p[1], 0], i * 3);
  }
}

// El layout a medida: piezas desiguales, a distinta profundidad.
function fillBespoke(out, n) {
  const line = (x0, x1, y, z, thick) => () => [rand(x0, x1), y + rand(-thick, thick), z];
  const box = (x0, y0, x1, y1, z) => () => [...rectPoint(x0, y0, x1, y1, Math.random()), z];
  const parts = [
    [2.4, line(-1.35, 0.3, 0.8, 0.25, 0.05)],
    [1.8, line(-1.35, -0.15, 0.56, 0.25, 0.05)],
    [3.2, box(0.55, -0.3, 1.35, 0.92, -0.3)],
    [1.2, () => [rand(0.6, 1.3), rand(-0.25, 0.87), -0.3]],
    [
      1.7,
      () => {
        const a = rand(0, Math.PI * 2);
        return [0.5 + Math.cos(a) * 0.3, -0.3 + Math.sin(a) * 0.3, 0.5];
      },
    ],
    [1.1, line(-1.35, 0.15, 0.26, 0, 0.008)],
    [1.0, line(-1.35, 0.02, 0.13, 0, 0.008)],
    [1.05, line(-1.35, 0.1, 0.0, 0, 0.008)],
    [0.7, line(-1.35, -0.45, -0.13, 0, 0.008)],
    [1.2, box(-1.35, -0.52, -0.72, -0.34, 0.32)],
    [1.3, box(-1.35, -0.95, -0.55, -0.68, -0.12)],
    [2.2, box(-0.45, -0.95, 1.35, -0.68, -0.12)],
  ];
  const total = parts.reduce((s, p) => s + p[0], 0);
  const ry = -0.42;
  const rx = 0.1;
  for (let i = 0; i < n; i++) {
    let pick = Math.random() * total;
    let fn = parts[0][1];
    for (const [w, f] of parts) {
      if ((pick -= w) <= 0) {
        fn = f;
        break;
      }
    }
    let [x, y, z] = fn();
    const x1 = x * Math.cos(ry) + z * Math.sin(ry);
    z = -x * Math.sin(ry) + z * Math.cos(ry);
    x = x1;
    const y1 = y * Math.cos(rx) - z * Math.sin(rx);
    z = y * Math.sin(rx) + z * Math.cos(rx);
    out.set([x, y1, z], i * 3);
  }
}

// Los casos: marcos alrededor de cada plano y polvo entre ellos.
function fillCases(out, n, planes) {
  for (let i = 0; i < n; i++) {
    if (Math.random() < 0.74) {
      const pl = planes[i % planes.length];
      const m = rand(0.03, 0.14);
      const [x, y] = rectPoint(-pl.w / 2 - m, -pl.h / 2 - m, pl.w / 2 + m, pl.h / 2 + m, Math.random());
      out.set([pl.x + x, pl.y + y, pl.z + rand(-0.05, 0.05)], i * 3);
    } else {
      const pl = planes[0];
      out.set([pl.x + rand(-pl.w, pl.w), pl.y + rand(-pl.h * 1.6, pl.h * 1.6), rand(2, -GAP * (planes.length - 1) - 2)], i * 3);
    }
  }
}

// ---------------------------------------------------------------------------

export async function startJourney(root) {
  const { gsap, ScrollTrigger } = await initScroll();
  const stage = root.querySelector('.stage');
  const slot = (name) => root.querySelector(`[data-slot="${name}"]`);
  const slots = { a: slot('a'), b: slot('b'), c: slot('c'), d: slot('d'), e: slot('e') };
  const pinD = root.querySelector('.cases-pin');
  const mobile = window.matchMedia('(max-width: 899px)').matches;
  const N = mobile ? 850 : 1500;

  const renderer = new WebGLRenderer({ antialias: false, alpha: false, powerPreference: 'high-performance' });
  renderer.setClearColor(0x000000, 1);
  let dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 1.75);
  renderer.setPixelRatio(dpr);
  const canvas = renderer.domElement;
  stage.appendChild(canvas);

  const scene = new Scene();
  const camera = new PerspectiveCamera(FOV, 1, 0.1, 80);
  camera.position.z = CAM_Z;
  const tanHalf = Math.tan((FOV * Math.PI) / 360);

  // --- caracteres
  const quad = new PlaneGeometry(1, 1);
  const geo = new InstancedBufferGeometry();
  geo.index = quad.index;
  geo.setAttribute('position', quad.getAttribute('position'));
  geo.setAttribute('uv', quad.getAttribute('uv'));
  geo.instanceCount = N;
  const orb = new Float32Array(N * 4);
  const rnd = new Float32Array(N * 4);
  const posB = new Float32Array(N * 3);
  const posC = new Float32Array(N * 3);
  const posD = new Float32Array(N * 3);
  fillOrbits(orb, rnd, N);
  fillTemplate(posB, N);
  fillBespoke(posC, N);
  geo.setAttribute('aOrb', new InstancedBufferAttribute(orb, 4));
  geo.setAttribute('aRnd', new InstancedBufferAttribute(rnd, 4));
  geo.setAttribute('aB', new InstancedBufferAttribute(posB, 3));
  geo.setAttribute('aC', new InstancedBufferAttribute(posC, 3));
  const attrD = new InstancedBufferAttribute(posD, 3);
  geo.setAttribute('aD', attrD);

  const uniforms = {
    uT: { value: 0 },
    uTime: { value: 0 },
    uSize: { value: 0.09 },
    uFade: { value: 1 },
    uAtlas: { value: await makeAtlas() },
    uOffA: { value: new Vector4(0, 0, 0, 1) },
    uOffB: { value: new Vector4(0, 0, 0, 1) },
    uOffC: { value: new Vector4(0, 0, 0, 1) },
    uOffE: { value: new Vector4(0, 0, 0, 1) },
  };
  const material = new ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    uniforms,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    blending: AdditiveBlending,
    premultipliedAlpha: true,
  });
  const glyphs = new Mesh(geo, material);
  glyphs.frustumCulled = false;
  scene.add(glyphs);

  // --- planos de los casos (las texturas se piden al acercarse)
  const planeGeo = new PlaneGeometry(1, 1);
  const planes = homeCases.map((c, k) => {
    const mat = new MeshBasicMaterial({ color: 0x0d1416, transparent: true, opacity: 0, depthTest: false });
    const mesh = new Mesh(planeGeo, mat);
    mesh.renderOrder = 2;
    mesh.visible = false;
    scene.add(mesh);
    return { mesh, mat, data: c, x: 0, y: 0, z: -k * GAP, w: 3, h: 3 / PLANE_RATIO };
  });
  let texturesAsked = false;
  function askTextures() {
    texturesAsked = true;
    const loader = new TextureLoader();
    planes.forEach((pl) => {
      const apply = (tex) => {
        tex.colorSpace = SRGBColorSpace;
        pl.mat.map = tex;
        pl.mat.color.set(0xffffff);
        pl.mat.needsUpdate = true;
      };
      if (pl.data.img) loader.load(`/assets/${pl.data.img}-${mobile ? 480 : 960}.webp`, apply, undefined, () => {});
      else apply(plateTexture(pl.data.title));
    });
  }

  // --- medidas
  let W = 1;
  let H = 1;
  const visH = (d) => 2 * d * tanHalf;
  function layout() {
    W = stage.clientWidth;
    H = stage.clientHeight;
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    camera.updateProjectionMatrix();

    // Casos: el hueco fijo de la escena 4 define donde y de que tamano.
    const pin = mobile ? { left: 0, top: 0 } : pinD.getBoundingClientRect();
    const r = mobile ? band() : slots.d.getBoundingClientRect();
    const vh = visH(FOCUS);
    const vw = vh * camera.aspect;
    const cx = ((r.left - pin.left + r.width / 2) / W - 0.5) * vw;
    const cy = (0.5 - (r.top - pin.top + r.height / 2) / H) * vh;
    const w = Math.min((r.width / W) * vw, (r.height / H) * vh * PLANE_RATIO) * 0.94;
    planes.forEach((pl, k) => {
      pl.x = cx;
      pl.y = cy;
      pl.w = w;
      pl.h = w / PLANE_RATIO;
      pl.mesh.position.set(cx, cy, pl.z);
      pl.mesh.scale.set(pl.w, pl.h, 1);
      pl.mesh.rotation.y = (k % 2 ? 1 : -1) * (mobile ? 0.06 : 0.16);
    });
    fillCases(posD, N, planes);
    attrD.needsUpdate = true;
  }

  // Centro y escala de un hueco del DOM, llevados al plano z = 0.
  const vhBase = visH(CAM_Z);
  // En celular el lienzo es una franja fija arriba y el objeto vive siempre
  // en ella (bajo el encabezado); en escritorio sigue el hueco de cada escena.
  const band = () => ({ left: W * 0.06, top: 6, width: W * 0.88, height: H - 14 });
  function place(el, target, natW, natH) {
    if (mobile) {
      const b = band();
      const vw = vhBase * camera.aspect;
      target.x = 0;
      target.y = (0.5 - (b.top + b.height / 2) / H) * vhBase;
      target.z = 0;
      target.w = Math.min(((b.width / W) * vw) / natW, ((b.height / H) * vhBase) / natH);
      return el !== slots.e;
    }
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) {
      target.w = 0.0001;
      return false;
    }
    const top = stage.getBoundingClientRect().top;
    const vw = vhBase * camera.aspect;
    target.x = ((r.left + r.width / 2) / W - 0.5) * vw;
    target.y = (0.5 - (r.top - top + r.height / 2) / H) * vhBase;
    target.z = 0;
    target.w = Math.min(((r.width / W) * vw) / natW, ((r.height / H) * vhBase) / natH);
    return true;
  }

  // --- scroll
  const state = { p2: 0, p3: 0, p4: 0, p5: 0, c: 0 };
  const track = (key, trigger, start, end) =>
    ScrollTrigger.create({ trigger, start, end, onUpdate: (self) => (state[key] = self.progress), onRefresh: (self) => (state[key] = self.progress) });
  const triggers = [
    track('p2', root.querySelector('.scene-2'), 'top 85%', 'top 5%'),
    track('p3', root.querySelector('.scene-3'), 'top 85%', 'top 5%'),
    track('p4', root.querySelector('.scene-4'), 'top 80%', 'top 15%'),
    track('c', root.querySelector('.cases'), 'top top', 'bottom bottom'),
    track('p5', root.querySelector('.scene-5'), 'top 90%', 'top 35%'),
  ];

  // --- puntero (solo con mouse): la camara se mueve apenas
  const pointer = { x: 0, y: 0, cx: 0, cy: 0 };
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const onMove = (e) => {
    pointer.x = (e.clientX / window.innerWidth - 0.5) * 0.3;
    pointer.y = (0.5 - e.clientY / window.innerHeight) * 0.2;
  };
  if (fine) window.addEventListener('pointermove', onMove, { passive: true });

  // --- ciclo
  let running = false;
  let shown = false;
  let frames = 0;
  let slow = 0;
  const hasE = () => slots.e.offsetWidth > 0;

  function tick(time, deltaMs) {
    const T = state.p2 + state.p3 + state.p4 + state.p5;
    uniforms.uT.value = T;
    uniforms.uTime.value = time;

    place(slots.a, uniforms.uOffA.value, 3.5, 3.5);
    place(slots.b, uniforms.uOffB.value, 2.9, 2.0);
    place(slots.c, uniforms.uOffC.value, 2.9, 2.1);
    const eOk = place(slots.e, uniforms.uOffE.value, 3.5, 3.5) && hasE() && place(slots.e, uniforms.uOffE.value, 3.5, 3.5);
    uniforms.uFade.value = eOk ? 1 : 1 - ease((T - 3.1) / 0.7);

    const sA = uniforms.uOffA.value.w;
    const sB = uniforms.uOffB.value.w;
    const sC = uniforms.uOffC.value.w;
    const sD = planes[0].w / 3;
    const sE = eOk ? uniforms.uOffE.value.w : sD;
    const scale = [sA, sB, sC, sD, sE];
    const i = Math.min(3, Math.floor(T));
    uniforms.uSize.value = 0.115 * (scale[i] + (scale[i + 1] - scale[i]) * ease(T - i));

    // Camara: quieta hasta los casos; ahi avanza en profundidad.
    const inD = ease(T - 2) * (1 - ease(T - 3));
    const travel = FOCUS - state.c * GAP * (planes.length - 1);
    pointer.cx += (pointer.x - pointer.cx) * 0.06;
    pointer.cy += (pointer.y - pointer.cy) * 0.06;
    camera.position.set(pointer.cx, pointer.cy, CAM_Z + (travel - CAM_Z) * inD);

    if (T > 1.2 && !texturesAsked) askTextures();
    const fadeD = smooth(2.35, 2.95, T) * (1 - smooth(3.0, 3.5, T));
    planes.forEach((pl) => {
      const dist = camera.position.z - pl.z;
      const a = fadeD * smooth(1.0, 3.2, dist) * (1 - smooth(8, 15, dist) * 0.8);
      pl.mat.opacity = a;
      pl.mesh.visible = a > 0.01;
    });

    renderer.render(scene, camera);

    if (!shown) {
      shown = true;
      document.documentElement.classList.add('gl-on');
    }
    // Si el equipo no sostiene el ritmo, baja la resolucion una vez.
    if (frames < 120) {
      frames += 1;
      if (deltaMs > 26) slow += 1;
      if (frames === 120 && slow > 50 && dpr > 1) {
        dpr = 1;
        renderer.setPixelRatio(1);
        renderer.setSize(W, H, false);
      }
    }
  }

  function setRunning(on) {
    if (on === running) return;
    running = on;
    if (on) gsap.ticker.add(tick);
    else gsap.ticker.remove(tick);
  }
  let inView = true;
  const sync = () => setRunning(inView && !document.hidden);
  const io = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    sync();
  });
  io.observe(root);
  document.addEventListener('visibilitychange', sync);

  let lastW = window.innerWidth;
  const onResize = () => {
    // En celular la barra del navegador cambia el alto al hacer scroll:
    // solo se recalcula si cambio el ancho.
    if (mobile && window.innerWidth === lastW) return;
    lastW = window.innerWidth;
    layout();
  };
  window.addEventListener('resize', onResize);

  function dispose() {
    setRunning(false);
    io.disconnect();
    document.removeEventListener('visibilitychange', sync);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('pointermove', onMove);
    triggers.forEach((t) => t.kill());
    planes.forEach((pl) => {
      pl.mat.map?.dispose();
      pl.mat.dispose();
    });
    uniforms.uAtlas.value.dispose();
    geo.dispose();
    quad.dispose();
    planeGeo.dispose();
    material.dispose();
    renderer.dispose();
    canvas.remove();
    document.documentElement.classList.remove('gl-on');
  }

  // Si el navegador pierde el contexto grafico, vuelve la version estatica.
  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    dispose();
    document.documentElement.classList.remove('gl');
    ScrollTrigger.refresh();
  });

  layout();
  ScrollTrigger.refresh();
  sync();
  return dispose;
}
