/* ==========================================================================
   FS ORBIT · proyectos.js — punto de entrada de proyectos.html
   Toda la lógica compartida vive en core.js; aquí solo queda lo propio de
   la galería.
   ========================================================================== */

import { boot, reduceMotion } from './core.js';
import { initPreloader } from './preloader.js';

/* --------------------------------------------------------------------------
   Parallax vertical de las capturas
   --------------------------------------------------------------------------
   La imagen se mueve más despacio que su contenedor mientras el bloque cruza
   la pantalla. Se escribe una custom property y el desplazamiento lo hace el
   compositor, así que no dispara layout.
   -------------------------------------------------------------------------- */
function initParallax() {
    const frames = [...document.querySelectorAll('.p-visual-container')];
    if (!frames.length || reduceMotion.matches) return;

    let ticking = false;
    let active = new Set();

    const update = () => {
        ticking = false;
        const vh = window.innerHeight;

        active.forEach((frame) => {
            const rect = frame.getBoundingClientRect();
            // -1 cuando el bloque entra por abajo, +1 cuando sale por arriba
            const progress = (rect.top + rect.height / 2 - vh / 2) / (vh / 2);
            frame.style.setProperty('--shift', `${(progress * -18).toFixed(2)}px`);
        });
    };

    const onScroll = () => {
        if (ticking || !active.size) return;
        ticking = true;
        window.requestAnimationFrame(update);
    };

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) active.add(entry.target);
                else active.delete(entry.target);
            });
            onScroll();
        }, { rootMargin: '120px 0px' });

        frames.forEach((frame) => observer.observe(frame));
    } else {
        active = new Set(frames);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
}

initPreloader().then(() => {
    boot();
    initParallax();
});
