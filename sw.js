/**
 * InkManager Pro - Service Worker
 * Provides offline functionality and caching for PWA
 */

const CACHE_NAME = 'inkmanager-pro-v2.0';
const RUNTIME_CACHE = 'inkmanager-runtime-v2.0';

// Resources to cache on install
const urlsToCache = [
  './',
  './index.html',
  './landing.html', 
  './privacy-policy.html',
  './manifest.json',
  './icon.png',
  './icon-maskable.png',
  './icon-monochrome.png',
  './assets/app.js'
];

/**
 * Install event - cache core resources
 */
self.addEventListener('install', event => {
  console.log('📦 [SW] Installing service worker...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('✅ [SW] Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('✅ [SW] Service worker installed');
        return self.skipWaiting();
      })
      .catch(err => {
        console.error('❌ [SW] Installation failed:', err);
      })
  );
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener('activate', event => {
  console.log('🔄 [SW] Activating service worker...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            console.log('🗑️ [SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ [SW] Service worker activated');
      return self.clients.claim();
    })
  );
});

/**
 * Fetch event - serve cached content when offline
 * Strategy: Network first, falling back to cache
 */
self.addEventListener('fetch', event => {
  const { request } = event;
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // For navigation requests (HTML pages)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Clone and cache the response
          const responseClone = response.clone();
          caches.open(RUNTIME_CACHE).then(cache => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // If network fails, try cache
          return caches.match(request).then(response => {
            return response || caches.match('./index.html');
          });
        })
    );
    return;
  }
  
  // For other requests (CSS, JS, images, etc.)
  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        if (cachedResponse) {
          // Return cached version
          return cachedResponse;
        }
        
        // Fetch from network
        return fetch(request)
          .then(response => {
            // Don't cache non-OK responses
            if (!response || response.status !== 200 || response.type === 'error') {
              return response;
            }
            
            // Clone and cache the response for runtime cache
            const responseClone = response.clone();
            caches.open(RUNTIME_CACHE).then(cache => {
              cache.put(request, responseClone);
            });
            
            return response;
          })
          .catch(() => {
            // Network failed, no cache available
            console.log('❌ [SW] Failed to fetch:', request.url);
            return new Response('Offline - content not available', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});

/**
 * Message event - handle messages from the app
 */
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * Notification click event - handle notification clicks
 */
self.addEventListener('notificationclick', event => {
  console.log('🔔 [SW] Notification clicked:', event.notification.tag);
  event.notification.close();
  
  // Open the app when notification is clicked
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        // If app is already open, focus it
        for (const client of clientList) {
          if (client.url.includes('inkmanagerprov2') && 'focus' in client) {
            return client.focus();
          }
        }
        // If app is not open, open it
        if (clients.openWindow) {
          return clients.openWindow('./index.html#sessions');
        }
      })
  );
});
