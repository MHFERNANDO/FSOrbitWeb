// Service Worker minimo de FS Orbit.
// El manifest.json y el registro en script.js/proyectos.js ya existian,
// pero este archivo nunca se creo: cada carga disparaba un 404 al intentar
// registrarlo (visible en consola) y la PWA nunca quedaba instalable.
//
// Estrategia: network-first para HTML/CSS/JS (el sitio se actualiza con
// cierta frecuencia; cache-first serviria una version vieja del estilo o
// del script tras cada deploy sin que el usuario lo note). Cache-first
// solo para las imagenes de assets/, que no cambian de contenido bajo el
// mismo nombre. Sin caching de terceros (Google Fonts).

const CACHE_NAME = 'fsorbit-shell-v4';

const SHELL_ASSETS = [
    'css/style.css',
    'css/proyectos.css',
    'js/core.js',
    'js/hero.js',
    'js/preloader.js',
    'js/script.js',
    'js/proyectos.js',
    'assets/Logo.png',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(SHELL_ASSETS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(
                keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
            ))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const { request } = event;

    // Solo mismo origen: no interceptamos Google Fonts ni otros CDNs.
    if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) {
        return;
    }

    const isImage = request.destination === 'image';

    if (isImage) {
        // Las imagenes no cambian de contenido bajo el mismo nombre:
        // cache-first esta bien aqui, sirve rapido en visitas repetidas.
        event.respondWith(
            caches.match(request).then((cached) => {
                if (cached) return cached;
                return fetch(request).then((response) => {
                    if (response.ok) {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
                    }
                    return response;
                });
            })
        );
        return;
    }

    // HTML / CSS / JS: network-first. El sitio cambia con frecuencia y una
    // version cacheada de un deploy anterior no debe pisar la actual.
    event.respondWith(
        fetch(request)
            .then((response) => {
                if (response.ok) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
                }
                return response;
            })
            .catch(() => caches.match(request))
    );
});
