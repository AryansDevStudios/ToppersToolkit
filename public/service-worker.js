const CACHE_NAME = 'toppers-toolkit-cache-v1';

// These are the files that will be cached upon installation.
const urlsToCache = [
    '/',
    '/fallback',
    '/manifest.json',
    '/icon/icon_main.png'
];

// Install the service worker and cache the initial resources
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                // Add all the assets to the cache
                return cache.addAll(urlsToCache);
            })
    );
});

// Activate event: clean up old caches
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
});

// Fetch event: serve cached content or fetch from network
self.addEventListener('fetch', (event) => {
    // We only want to cache GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    // For images, use a "cache-first" strategy
    if (event.request.destination === 'image') {
        event.respondWith(
            caches.open(CACHE_NAME).then((cache) => {
                return cache.match(event.request).then((cachedResponse) => {
                    // Return from cache if available
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    // Otherwise, fetch from the network, cache it, and return it
                    return fetch(event.request).then((networkResponse) => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                });
            })
        );
        return; // End execution for images
    }

    // For all other requests (HTML, CSS, JS, etc.), go to the network first.
    // This ensures the user always gets the latest pages and code.
    event.respondWith(
        fetch(event.request)
            .catch(() => {
                // If the network request fails (e.g., offline),
                // try to serve a fallback page from the cache.
                return caches.open(CACHE_NAME).then((cache) => {
                    if (event.request.mode === 'navigate') {
                         return cache.match('/fallback');
                    }
                    return cache.match(event.request);
                });
            })
    );
});
