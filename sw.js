/* ============================================================
   HidroSmart — Service Worker v2.1
   Estratégia: Cache-First para assets, Network-First para dados
   ============================================================ */

const CACHE_NAME    = 'hidrosmart-v2.1';
const OFFLINE_URL   = './';

// Assets que são cacheados imediatamente no install
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
];

// ── Install: pré-cacheia os assets essenciais ──
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ── Activate: remove caches antigos ──
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch: Cache-First com fallback de rede ──
self.addEventListener('fetch', event => {
  // Ignora requisições não-GET e APIs externas
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Passa direto requisições para APIs externas (Anthropic, GitHub, etc.)
  if (
    url.hostname !== self.location.hostname &&
    url.hostname !== 'localhost' &&
    !url.hostname.endsWith('.github.io')
  ) {
    // Para APIs externas: tenta rede, sem cache
    event.respondWith(
      fetch(event.request).catch(() => {
        // Nada a fazer offline para APIs
        return new Response(JSON.stringify({ error: 'offline' }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
    return;
  }

  // Para assets locais: Cache-First, fallback rede, fallback offline
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        // Atualiza cache em background (stale-while-revalidate)
        fetch(event.request)
          .then(networkResponse => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, networkResponse.clone());
              });
            }
          })
          .catch(() => {}); // Silencia erros de rede no background

        return cachedResponse;
      }

      // Não está no cache: busca na rede e cacheia
      return fetch(event.request)
        .then(networkResponse => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, networkResponse.clone());
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Fallback para a página principal se offline
          return caches.match(OFFLINE_URL);
        });
    })
  );
});

// ── Mensagens do cliente (ex: forçar atualização) ──
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});
