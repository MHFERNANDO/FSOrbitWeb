// El modelo de la home, en 3D y en tiempo real (three.js).
//
// Es el logo de FS Orbit hecho de caracteres de codigo. Nunca esta quieto:
// cada forma tiene su propio movimiento y el scroll solo decide hacia que
// forma va:
//
//   0  logo     las orbitas giran y el codigo corre por ellas; "FS" late
//   1  plantilla 9 cajas grises iguales; una onda de luz las recorre
//   2  a medida  bloques desiguales que flotan a distinta profundidad
//   3  monitor   el codigo corre por el marco; la pantalla muestra el caso
//   4  logo     otra vez, hasta el final de la pagina
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
  Float32BufferAttribute,
  Group,
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  LinearFilter,
  LineBasicMaterial,
  LineLoop,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
  TextureLoader,
  WebGLRenderer,
} from 'three';
import { initScroll } from '@/lib/scroll';
import { homeCases } from '@/data/content';

const FOV = 30;
const TAN = Math.tan((FOV * Math.PI) / 360);
const HALF = 2.05; // medio alto visible en un hueco cuadrado
const GLYPHS = '{}<>/;=()[]:.+*&|!?#$_%@~abcdefghijklmnopqrstuvwxyz0123456';
const X = GLYPHS.indexOf('x');

const CYAN = [0.0, 0.92, 0.97];
const SOFT = [0.45, 0.97, 1.0];
const DEEP = [0.03, 0.42, 0.45];
const BONE = [0.86, 0.94, 0.94];

const smooth = (x) => {
  const t = Math.min(1, Math.max(0, x));
  return t * t * (3 - 2 * t);
};
const lerp = (a, b, t) => a + (b - a) * t;

