// statyczny cache
// przechowujemy w nim rzeczy na stałe
const STATIC_CACHE = 'static-cache';

// dynamiczny cache
// zapisujemy do niego nowe rzeczy, inne usuwamy
const DYNAMIC_CACHE = 'dynamic-cache';

// tablica elementów dla statycznego cacha
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

// funkcja do ograniczania ilość elementów w cache'u
const limitCacheSize = (name, size) => {

  // otwieramy cache o podanej nazwie
  caches.open(name).then(cache => {

    // pobieramy jego elementy
    cache.keys().then(keys => {

      // jak za dużo to usuwamy
      if(keys.length > size){
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

// instalacja service workera
self.addEventListener('install', evt => {
  console.log("service worker installed");

  evt.waitUntil(
    // zapis do statycznego cache'a
    caches.open(STATIC_CACHE).then((cache) => {
      cache.addAll(assets);
    })
  );
});

// aktywacja service workera 
self.addEventListener('activate', evt => {
  console.log("service worker activated");

  // usunięcie zbędnych cache'y 
  // wygodne, gdy podczas tworzenia aplikacji, gdy tworzysz cache o różnych nazwach
  // nie jest to wymagane do działania aplikacji
  evt.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
        .map(key => caches.delete(key))
      );
    })
  );
});

// pobieranie czegoś
self.addEventListener('fetch', evt => {
  evt.respondWith(
    // sprawdź czy nie mamy tego czegoś w jakimś cache'u
    caches.match(evt.request).then(cacheRes => {

      // jak mamy to go zwróć, a jak nie to pobierz z neta
      return cacheRes || fetch(evt.request).then(fetchRes => {

        // zapisywanie w dynamicznym cache'u
        return caches.open(DYNAMIC_CACHE).then(cache => {
          cache.put(evt.request.url, fetchRes.clone());
          limitCacheSize(DYNAMIC_CACHE, 15)
          return fetchRes;
        })
      });
    }).catch(() => { // jak się posypie (bo nie mamy internetu) to zwróć stronę z errorem
      return caches.match('/fallback.html');
    })
  );
});