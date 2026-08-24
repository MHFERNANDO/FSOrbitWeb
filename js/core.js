/* ==========================================================================
   FS ORBIT · core.js
   Piezas compartidas por index.html y proyectos.html.
   Todo se auto-desconecta cuando ya no hace falta y respeta
   prefers-reduced-motion.
   ========================================================================== */

export const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
export const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

const raf = (fn) => window.requestAnimationFrame(fn);

/* --------------------------------------------------------------------------
   1 · Partir titulares en palabras enmascaradas
   --------------------------------------------------------------------------
   Camina el árbol en vez de tocar innerHTML: así <br> y <span class="highlight">
   sobreviven intactos y el texto renderizado es idéntico carácter a carácter.
   -------------------------------------------------------------------------- */
export function splitHeadings(root = document) {
    root.querySelectorAll('[data-split]').forEach((el) => {
        if (el.dataset.splitDone) return;
        el.dataset.splitDone = 'true';

        let index = 0;

        const walk = (node) => {
            [...node.childNodes].forEach((child) => {
                if (child.nodeType === Node.ELEMENT_NODE) {
                    if (child.tagName !== 'BR') walk(child);
                    return;
                }
                if (child.nodeType !== Node.TEXT_NODE) return;

                const text = child.textContent;
                if (!text.trim()) return;

                const frag = document.createDocumentFragment();
                // Conserva los espacios como nodos de texto propios para que
                // el interletraje entre palabras no cambie.
                text.split(/(\s+)/).forEach((chunk) => {
                    if (!chunk) return;
                    if (!chunk.trim()) {
                        frag.appendChild(document.createTextNode(chunk));
                        return;
                    }
                    const mask = document.createElement('span');
                    mask.className = 'split-mask';
                    const word = document.createElement('span');
                    word.className = 'split-word';
                    word.style.setProperty('--w', index++);
                    word.textContent = chunk;
                    mask.appendChild(word);
                    frag.appendChild(mask);
                });

                child.replaceWith(frag);
            });
        };

        walk(el);
    });
}

/* --------------------------------------------------------------------------
   2 · Odómetro de los números de servicio
   --------------------------------------------------------------------------
   Cada dígito es una tira real de 0-9 duplicada: la primera vuelta es el giro
   y la segunda el aterrizaje. Nada de reescribir textContent por frame.
   -------------------------------------------------------------------------- */
function buildOdometer(el) {
    if (el.dataset.odoDone) return;
    const value = el.textContent.trim();
    if (!/^\d+$/.test(value)) return;

    el.dataset.odoDone = 'true';
    el.dataset.value = value;
    el.setAttribute('aria-label', value);

    const odo = document.createElement('span');
    odo.className = 'odo';
    odo.setAttribute('aria-hidden', 'true');

    [...value].forEach((digit, i) => {
        const col = document.createElement('span');
        col.className = 'odo-col';
        const reel = document.createElement('span');
        reel.className = 'odo-reel';
        reel.style.setProperty('--n', i);
        // Dos vueltas completas de 0-9 para que haya recorrido que girar.
        for (let pass = 0; pass < 2; pass += 1) {
            for (let d = 0; d <= 9; d += 1) {
                const b = document.createElement('b');
                b.textContent = d;
                reel.appendChild(b);
            }
        }
        col.appendChild(reel);
        odo.appendChild(col);
        col.dataset.target = digit;
    });

    el.textContent = '';
    el.appendChild(odo);
}

function runOdometer(el) {
    if (el.dataset.odoRan) return;
    el.dataset.odoRan = 'true';

    el.querySelectorAll('.odo-col').forEach((col) => {
        const reel = col.querySelector('.odo-reel');
        const target = Number(col.dataset.target);
        reel.style.setProperty('--d', reduceMotion.matches ? target : 10 + target);
    });
}

export function prepareOdometers(root = document) {
    root.querySelectorAll('.card-number').forEach(buildOdometer);
}

/* --------------------------------------------------------------------------
   3 · Motor de revelado
   --------------------------------------------------------------------------
   Un solo IntersectionObserver para toda la página. Los grupos reparten el
   escalonado con --i; al terminar la entrada se libera el transition-delay
   para que los hovers no arrastren el retardo del stagger.
   -------------------------------------------------------------------------- */