// ------------------------------------------------------------- shaders
const VERT = /* glsl */ `
  attribute vec4 aA;    // logo: orbita (0-3) o circulo (4), angulo, radio
  attribute vec3 aB;    // plantilla
  attribute vec4 aC;    // a medida (xyz) + fase
  attribute vec4 aD;    // monitor: tipo, u, profundidad
  attribute vec4 aRnd;  // semilla, glifo, tamano, brillo
  attribute vec3 aColA;
  attribute vec3 aColC;
  uniform float uTime, uFrom, uTo, uT, uAmp, uSize, uFade, uIntro;
  uniform mat4 uLogo, uRotC, uMon;
  varying vec2 vUv;
  varying float vGlyph;
  varying vec3 vCol;
  varying float vAlpha;

  const float R = 1.3;
  const float AL = 0.42;
  const float SW = 2.9;
  const float SH = 1.4078;
  const float SY = 0.22;
  const float M = 0.11;

  vec2 rectPoint(vec2 lo, vec2 hi, float u) {
    vec2 s = hi - lo;
    float d = u * 2.0 * (s.x + s.y);
    if (d < s.x) return vec2(lo.x + d, hi.y);
    d -= s.x;
    if (d < s.y) return vec2(hi.x, hi.y - d);
    d -= s.y;
    if (d < s.x) return vec2(hi.x - d, lo.y);
    return vec2(lo.x, lo.y + (d - s.x));
  }

  vec3 poseA() {
    vec3 p;
    if (aA.x < 3.5) {
      float dir = mod(aA.x, 2.0) < 0.5 ? 1.0 : -1.0;
      float ang = aA.y + uTime * 0.28 * dir;
      p = vec3(R * cos(ang), -R * sin(ang) * sin(AL), R * sin(ang) * cos(AL));
      float k = aA.x * 0.7853982;
      p = vec3(p.x * cos(k) - p.y * sin(k), p.x * sin(k) + p.y * cos(k), p.z);
    } else {
      float ang = aA.y - uTime * 0.16;
      p = vec3(aA.z * cos(ang), aA.z * sin(ang), 0.0);
    }
    return (uLogo * vec4(p, 1.0)).xyz;
  }
  vec3 poseB() {
    return aB + vec3(0.0, 0.0, 0.06 * sin(uTime * 1.3 + aB.x * 2.2 + aB.y * 1.7));
  }
  vec3 poseC() {
    vec3 p = aC.xyz;
    p.y += 0.035 * sin(uTime * 0.9 + aC.w * 6.283);
    p.z += 0.09 * sin(uTime * 0.7 + aC.w * 6.283);
    return (uRotC * vec4(p, 1.0)).xyz;
  }
  vec3 poseD() {
    vec2 lo = vec2(-SW * 0.5 - M, SY - SH * 0.5 - M);
    vec2 hi = vec2(SW * 0.5 + M, SY + SH * 0.5 + M);
    vec3 p;
    if (aD.x < 0.5) {
      p = vec3(rectPoint(lo, hi, fract(aD.y + uTime * 0.02)), aD.z);
    } else if (aD.x < 1.5) {
      p = vec3(aD.y < 0.5 ? -0.07 : 0.07, lo.y - 0.05 - 0.4 * fract(aD.y * 2.0), 0.0);
    } else {
      p = vec3(-0.7 + 1.4 * aD.y, lo.y - 0.5, 0.0);
    }
    return (uMon * vec4(p, 1.0)).xyz;
  }
  vec3 pose(float i) {
    if (i < 0.5) return poseA();
    if (i < 1.5) return poseB();
    if (i < 2.5) return poseC();
    return poseD();
  }
  vec3 colorOf(float i) {
    if (i < 0.5) return aColA;
    if (i < 1.5) return vec3(0.3, 0.34, 0.35);
    if (i < 2.5) return aColC;
    return aRnd.x > 0.7 ? vec3(0.45, 0.97, 1.0) : vec3(0.0, 0.92, 0.97);
  }

  void main() {
    float seed = aRnd.x;
    float lt = smoothstep(0.0, 1.0, clamp((uT - seed * 0.3) / 0.7, 0.0, 1.0));
    vec3 n = vec3(sin(seed * 91.7 + uTime * 0.7), cos(seed * 57.3 + uTime * 0.6), sin(seed * 33.1 + uTime * 0.5));
    vec3 p = mix(pose(uFrom), pose(uTo), lt) + n * (sin(lt * 3.14159) * uAmp + 0.01);

    // Intro: el codigo llega desde afuera, en espiral.
    float il = smoothstep(0.0, 1.0, clamp((uIntro - seed * 0.45) / 0.55, 0.0, 1.0));
    vec3 far = normalize(n + vec3(0.001)) * (3.2 + seed * 2.0);
    float sw = (1.0 - il) * 2.2;
    far.xz = mat2(cos(sw), -sin(sw), sin(sw), cos(sw)) * far.xz;
    p = mix(far, p, il);

    vec3 col = mix(colorOf(uFrom), colorOf(uTo), lt) * aRnd.w;
    float wB = (abs(uFrom - 1.0) < 0.5 ? 1.0 - lt : 0.0) + (abs(uTo - 1.0) < 0.5 ? lt : 0.0);
    float wave = pow(0.5 + 0.5 * sin(uTime * 2.2 - p.x * 2.6 + p.y * 1.4), 4.0);
    col *= mix(1.0, 0.55 + 1.3 * wave, wB);
    vCol = col;

    bool same = (abs(uFrom - 1.0) < 0.5 && lt < 0.5) || (abs(uTo - 1.0) < 0.5 && lt >= 0.5);
    vGlyph = same ? ${X}.0 : aRnd.y;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    mv.xy += position.xy * uSize * aRnd.z;
    gl_Position = projectionMatrix * mv;
    float twinkle = 0.75 + 0.25 * sin(uTime * (0.8 + seed) + seed * 40.0);
    vAlpha = twinkle * uFade * (0.35 + 0.65 * il);
    vUv = uv;
  }
`;

const FRAG = /* glsl */ `
  precision mediump float;
  uniform sampler2D uAtlas;
  varying vec2 vUv;
  varying float vGlyph;
  varying vec3 vCol;
  varying float vAlpha;
  void main() {
    float col = mod(vGlyph, 8.0);
    float row = floor(vGlyph / 8.0);
    vec2 uv = (vec2(col, 7.0 - row) + vUv) / 8.0;
    float a = texture2D(uAtlas, uv).a * vAlpha;
    if (a < 0.004) discard;
    gl_FragColor = vec4(vCol * a * 1.45, a);
  }
`;

