/* ==========================================================================
   FS ORBIT · preloader.js
   Boot de ~2s en la primera visita de la sesión. En navegaciones internas
   posteriores (index -> proyectos y viceversa) se acorta a un pase de
   700ms: ya no hay fuentes ni activos que esperar, así que un preloader
   completo ahí solo estorbaría. El mismo pase corto se usa si el usuario
   pide movimiento reducido — más corto, pero nunca invisible.

   Devuelve una promesa: el resto del arranque (boot, hero, etc.) espera a
   que la cortina se retire antes de correr, para que el primer reveal de
   la página coincida exactamente con el momento en que se ve.
   ========================================================================== */

import { reduceMotion } from './core.js';

const SESSION_KEY = 'fsorbit-booted';
const STATUS_MESSAGES = ['Inicializando sistema', 'Cargando activos', 'Compilando interfaz', 'Listo'];

export function initPreloader() {
    return new Promise((resolve) => {
        const el = document.getElementById('preloader');

        if (!el) {
            document.body.classList.remove('is-loading');
            resolve();
            return;
        }

        const finish = () => {
            el.remove();
            document.body.classList.remove('is-loading');
            resolve();
        };

        // Antes esto saltaba directo a finish(): con movimiento reducido
        // activo la pantalla de carga desaparecía en el mismo frame en que
        // aparecía, es decir, nunca se llegaba a ver. Ahora corre igual,
        // solo que más corta y sin depender del giro del anillo (que la
        // capa a11y ya recorta a un solo frame de 240ms).
        const returning = sessionStorage.getItem(SESSION_KEY) === 'true';
        const duration = (returning || reduceMotion.matches) ? 700 : 2000;

        const counter = el.querySelector('.preloader-count');
        const bar = el.querySelector('.preloader-bar__fill');
        const status = el.querySelector('.preloader-status');
        const messages = (returning || reduceMotion.matches)
            ? [STATUS_MESSAGES[0], STATUS_MESSAGES[3]]
            : STATUS_MESSAGES;

        const start = performance.now();

        const tick = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - (1 - p) ** 2.4;

            if (counter) counter.textContent = String(Math.round(eased * 100)).padStart(3, '0');
            if (bar) bar.style.setProperty('--p', eased.toFixed(4));

            if (status) {
                const label = messages[Math.min(messages.length - 1, Math.floor(p * messages.length))];
                if (status.textContent !== label) status.textContent = label;
            }

            if (p < 1) {
                window.requestAnimationFrame(tick);
                return;
            }

            sessionStorage.setItem(SESSION_KEY, 'true');
            el.classList.add('is-done');
            // Espera a que termine la cortina (--d5) antes de desmontar el
            // nodo; bajo movimiento reducido esa transición ya viene
            // recortada por la capa a11y, así que la espera también baja.
            window.setTimeout(finish, reduceMotion.matches ? 280 : 1350);
        };

        window.requestAnimationFrame(tick);
    });
}
