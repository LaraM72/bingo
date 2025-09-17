const CACHE_NAME = "bingo-cache-v1";
const URLS_TO_CACHE = [
  "index.html",
  "manifest.json"
];

// Instalação: guarda no cache
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(URLS_TO_CACHE))
  );
});

// Busca: tenta no cache, se não tiver busca online
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(resp => {
      return resp || fetch(event.request);
    })
  );
});