export function initReveal(root = document) {
    // Escalonado por grupo, calculado una vez.
    root.querySelectorAll('[data-reveal-group]').forEach((group) => {
        group.querySelectorAll(':scope > [data-reveal]').forEach((child, i) => {
            child.style.setProperty('--i', i);
        });
    });

    // Los chips de features entran uno detrás de otro dentro de su fila.
    root.querySelectorAll('.card-features').forEach((list) => {
        [...list.children].forEach((li, i) => li.style.setProperty('--c', i));
    });

    const targets = [...root.querySelectorAll('[data-reveal]')];
    const pending = new Set(targets);

    const activate = (el) => {
        el.classList.add('is-in');
        pending.delete(el);
        el.querySelectorAll('.card-number').forEach(runOdometer);
        window.setTimeout(() => el.classList.add('is-settled'), reduceMotion.matches ? 400 : 1900);
    };

    // El bypass anterior forzaba .is-in en todo de una sola vez si el
    // usuario pedía movimiento reducido: sin recorrido de scroll que
    // observar, cada sección llegaba pintada de fábrica y no había nada
    // que transicionar. El observer se mantiene siempre; lo que cambia
    // bajo movimiento reducido es la duración (ver capa a11y), no si
    // llega a animarse.
    if (!('IntersectionObserver' in window)) {
        targets.forEach(activate);
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            activate(entry.target);
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    // Lo que ya está en pantalla lo dispara el propio observer en su primera
    // llamada, así que el hero no necesita ningún caso especial.
    targets.forEach((el) => observer.observe(el));

    // Red de seguridad: un salto de scroll instantáneo (tecla Fin, arrastrar
    // el thumb de la barra) puede cruzar la franja donde el observer dispara
    // sin que el navegador llegue a pintar un frame intermedio — el elemento
    // pasa de "por venir" a "ya pasado" sin nunca intersectar, y se queda
    // en opacity:0 para siempre. Un barrido en scroll rescata lo que quedó
    // por encima del viewport sin haberse activado.
    let queued = false;

    const sweep = () => {
        queued = false;
        pending.forEach((el) => {
            if (el.getBoundingClientRect().top >= 0) return;
            activate(el);
            observer.unobserve(el);
        });
        if (pending.size === 0) window.removeEventListener('scroll', onScroll);
    };

    const onScroll = () => {
        if (queued || pending.size === 0) return;
        queued = true;
        window.requestAnimationFrame(sweep);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
}

/* --------------------------------------------------------------------------
   4 · Navbar: condensación, progreso de lectura y cajón móvil
   -------------------------------------------------------------------------- */
export function initNav() {
    const nav = document.querySelector('.navbar');
    if (!nav) return;

    const progress = nav.querySelector('.nav-progress');
    const toggle = nav.querySelector('.nav-toggle');
    const menu = nav.querySelector('.nav-links');

    let ticking = false;

    const update = () => {
        ticking = false;
        const y = window.scrollY;
        nav.classList.toggle('is-scrolled', y > 24);

        if (progress) {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            progress.style.setProperty('--progress', max > 0 ? Math.min(y / max, 1) : 0);
        }
    };

    // rAF en vez de escribir estilos dentro del propio evento de scroll:
    // así el layout se lee una vez por frame y no una por evento.
    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        raf(update);
    }, { passive: true });

    update();

    if (!toggle || !menu) return;

    menu.querySelectorAll('li').forEach((li, i) => li.style.setProperty('--i', i));

    const setMenu = (open) => {
        toggle.classList.toggle('is-open', open);
        menu.classList.toggle('active', open);
        toggle.setAttribute('aria-expanded', String(open));
        document.body.style.overflow = open ? 'hidden' : '';
    };

    toggle.addEventListener('click', () => setMenu(!menu.classList.contains('active')));
    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menu.classList.contains('active')) setMenu(false);
    });
}

/* --------------------------------------------------------------------------
   5 · Botones magnéticos
   -------------------------------------------------------------------------- */
