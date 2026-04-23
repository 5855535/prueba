// sw.js
const CACHE_NAME = 'autolux-cache-v2'; // <--- Cambia el número de versión aquí
const urlsToCache = [
  './',
  './index.html',
  './main.js',
  './assets/img/icon-192.png',
  './assets/img/favicon.png',
  './manifest.json'
];

// Evento de instalación
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Evento de activación (limpia cachés antiguas)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Estrategia de respuesta
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});