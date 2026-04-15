var CACHE_VERSION = 'v2';
var CACHE_NAME = 'domestique-' + CACHE_VERSION;
var urlsToCache = [
    './',
    './index.html',
    './icon-192.png',
    './icon-512.png',
    './manifest.json'
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(urlsToCache);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        fetch(event.request).then(function(response) {
            var clone = response.clone();
            caches.open(CACHE_NAME).then(function(cache) {
                cache.put(event.request, clone);
            });
            return response;
        }).catch(function() {
            return caches.match(event.request);
        })
    );
});
