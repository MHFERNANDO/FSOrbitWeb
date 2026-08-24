/* ==========================================================================
   FS ORBIT · hero.js
   Sistema orbital del hero. Sustituye al blob desenfocado: un blur(120px)
   sobre 70vw obliga al compositor a repintar media pantalla en cada frame,
   y además es el fondo más clonado que existe.

   El canvas se pausa cuando sale de viewport o la pestaña se oculta.
   ========================================================================== */

import { reduceMotion, finePointer } from './core.js';

const TAU = Math.PI * 2;

export function initHero() {
    const host = document.querySelector('.hero-canvas');
    if (!host) return;

    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    host.appendChild(canvas);

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let cx = 0;
    let cy = 0;
    let unit = 0;
    let rafId = null;
    let visible = true;

    // Parallax del puntero, amortiguado hacia el objetivo.
    const pointer = { tx: 0, ty: 0, x: 0, y: 0 };

    const orbits = [
        { r: 0.34, tilt: -0.42, ratio: 0.30, speed: 0.00042, glow: true },
        { r: 0.52, tilt: 0.24, ratio: 0.46, speed: -0.00027, glow: false },
        { r: 0.72, tilt: -0.18, ratio: 0.34, speed: 0.00017, glow: false },
        { r: 0.95, tilt: 0.52, ratio: 0.52, speed: -0.00011, glow: true },
    ];

    const stars = Array.from({ length: 90 }, () => ({
        a: Math.random() * TAU,
        d: 0.12 + Math.random() * 1.05,
        z: 0.35 + Math.random() * 0.65,
        phase: Math.random() * TAU,
        blink: 0.4 + Math.random() * 1.6,
    }));

    const resize = () => {
        const rect = host.getBoundingClientRect();
        // DPR tope 2: por encima el coste sube al cuadrado y no se nota.
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = rect.width;
        h = rect.height;
        if (!w || !h) return;

        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        cx = w * 0.6;
        cy = h * 0.5;
        unit = Math.min(w, h) * 0.42;
    };

    const drawOrbit = (orbit, t) => {
        const rx = unit * orbit.r;
        const ry = rx * orbit.ratio;
        const angle = orbit.tilt + t * orbit.speed * 240;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);

        // La elipse: hairline, del mismo peso que los bordes del sistema.
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, TAU);
        ctx.strokeStyle = orbit.glow ? 'rgba(198, 242, 78, .16)' : 'rgba(255, 255, 255, .085)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // El satélite que la recorre.
        const p = t * orbit.speed * 1000;
        const px = Math.cos(p) * rx;
        const py = Math.sin(p) * ry;

        // Estela: un arco corto por detrás del satélite.
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, p - 0.55, p);
        ctx.strokeStyle = orbit.glow ? 'rgba(198, 242, 78, .5)' : 'rgba(255, 255, 255, .3)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(px, py, orbit.glow ? 2.6 : 1.8, 0, TAU);
        ctx.fillStyle = orbit.glow ? '#C6F24E' : '#EDF0F6';
        ctx.shadowBlur = 12;
        ctx.shadowColor = orbit.glow ? 'rgba(198, 242, 78, .8)' : 'rgba(237, 240, 246, .5)';
        ctx.fill();

        ctx.restore();
    };

    const render = (t) => {
        ctx.clearRect(0, 0, w, h);

        // Amortiguación del puntero: el sistema persigue, no salta.
        pointer.x += (pointer.tx - pointer.x) * 0.045;
        pointer.y += (pointer.ty - pointer.y) * 0.045;

        ctx.save();
        ctx.translate(pointer.x * 26, pointer.y * 18);

        stars.forEach((s) => {
            const d = unit * s.d;
            const x = cx + Math.cos(s.a) * d * 1.35;
            const y = cy + Math.sin(s.a) * d * 0.72;
            const alpha = (0.16 + Math.abs(Math.sin(t * 0.0006 * s.blink + s.phase)) * 0.34) * s.z;
            ctx.beginPath();
            ctx.arc(x, y, s.z * 1.1, 0, TAU);
            ctx.fillStyle = `rgba(237, 240, 246, ${alpha.toFixed(3)})`;
            ctx.fill();
        });

        orbits.forEach((orbit) => drawOrbit(orbit, t));

        // Nucleo: dos anillos que respiran y un punto pequeño. Relleno grande
        // no: quedaba una bola verde compitiendo con el titular.
        ctx.beginPath();
        ctx.arc(cx, cy, unit * 0.02, 0, TAU);
        ctx.fillStyle = 'rgba(198, 242, 78, .95)';
        ctx.shadowBlur = 14;
        ctx.shadowColor = 'rgba(198, 242, 78, .6)';
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.beginPath();
        ctx.arc(cx, cy, unit * 0.062 + Math.sin(t * 0.0012) * 2, 0, TAU);
        ctx.strokeStyle = 'rgba(198, 242, 78, .38)';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(cx, cy, unit * 0.115 + Math.sin(t * 0.0012 + 1.2) * 4, 0, TAU);
        ctx.strokeStyle = 'rgba(198, 242, 78, .16)';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.restore();
    };

    const loop = (t) => {
        render(t);
        rafId = window.requestAnimationFrame(loop);
    };

    const start = () => {
        if (rafId !== null || reduceMotion.matches) return;
        rafId = window.requestAnimationFrame(loop);
    };

    const stop = () => {
        if (rafId === null) return;
        window.cancelAnimationFrame(rafId);
        rafId = null;
    };

    resize();
    render(0);

    if (reduceMotion.matches) return; // Un solo frame estático y nada más.

    if ('ResizeObserver' in window) {
        new ResizeObserver(() => { resize(); render(performance.now()); }).observe(host);
    } else {
        window.addEventListener('resize', resize);
    }

    if ('IntersectionObserver' in window) {
        new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            if (visible && !document.hidden) start();
            else stop();
        }, { threshold: 0 }).observe(host);
    } else {
        start();
    }

    document.addEventListener('visibilitychange', () => {
        if (document.hidden || !visible) stop();
        else start();
    });

    if (finePointer.matches) {
        window.addEventListener('pointermove', (e) => {
            pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
            pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
        }, { passive: true });
    }

    start();
}
