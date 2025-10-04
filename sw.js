const CACHE_NAME = 'inkmanager-v4';
const urlsToCache = [
  '/inkmanagerprov2/',
  '/inkmanagerprov2/index.html',
  '/inkmanagerprov2/manifest.json',
  '/inkmanagerprov2/icon.png',
  '/inkmanagerprov2/landing.html'
];

self.addEventListener('install', (event) => {
  console.log('🛠️ Service Worker installing for InkManager Pro...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Cache opened, adding files...');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('✅ All files cached successfully!');
      })
      .catch((error) => {
        console.log('❌ Cache failed:', error);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          console.log('✅ Serving from cache:', event.request.url);
          return response;
        }
        console.log('🌐 Fetching from network:', event.request.url);
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log('🎯 Service Worker activated!');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
