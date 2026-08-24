/* ==========================================================================
   FS ORBIT · script.js — punto de entrada de index.html
   ========================================================================== */

import { boot, trapFocus, reduceMotion } from './core.js';
import { initHero } from './hero.js';
import { initPreloader } from './preloader.js';

/* --------------------------------------------------------------------------
   Chat acoplado
   -------------------------------------------------------------------------- */
function initChat() {
    const dock = document.getElementById('chatDock');
    if (!dock) return;

    const trigger = document.getElementById('chatTrigger');
    const panel = dock.querySelector('.chat-window');
    const closeBtn = document.getElementById('closeChat');

    const setOpen = (open) => {
        panel.classList.toggle('active', open);
        trigger.setAttribute('aria-expanded', String(open));
        panel.setAttribute('aria-hidden', String(!open));
        if (open) window.setTimeout(() => closeBtn.focus(), 80);
    };

    trigger.addEventListener('click', () => setOpen(!panel.classList.contains('active')));
    closeBtn.addEventListener('click', () => {
        setOpen(false);
        trigger.focus();
    });

    document.addEventListener('click', (e) => {
        if (panel.classList.contains('active') && !dock.contains(e.target)) setOpen(false);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && panel.classList.contains('active')) {
            setOpen(false);
            trigger.focus();
        }
    });
}

/* --------------------------------------------------------------------------
   Asesor por pasos
   -------------------------------------------------------------------------- */
function initAdvisor() {
    const modal = document.getElementById('modalStep');
    if (!modal) return;

    const openers = document.querySelectorAll('[data-open-advisor]');
    const closeBtn = modal.querySelector('.close-modal');
    const steps = [...modal.querySelectorAll('.step')];
    const options = modal.querySelectorAll('.opt-btn');
    const sendBtn = document.getElementById('sendWhatsapp');

    const choice = { servicio: '', prioridad: '' };
    let releaseFocus = null;
    let lastOpener = null;

    const showStep = (index) => {
        steps.forEach((step, i) => step.classList.toggle('active', i === index));
    };

    const open = (opener) => {
        lastOpener = opener || null;
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        showStep(0);
        releaseFocus = trapFocus(modal);
        window.setTimeout(() => modal.querySelector('.step.active .opt-btn')?.focus(), 120);
    };

    const close = () => {
        if (!modal.classList.contains('active')) return;
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (releaseFocus) { releaseFocus(); releaseFocus = null; }
        if (lastOpener) lastOpener.focus();
    };

    openers.forEach((btn) => btn.addEventListener('click', () => open(btn)));
    closeBtn.addEventListener('click', close);
    modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

    options.forEach((btn) => {
        btn.addEventListener('click', () => {
            const step = btn.closest('.step');
            const num = Number(step.dataset.step);

            if (num === 1) choice.servicio = btn.dataset.value;
            if (num === 2) choice.prioridad = btn.dataset.value;

            showStep(num);
            window.setTimeout(() => {
                modal.querySelector('.step.active .opt-btn, .step.active .btn')?.focus();
            }, 220);
        });
    });

    sendBtn?.addEventListener('click', () => {
        const text = `¡Hola FS Orbit! 👋 Me interesa el servicio de *${choice.servicio}*. Mi prioridad principal es *${choice.prioridad}*. ¿Me podrían dar más info?`;
        window.open(`https://wa.me/593983113942?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
        close();
    });
}

/* --------------------------------------------------------------------------
   Descifrado del bloque de código
   --------------------------------------------------------------------------
   Al entrar en viewport el texto se resuelve de izquierda a derecha desde
   caracteres aleatorios. El contenido original se guarda antes y se restaura
   entero al final, así que el DOM acaba exactamente como estaba.
   -------------------------------------------------------------------------- */
function initCodeDecrypt() {
    const block = document.querySelector('.code-content code');
    if (!block || reduceMotion.matches || !('IntersectionObserver' in window)) return;

    const glyphs = '01<>{}[]/\\|=+*#$%&_-';
    const nodes = [];
    const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT);

    while (walker.nextNode()) {
        const node = walker.currentNode;
        if (node.textContent.trim()) nodes.push({ node, text: node.textContent });
    }
    if (!nodes.length) return;

    const total = nodes.reduce((sum, n) => sum + n.text.length, 0);

    const run = () => {
        const duration = 1100;
        const start = performance.now();

        const tick = (now) => {
            const p = Math.min((now - start) / duration, 1);
            // easeOutCubic: rápido al principio, se asienta al final
            const eased = 1 - Math.pow(1 - p, 3);
            let revealed = Math.round(eased * total);

            nodes.forEach(({ node, text }) => {
                if (revealed >= text.length) {
                    node.textContent = text;
                    revealed -= text.length;
                    return;
                }
                if (revealed <= 0) {
                    node.textContent = text.replace(/\S/g, () => glyphs[(Math.random() * glyphs.length) | 0]);
                    return;
                }
                const head = text.slice(0, revealed);
                const tail = text.slice(revealed).replace(/\S/g, () => glyphs[(Math.random() * glyphs.length) | 0]);
                node.textContent = head + tail;
                revealed = 0;
            });

            if (p < 1) window.requestAnimationFrame(tick);
            else nodes.forEach(({ node, text }) => { node.textContent = text; });
        };

        window.requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        window.setTimeout(run, 220);
    }, { threshold: 0.4 });

    observer.observe(block);
}

/* --------------------------------------------------------------------------
   Arranque
   -------------------------------------------------------------------------- */
initPreloader().then(() => {
    boot();
    initHero();
    initChat();
    initAdvisor();
    initCodeDecrypt();
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js'));
}
