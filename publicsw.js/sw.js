const CACHE_NAME = 'gwn-aura-cache-v2';
const urlsToCache = [
  '/',
  '/index.html',
  'https://raw.githubusercontent.com/careprofiit-crypto/Gwn-aura-pwa/main/192.png',
  'https://raw.githubusercontent.com/careprofiit-crypto/Gwn-aura-pwa/main/512.png'
];

// Install Event - caching assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Activate Event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response; // Return cached asset if found
        }
        return fetch(event.request).catch(() => {
          // Fallback if offline and request isn't cached
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        });
      })
  );
});
