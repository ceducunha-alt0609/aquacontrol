// HidroSmart v2.0 — Service Worker
const CACHE_NAME = 'hidrosmart-v2.0';
const ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

// Instalar e cachear assets essenciais
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Limpar caches antigos na ativação
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Estratégia: Cache First com fallback para rede
self.addEventListener('fetch', event => {
  // Ignorar requisições não-GET e extensões do browser
  if (event.request.method !== 'GET') return;
  if (event.request.url.startsWith('chrome-extension://')) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request)
        .then(response => {
          // Cachear apenas respostas válidas de mesma origem
          if (
            response.ok &&
            response.type === 'basic' &&
            !event.request.url.includes('chrome-extension')
          ) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => {
          // Offline fallback: retornar index.html para navegação
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
    })
  );
});
