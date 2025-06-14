const CACHE_NAME = 'wifi-calc-v3'; // Cache version updated
const GITHUB_REPO_NAME = '/Wifi-Calculator'; // Your repository name

const ASSETS_TO_CACHE = [
  `${GITHUB_REPO_NAME}/`,
  `${GITHUB_REPO_NAME}/index.html`,
  `${GITHUB_REPO_NAME}/manifest.json`,
  `${GITHUB_REPO_NAME}/icon-192.png`,
  `${GITHUB_REPO_NAME}/icon-512.png`,
  'https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.min.js'
];

// Install a service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching files');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .catch(error => console.error('Failed to cache assets:', error))
  );
  self.skipWaiting();
});

// Activate the service worker and remove old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      ).then(() => {
        console.log('New service worker activated');
        return self.clients.claim();
      });
    })
  );
});

// Serve cached content when offline
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                // If not in cache, try fetching from network
                return fetch(event.request);
            })
    );
});

