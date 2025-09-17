const CACHE_NAME = "bingo-cache-v1";
const URLS_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json"
];

// Instalação: guarda no cache
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(URLS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// Ativação: limpa caches antigos (simples)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(k => {
        if(k !== CACHE_NAME) return caches.delete(k);
      })
    ))
  );
  return self.clients.claim();
});

// Busca: tenta no cache, se não tiver busca online
self.addEventListener("fetch", event => {
  // somente GET
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(resp => {
      if (resp) return resp;
      return fetch(event.request).then(fetchResp => {
        // opcional: cachear novas requisições (padrão: não cachear externos por cors)
        return fetchResp;
      }).catch(() => {
        // fallback simples: se for página, retornar cache da index
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
