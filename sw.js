// OFFLINE-FIRST Service Worker for APK
const CACHE_NAME = 'inkmanager-pro-offline-v1';
const urlsToCache = [
  './',
  './index.html',
  './landing.html', 
  './privacy-policy.html',
  './manifest.json',
  './icon.png',
  './sw.js'
];

self.addEventListener('install', event => {
  console.log('📦 Installing service worker for offline use');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('✅ Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        
        // For navigation requests, always return index.html
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
        
        return fetch(event.request).catch(() => {
          // If fetch fails and it's a document request, return offline page
          if (event.request.destination === 'document') {
            return caches.match('./index.html');
          }
          return new Response('Offline - content not available');
        });
      })
  );
});
