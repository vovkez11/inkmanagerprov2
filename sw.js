const CACHE_NAME = 'inkmanager-v5';
const urlsToCache = [
  '/inkmanagerprov2/',
  '/inkmanagerprov2/index.html',
  '/inkmanagerprov2/manifest.json',
  '/inkmanagerprov2/icon.png',
  '/inkmanagerprov2/landing.html'
];

self.addEventListener('install', (event) => {
  console.log('🛠️ Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Cache opened, adding files...');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  // Fix for Chrome PWA navigation issues
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match('/inkmanagerprov2/index.html')
        .then((response) => {
          return response || fetch(event.request);
        })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
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
