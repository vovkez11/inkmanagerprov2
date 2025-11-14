/**
 * InkManager Pro - Service Worker
 * Provides offline functionality and caching for PWA
 */

const CACHE_NAME = 'inkmanager-pro-v2.3-modules';
const RUNTIME_CACHE = 'inkmanager-runtime-v2.3';
const OFFLINE_PAGE = '/inkmanagerprov2/offline.html';

// Resources to cache on install
const urlsToCache = [
  '/inkmanagerprov2/',
  '/inkmanagerprov2/index.html',
  '/inkmanagerprov2/landing.html', 
  '/inkmanagerprov2/privacy-policy.html',
  '/inkmanagerprov2/offline.html',
  '/inkmanagerprov2/manifest.json',
  '/inkmanagerprov2/icons/icon-192.png',
  '/inkmanagerprov2/icons/icon-512.png',
  '/inkmanagerprov2/icon-maskable.png',
  '/inkmanagerprov2/icon-monochrome.png',
  '/inkmanagerprov2/assets/js/app.js',
  '/inkmanagerprov2/assets/js/inkmanager.js',
  '/inkmanagerprov2/assets/js/modules/i18n.js',
  '/inkmanagerprov2/assets/js/modules/storage.js',
  '/inkmanagerprov2/assets/js/modules/ui.js',
  '/inkmanagerprov2/assets/js/modules/clients.js',
  '/inkmanagerprov2/assets/js/modules/appointments.js'
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
 * Activate event - clean up old caches and notify clients of update
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
      // Notify all clients about the update
      return self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'SW_UPDATED',
            version: CACHE_NAME
          });
        });
      });
    }).then(() => {
      return self.clients.claim();
    })
  );
});

/**
 * Fetch event - serve cached content when offline
 * Strategy: Network first, falling back to cache, then offline page
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
          return caches.match(request)
            .then(response => {
              if (response) {
                return response;
              }
              // Try to serve the main app page
              return caches.match('/inkmanagerprov2/index.html')
                .then(indexResponse => {
                  if (indexResponse) {
                    return indexResponse;
                  }
                  // Last resort: offline page
                  return caches.match(OFFLINE_PAGE).then(offlineResponse => {
                    if (offlineResponse) {
                      return offlineResponse;
                    }
                    // If no offline page cached, return a basic response
                    return new Response(
                      '<!DOCTYPE html><html><head><title>Offline</title></head><body><h1>You are offline</h1><p>Please check your internet connection.</p></body></html>',
                      {
                        status: 200,
                        statusText: 'OK',
                        headers: new Headers({
                          'Content-Type': 'text/html'
                        })
                      }
                    );
                  });
                });
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
