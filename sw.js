[file name]: sw.js
[file content begin]
// Service Worker for InkManager Pro - CACHE BUSTING VERSION
const CACHE_NAME = 'inkmanager-pro-v3.0.0'; // ← CHANGED VERSION
const urlsToCache = [
  './',
  './index.html',
  './landing.html',
  './privacy-policy.html',
  './manifest.json',
  './icon.png',
  './icon-192x192.png',
  './icon-512x512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Roboto:wght@300;400;500;700&display=swap'
];

// Install event - cache essential files
self.addEventListener('install', event => {
  console.log('🛠️ Service Worker installing NEW VERSION 3.0...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Opened NEW cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('✅ All resources cached in NEW version');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('❌ Cache installation failed:', error);
      })
  );
});

// Activate event - clean up ALL old caches
self.addEventListener('activate', event => {
  console.log('🚀 NEW Service Worker activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Delete ALL old caches (not just different names)
          if (cacheName.startsWith('inkmanager-pro-') && cacheName !== CACHE_NAME) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ NEW Service Worker activated and old caches cleared');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  // Skip non-GET requests and Chrome extensions
  if (event.request.method !== 'GET' || 
      event.request.url.startsWith('chrome-extension://')) {
    return;
  }

  // Add cache busting for HTML files
  if (event.request.url.includes('/index.html') || 
      event.request.url.endsWith('/')) {
    event.respondWith(
      fetch(event.request, {cache: 'no-store'})
        .then(response => {
          // Update cache with fresh version
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseClone);
            });
          return response;
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(event.request);
        })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }

        return fetch(event.request)
          .then(fetchResponse => {
            // Check if valid response
            if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
              return fetchResponse;
            }

            // Clone the response
            const responseToCache = fetchResponse.clone();

            // Add to cache for future
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return fetchResponse;
          })
          .catch(error => {
            console.log('❌ Fetch failed:', error);
            // Return offline page for navigation requests
            if (event.request.destination === 'document') {
              return caches.match('./index.html');
            }
            return new Response('App is offline', {
              status: 408,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});

// Message event - for manual cache clearing
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.delete(CACHE_NAME);
  }
});

// Background sync for offline data
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    console.log('🔄 Background sync triggered');
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  console.log('🔄 Syncing background data...');
}
[file content end]