const DUST_VERT = /* glsl */ `
  attribute vec4 aP;   // posicion + semilla
  attribute float aG;
  uniform float uTime, uSize, uFade, uIntro;
  varying vec2 vUv;
  varying float vGlyph;
  varying vec3 vCol;
  varying float vAlpha;
  void main() {
    float a = uTime * 0.05;
    vec3 p = aP.xyz;
    p.xz = mat2(cos(a), -sin(a), sin(a), cos(a)) * p.xz;
    p.y += 0.08 * sin(uTime * 0.4 + aP.w * 6.283);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    mv.xy += position.xy * uSize;
    gl_Position = projectionMatrix * mv;
    vGlyph = aG;
    vCol = vec3(0.03, 0.42, 0.45) * (0.5 + 0.5 * aP.w);
    float depth = smoothstep(-2.6, 1.2, p.z);
    vAlpha = uFade * uIntro * (0.25 + 0.55 * depth);
    vUv = uv;
  }
`;

// Atlas de glifos con su propio brillo (asi no hace falta bloom).
function makeAtlas() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  ctx.font = '800 72px "JetBrains Mono", ui-monospace, Menlo, Consolas, monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#fff';
  [...GLYPHS].forEach((ch, i) => {
    const x = (i % 8) * 128 + 64;
    const y = Math.floor(i / 8) * 128 + 66;
    ctx.shadowColor = 'rgba(255,255,255,0.9)';
    ctx.shadowBlur = 26;
    ctx.globalAlpha = 0.55;
    ctx.fillText(ch, x, y);
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    ctx.fillText(ch, x, y);
  });
  const tex = new CanvasTexture(canvas);
  tex.minFilter = LinearFilter;
  tex.generateMipmaps = false;
  return tex;
}

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

// ---------------------------------------------------------- poses (CPU)
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

function buildGlyphs(N, rand) {
  const aA = new Float32Array(N * 4);
  const aB = new Float32Array(N * 3);
  const aC = new Float32Array(N * 4);
  const aD = new Float32Array(N * 4);
  const aRnd = new Float32Array(N * 4);
  const aColA = new Float32Array(N * 3);
  const aColC = new Float32Array(N * 3);

  // A: 4 orbitas + 2 circulos alrededor de "FS"
  const perRing = Math.floor((N * 0.72) / 4);
  for (let i = 0; i < N; i++) {
    if (i < perRing * 4) {
      const k = Math.floor(i / perRing);
      const j = i % perRing;
      aA.set([k, (2 * Math.PI * j) / perRing, 0, 0], i * 4);
      aColA.set(k % 2 ? SOFT : CYAN, i * 3);
    } else {
      const j = i - perRing * 4;
      const rest = N - perRing * 4;
      aA.set([4, (2 * Math.PI * j) / rest, j % 2 ? 0.74 : 0.62, 0], i * 4);
      aColA.set(j % 2 ? DEEP : CYAN, i * 3);
    }
  }

  // B: la plantilla, 3x3 cajas iguales
  const BW = 0.92;
  const BH = 0.6;
  const GAP = 0.14;
  const per = Math.ceil(N / 9);
  for (let i = 0; i < N; i++) {
    const box = i % 9;
    const q = Math.floor(i / 9) / per;
    const cx = ((box % 3) - 1) * (BW + GAP);
    const cy = (1 - Math.floor(box / 3)) * (BH + GAP);
    const x0 = cx - BW / 2;
    const y0 = cy - BH / 2;
    let p;
    if (q < 0.62) p = rectPoint(x0, y0, x0 + BW, y0 + BH, q / 0.62);
    else if (q < 0.86) p = rectPoint(x0 + 0.1, y0 + 0.28, x0 + 0.42, y0 + 0.5, (q - 0.62) / 0.24);
    else p = [x0 + 0.1 + 0.72 * ((q - 0.86) / 0.14), y0 + 0.12];
    aB.set([p[0], p[1], 0], i * 3);
  }

  // C: el layout a medida, piezas desiguales a distinta profundidad
  const line = (x0, x1, y, z) => (u) => [x0 + (x1 - x0) * u, y, z];
  const box = (x0, y0, x1, y1, z) => (u) => [...rectPoint(x0, y0, x1, y1, u), z];
  const circle = (cx, cy, r, z) => (u) => [cx + r * Math.cos(2 * Math.PI * u), cy + r * Math.sin(2 * Math.PI * u), z];
  const parts = [
    [26, line(-1.45, 0.25, 0.95, 0.35), BONE],
    [19, line(-1.45, -0.25, 0.75, 0.35), BONE],
    [34, box(0.55, -0.25, 1.45, 1.05, -0.25), DEEP],
    [14, box(0.68, 0.45, 1.32, 0.92, -0.1), SOFT],
    [22, circle(0.55, -0.35, 0.32, 0.5), CYAN],
    [14, line(-1.45, 0.05, 0.45, 0), CYAN],
    [13, line(-1.45, -0.1, 0.31, 0), CYAN],
    [11, line(-1.45, -0.35, 0.17, 0), CYAN],
    [16, box(-1.45, -0.3, -0.75, -0.08, 0.45), CYAN],
    [18, box(-1.45, -1.0, -0.6, -0.65, -0.1), DEEP],
    [32, box(-0.45, -1.0, 1.45, -0.65, -0.1), DEEP],
  ];
  const total = parts.reduce((s, p) => s + p[0], 0);
  const counts = parts.map((p) => Math.round((p[0] * N) / total));
  counts[0] += N - counts.reduce((s, c) => s + c, 0);
  const cList = [];
  parts.forEach(([, fn, col], pi) => {
    for (let j = 0; j < counts[pi]; j++) cList.push([fn((j + 0.5) / counts[pi]), col, pi / parts.length]);
  });
  for (let i = cList.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [cList[i], cList[j]] = [cList[j], cList[i]];
  }
  cList.forEach(([p, col, phase], i) => {
    aC.set([p[0], p[1], p[2], phase], i * 4);
    aColC.set(col, i * 3);
  });

  // D: el monitor
  const nFrame = Math.floor(N * 0.78);
  const nStand = Math.floor(N * 0.1);
  for (let i = 0; i < N; i++) {
    if (i < nFrame) aD.set([0, i / nFrame, i % 2 ? 0.03 : -0.03, 0], i * 4);
    else if (i < nFrame + nStand) aD.set([1, (i - nFrame) / nStand, 0, 0], i * 4);
    else aD.set([2, (i - nFrame - nStand) / (N - nFrame - nStand), 0, 0], i * 4);
  }

  for (let i = 0; i < N; i++) {
    aRnd.set([rand(), Math.floor(rand() * GLYPHS.length), 0.8 + rand() * 0.45, 0.75 + rand() * 0.45], i * 4);
  }
  return { aA, aB, aC, aD, aRnd, aColA, aColC };
}

