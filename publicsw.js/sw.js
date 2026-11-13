const CACHE_NAME = 'gwn-aura-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  'https://raw.githubusercontent.com/careprofiit-crypto/Gwn-aura-pwa/main/192.png',
  'https://raw.githubusercontent.com/careprofiit-crypto/Gwn-aura-pwa/main/512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
