var CACHE_NAME = 'myapp-cache-v1';
var urlsToCache = [
 'index.html',
 '*.png',
 '*.json',
 '*.js',
 '*.css',
 '*.webmanifest',
 './assets/*.png',
 './assets/*.json',
 './assets/bibletopics/*.json',
 './assets/versions/*.json',
 './view1/*.json',
 './view1/*.js',
 './view1/*.html',
 './view2/*.json',
 './view2/*.js',
 './view2/*.html',
 './view2/versions/*.json'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('activate', function(event) {
  var cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