export function initMagnetic() {
    if (!finePointer.matches || reduceMotion.matches) return;

    document.querySelectorAll('[data-magnetic]').forEach((el) => {
        const strength = Number(el.dataset.magnetic) || 10;
        el.classList.add('is-magnetic');

        el.addEventListener('pointermove', (e) => {
            const r = el.getBoundingClientRect();
            const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
            const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
            el.classList.add('is-pulling');
            el.style.setProperty('--mx', `${dx * strength}px`);
            el.style.setProperty('--my', `${dy * strength * 0.6}px`);
        });

        el.addEventListener('pointerleave', () => {
            el.classList.remove('is-pulling');
            el.style.removeProperty('--mx');
            el.style.removeProperty('--my');
        });
    });
}

/* --------------------------------------------------------------------------
   6 · Etiqueta que sigue al cursor sobre los proyectos
   -------------------------------------------------------------------------- */
export function initCursorTag() {
    const zones = document.querySelectorAll('[data-cursor]');
    if (!zones.length || !finePointer.matches || reduceMotion.matches) return;

    const tag = document.createElement('div');
    tag.className = 'cursor-tag';
    tag.setAttribute('aria-hidden', 'true');
    document.body.appendChild(tag);

    let x = 0;
    let y = 0;
    let pending = false;

    const draw = () => {
        pending = false;
        tag.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(1)`;
    };

    zones.forEach((zone) => {
        zone.addEventListener('pointerenter', (e) => {
            tag.textContent = zone.dataset.cursor;
            // Se coloca antes de hacerse visible: si no, aparece un frame en
            // la esquina superior izquierda y salta hasta el puntero.
            x = e.clientX;
            y = e.clientY;
            tag.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(.5)`;
            raf(() => {
                tag.classList.add('is-visible');
                draw();
            });
        });

        zone.addEventListener('pointermove', (e) => {
            x = e.clientX;
            y = e.clientY;
            if (pending) return;
            pending = true;
            raf(draw);
        });

        zone.addEventListener('pointerleave', () => {
            tag.classList.remove('is-visible');
            tag.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(.5)`;
        });
    });
}

/* --------------------------------------------------------------------------
   7 · Foco atrapado dentro de un modal abierto
   -------------------------------------------------------------------------- */
const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, iframe, [tabindex]:not([tabindex="-1"])';

export function trapFocus(container) {
    const onKeydown = (e) => {
        if (e.key !== 'Tab') return;
        const items = [...container.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null);
        if (!items.length) return;

        const first = items[0];
        const last = items[items.length - 1];

        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    };

    container.addEventListener('keydown', onKeydown);
    return () => container.removeEventListener('keydown', onKeydown);
}

/* --------------------------------------------------------------------------
   8 · Modal de preview de proyectos
   -------------------------------------------------------------------------- */
export function initProjectPreview() {
    const modal = document.getElementById('projectPreviewModal');
    if (!modal) return;

    const closeBtn = document.getElementById('closePreviewBtn');
    const frame = document.getElementById('projectIframe');
    const loader = document.getElementById('previewLoader');
    const external = document.getElementById('externalProjectLink');
    const triggers = document.querySelectorAll('.project-trigger');

    let lastTrigger = null;
    let releaseFocus = null;

    const open = (trigger) => {
        const url = trigger.dataset.url;
        if (!url) return;

        lastTrigger = trigger;
        loader.hidden = false;
        frame.classList.remove('loaded');
        external.href = url;
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        frame.src = url;

        releaseFocus = trapFocus(modal);
        window.setTimeout(() => closeBtn.focus(), 60);
    };

    const close = () => {
        if (!modal.classList.contains('active')) return;
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (releaseFocus) { releaseFocus(); releaseFocus = null; }
        if (lastTrigger) lastTrigger.focus();
        // Se vacía cuando la salida ya terminó: si no, se ve el iframe en
        // blanco durante toda la animación de cierre.
        window.setTimeout(() => {
            frame.src = '';
            frame.classList.remove('loaded');
        }, 420);
    };

    triggers.forEach((trigger) => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            open(trigger);
        });
    });

    frame.addEventListener('load', () => {
        if (!frame.src || frame.src === window.location.href) return;
        loader.hidden = true;
        frame.classList.add('loaded');
    });

    closeBtn.addEventListener('click', close);
    modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}

/* --------------------------------------------------------------------------
   9 · Arranque común
   -------------------------------------------------------------------------- */
export function boot() {
    splitHeadings();
    prepareOdometers();
    initReveal();
    initNav();
    initMagnetic();
    initCursorTag();
    initProjectPreview();
}