function ellipse(radius, segments = 220) {
  const pts = [];
  for (let i = 0; i < segments; i++) {
    const a = (2 * Math.PI * i) / segments;
    pts.push(radius * Math.cos(a), 0, radius * Math.sin(a));
  }
  const g = new BufferGeometry();
  g.setAttribute('position', new Float32BufferAttribute(pts, 3));
  return g;
}

// ---------------------------------------------------------------------------

export async function startOrbit(root) {
  const { gsap } = await initScroll();
  const mobile = window.matchMedia('(max-width: 899px)').matches;
  const N = mobile ? 900 : 1500;
  const DUST = mobile ? 160 : 280;
  let seedState = 7;
  const rand = () => {
    seedState = (seedState * 16807) % 2147483647;
    return (seedState - 1) / 2147483646;
  };

  // ---------------------------------------------------------- lienzo
  const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.75 : 2));
    renderer.setSize(W, H, false);
  }
  resize();

  const scene = new Scene();
  const camera = new PerspectiveCamera(FOV, 1, 0.1, 60);

  // ---------------------------------------------------------- codigo
  const atlas = makeAtlas();
  const data = buildGlyphs(N, rand);
  const quad = new PlaneGeometry(1, 1);
  const geo = new InstancedBufferGeometry();
  geo.index = quad.index;
  geo.setAttribute('position', quad.getAttribute('position'));
  geo.setAttribute('uv', quad.getAttribute('uv'));
  geo.instanceCount = N;
  geo.setAttribute('aA', new InstancedBufferAttribute(data.aA, 4));
  geo.setAttribute('aB', new InstancedBufferAttribute(data.aB, 3));
  geo.setAttribute('aC', new InstancedBufferAttribute(data.aC, 4));
  geo.setAttribute('aD', new InstancedBufferAttribute(data.aD, 4));
  geo.setAttribute('aRnd', new InstancedBufferAttribute(data.aRnd, 4));
  geo.setAttribute('aColA', new InstancedBufferAttribute(data.aColA, 3));
  geo.setAttribute('aColC', new InstancedBufferAttribute(data.aColC, 3));

  const logoGroup = new Group();
  const monGroup = new Group();
  const rotC = new Group();
  scene.add(logoGroup, monGroup, rotC);

  const uniforms = {
    uTime: { value: 0 },
    uFrom: { value: 0 },
    uTo: { value: 1 },
    uT: { value: 0 },
    uAmp: { value: 0.3 },
    uSize: { value: mobile ? 0.21 : 0.19 },
    uFade: { value: 1 },
    uIntro: { value: 0 },
    uAtlas: { value: atlas },
    uLogo: { value: logoGroup.matrix },
    uRotC: { value: rotC.matrix },
    uMon: { value: monGroup.matrix },
  };
  const glyphMat = new ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    uniforms,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    blending: AdditiveBlending,
  });
  const glyphs = new Mesh(geo, glyphMat);
  glyphs.frustumCulled = false;
  scene.add(glyphs);

  // Nube de codigo tenue alrededor, siempre a la deriva.
  const dustGeo = new InstancedBufferGeometry();
  dustGeo.index = quad.index;
  dustGeo.setAttribute('position', quad.getAttribute('position'));
  dustGeo.setAttribute('uv', quad.getAttribute('uv'));
  dustGeo.instanceCount = DUST;
  const dP = new Float32Array(DUST * 4);
  const dG = new Float32Array(DUST);
  for (let i = 0; i < DUST; i++) {
    const th = rand() * Math.PI * 2;
    const r = 1.75 + rand() * 0.7;
    dP.set([r * Math.cos(th), (rand() - 0.5) * 2.6, r * Math.sin(th) - 0.3, rand()], i * 4);
    dG[i] = Math.floor(rand() * GLYPHS.length);
  }
  dustGeo.setAttribute('aP', new InstancedBufferAttribute(dP, 4));
  dustGeo.setAttribute('aG', new InstancedBufferAttribute(dG, 1));
  const dustUniforms = { uTime: uniforms.uTime, uSize: { value: 0.13 }, uFade: uniforms.uFade, uIntro: { value: 0 }, uAtlas: uniforms.uAtlas };
  const dust = new Mesh(
    dustGeo,
    new ShaderMaterial({ vertexShader: DUST_VERT, fragmentShader: FRAG, uniforms: dustUniforms, transparent: true, depthTest: false, depthWrite: false, blending: AdditiveBlending }),
  );
  dust.frustumCulled = false;
  scene.add(dust);

  // Lineas del logo: 4 orbitas, circulo exterior y central.
  const lineMats = [];
  const addLine = (radius, rotation, order, opacity, color) => {
    const m = new LineBasicMaterial({ color, transparent: true, opacity, blending: AdditiveBlending, depthTest: false });
    m.userData.base = opacity;
    lineMats.push(m);
    const l = new LineLoop(ellipse(radius), m);
    l.rotation.order = order;
    l.rotation.set(...rotation);
    logoGroup.add(l);
  };
  for (let k = 0; k < 4; k++) addLine(1.3, [0.42, 0, (k * Math.PI) / 4], 'ZYX', 0.35, 0x0b8f96);
  addLine(1.62, [Math.PI / 2, 0, 0], 'XYZ', 0.6, 0x00f3fb);
  addLine(0.5, [Math.PI / 2, 0, 0], 'XYZ', 0.5, 0x00f3fb);

  // "FS" en el centro.
  const fsMat = new MeshBasicMaterial({ map: makeFsTexture(), transparent: true, blending: AdditiveBlending, depthTest: false });
  const fs = new Mesh(new PlaneGeometry(0.78, 0.39), fsMat);
  scene.add(fs);

  // Pantalla del monitor: dos capas para fundir de un caso al otro.
  const loader = new TextureLoader();
  const shots = homeCases.map((c) => {
    const t = loader.load(`/assets/${c.img}-${mobile ? 480 : 960}.webp`);
    t.colorSpace = SRGBColorSpace;
    return t;
  });
  const screenGeo = new PlaneGeometry(2.9, 2.9 / 2.06);
  const makeScreen = () => {
    const m = new MeshBasicMaterial({ transparent: true, opacity: 0, depthTest: false });
    const mesh = new Mesh(screenGeo, m);
    mesh.position.set(0, 0.22, -0.02);
    monGroup.add(mesh);
    return m;
  };
  const backing = new MeshBasicMaterial({ color: 0x030809, transparent: true, opacity: 0, depthTest: false });
  const back = new Mesh(screenGeo, backing);
  back.position.set(0, 0.22, -0.03);
  monGroup.add(back);
  const screenA = makeScreen();
  const screenB = makeScreen();
  screenA.map = shots[0];
  screenB.map = shots[0];

  // ---------------------------------------------------------- medidas
  const q = (sel) => root.querySelector(sel);
  const page = root.closest('main') || document;
  const slots = [...page.querySelectorAll('[data-slot]')];
  const steps = [...root.querySelectorAll('.case-step')];
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
    const cases = q('.cases');
    const s5 = q('.scene-5');
    marks = mobile
      ? {
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
      const wide = parseFloat(el.dataset.crop || '0') > 0;
      let w = r.width;
      let h = r.height;
      if (!wide) w = h = Math.min(r.width, r.height);
      out.push({ el, wide, x: r.left + (r.width - w) / 2, y: r.top + (r.height - h) / 2, w, h, cy: r.top + r.height / 2 });
    }
    return out;
  }

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
    if (mobile || Math.abs(b.x - a.x) > W * 0.25 || a.wide || b.wide) {
      const k = smooth((t - 0.32) / 0.36);
      const grow = (r, s) => ({ ...r, x: r.x + (r.w * (1 - s)) / 2, y: r.y + (r.h * (1 - s)) / 2, w: r.w * s, h: r.h * s });
      return [
        { ...grow(a, 1 - 0.1 * k), alpha: 1 - k },
        { ...grow(b, 0.9 + 0.1 * k), alpha: k },
      ].filter((p) => p.alpha > 0.01);
    }
    const k = smooth((t - 0.2) / 0.6);
    const near = k < 0.5 ? a : b;
    return [{ el: near.el, wide: false, x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), w: lerp(a.w, b.w, k), h: lerp(a.h, b.h, k), alpha: 1 }];
  }

  // Caso activo en escritorio: el paso cuyo centro esta mas cerca del
  // centro de la pantalla.
  function activeCase() {
    let best = 0;
    let dist = Infinity;
    steps.forEach((el, i) => {
      const r = el.getBoundingClientRect();
      const d = Math.abs(r.top + r.height / 2 - H / 2);
      if (d < dist) {
        dist = d;
        best = i;
      }
    });
    return best;
  }

  // ---------------------------------------------------------- estado vivo
  const pointer = { x: 0, y: 0, cx: 0, cy: 0 };
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const onMove = (e) => {
    pointer.x = (e.clientX / W - 0.5) * 2;
    pointer.y = (e.clientY / H - 0.5) * 2;
  };
  if (fine) window.addEventListener('pointermove', onMove, { passive: true });

  let P = 0;
  let last = 0;
  let introStart = null;
  let shownCase = 0;
  let fadeCase = 1;
  let shown = false;
  const AMPS = [0.3, 0.7, 0.4, 0.35];

  function setShape(p, time) {
    const i = Math.min(3, Math.floor(p));
    const t = p - i;
    uniforms.uFrom.value = i;
    uniforms.uTo.value = i + 1 > 3 ? 0 : i + 1;
    uniforms.uT.value = t;
    uniforms.uAmp.value = AMPS[i];
    const wA = Math.max(0, 1 - p * 1.6) + Math.max(0, 1 - (4 - p) * 1.6);
    const wD = Math.max(0, 1 - Math.abs(p - 3) * 2.2);
    for (const m of lineMats) m.opacity = m.userData.base * wA * uniforms.uFade.value * (0.85 + 0.15 * Math.sin(time * 2));
    const pulse = 1 + 0.12 * Math.sin(time * 2.4);
    fs.scale.setScalar(Math.max(0.0001, wA) * pulse);
    fsMat.opacity = wA * uniforms.uFade.value * uniforms.uIntro.value;
    backing.opacity = wD * 0.9 * uniforms.uFade.value;
    return wD;
  }

  function frame(time, deltaMs) {
    const dt = Math.min(0.1, deltaMs / 1000 || 0.016);
    last = time;
    uniforms.uTime.value = time;

    // Intro: el codigo se arma como el logo al aparecer.
    if (introStart === null) introStart = time;
    const intro = smooth((time - introStart) / 1.8);
    uniforms.uIntro.value = intro;
    dustUniforms.uIntro.value = intro;

    // La forma sigue al scroll con inercia: nunca salta.
    const target = targetP(window.scrollY);
    P += (target - P) * (1 - Math.exp(-dt * 5));

    // Movimientos propios de cada forma.
    logoGroup.rotation.set(0.22 + 0.06 * Math.sin(time * 0.37), 0.12 * Math.sin(time * 0.23), time * 0.1);
    logoGroup.updateMatrix();
    rotC.rotation.set(0.08 + 0.05 * Math.sin(time * 0.31), -0.42 + 0.12 * Math.sin(time * 0.27), 0);
    rotC.updateMatrix();
    monGroup.rotation.set(0.04 * Math.sin(time * 0.33), 0.16 * Math.sin(time * 0.29), 0);
    monGroup.updateMatrix();
    monGroup.updateMatrixWorld();

    pointer.cx += (pointer.x - pointer.cx) * 0.05;
    pointer.cy += (pointer.y - pointer.cy) * 0.05;

    // Caso en pantalla (escritorio): fundido de 0.4 s al cambiar.
    if (!mobile) {
      const want = activeCase();
      if (want !== shownCase && fadeCase >= 1) {
        screenB.map = shots[shownCase];
        screenB.needsUpdate = true;
        shownCase = want;
        screenA.map = shots[shownCase];
        screenA.needsUpdate = true;
        fadeCase = 0;
      }
      fadeCase = Math.min(1, fadeCase + dt / 0.4);
    }

    const places = placements();
    renderer.setScissorTest(false);
    renderer.clear();
    renderer.setScissorTest(true);
    for (const p of places) {
      uniforms.uFade.value = p.alpha;
      const isCase = p.el?.dataset.slot === 'case';
      const shape = isCase ? 3 : P;
      const wD = setShape(shape, time);
      if (isCase) {
        screenA.map = shots[Number(p.el.dataset.case)];
        screenA.needsUpdate = true;
        screenA.opacity = p.alpha;
        screenB.opacity = 0;
      } else {
        if (mobile && screenA.map !== shots[shownCase]) screenA.map = shots[shownCase];
        screenA.opacity = wD * p.alpha * (mobile ? 1 : fadeCase);
        screenB.opacity = mobile ? 0 : wD * p.alpha * (1 - fadeCase);
      }

      const aspect = p.w / p.h;
      const halfH = p.wide ? 1.75 / aspect : aspect >= 1 ? HALF : HALF / aspect;
      const dist = halfH / TAN;
      const calmD = 1 - 0.75 * wD;
      const yaw = (0.2 * Math.sin(time * 0.21) + pointer.cx * 0.18) * calmD;
      const pitch = (0.07 * Math.sin(time * 0.17) - pointer.cy * 0.1) * calmD;
      camera.aspect = aspect;
      camera.position.set(dist * Math.sin(yaw) * Math.cos(pitch), dist * Math.sin(pitch) + (p.wide ? 0.05 : 0), dist * Math.cos(yaw) * Math.cos(pitch));
      camera.lookAt(0, p.wide ? 0.05 : 0, 0);
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

  const tick = (time, deltaMs) => frame(time, deltaMs);
  gsap.ticker.add(tick);

  let lastW = window.innerWidth;
  const onResize = () => {
    resize();
    if (!mobile || window.innerWidth !== lastW) measure();
    lastW = window.innerWidth;
  };
  window.addEventListener('resize', onResize);
  const remeasure = setInterval(measure, 1500);
  const onVisibility = () => (document.hidden ? gsap.ticker.remove(tick) : gsap.ticker.add(tick));
  document.addEventListener('visibilitychange', onVisibility);

  function dispose() {
    gsap.ticker.remove(tick);
    clearInterval(remeasure);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('pointermove', onMove);
    document.removeEventListener('visibilitychange', onVisibility);
    scene.traverse((o) => {
      o.geometry?.dispose?.();
      o.material?.map?.dispose?.();
      o.material?.dispose?.();
    });
    atlas.dispose();
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

  void last;
  return dispose;
}
