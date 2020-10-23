const STATIC_CACHE = 'site-static-v1';
const DYNAMIC_CACHE = 'site-dynamic-v1';

const assets = [
  '/',

  '/home.html',
  '/details.html',
  '/fallback.html',

  '/images/title.png',
  '/images/subtitle.png',
  '/images/icons/icon-transparent.png',
  '/images/icons/icon-144x144.png',

  '/helper.js',
  '/script.js',
  '/pokemonDetails.js',
  '/swRegister.js',

  '/style.css',

  'https://fonts.googleapis.com/css2?family=Roboto&display=swap',

  '/manifest.json'
];

// cache size limit function
const limitCacheSize = (name, size) => {
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      if(keys.length > size){
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

// install event
self.addEventListener('install', evt => {
  console.log('service worker installed');
  evt.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      cache.addAll(assets);
    })
  );
});

// activate event
self.addEventListener('activate', evt => {
  console.log('service worker activated');
  evt.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
        .map(key => caches.delete(key))
      );
    })
  );
});

self.addEventListener('fetch', evt => {
  //console.log('fetch event', evt);
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      return cacheRes || fetch(evt.request).then(fetchRes => {
        return caches.open(DYNAMIC_CACHE).then(cache => {
          cache.put(evt.request.url, fetchRes.clone());
          return fetchRes;
        })
      });
    }).catch(() => {
      return caches.match('/fallback.html');
    })
  );
});