/* ============================================================
   HidroSmart — Service Worker  v2.0
   Cache-first para assets estáticos, network-first para HTML
   ============================================================ */

const CACHE_NAME   = 'hidrosmart-v2';
const OFFLINE_URL  = './index.html';

const PRECACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
];

/* ---------- INSTALL ---------- */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE))
      .catch(err => console.warn('[SW] precache parcial:', err))
  );
  self.skipWaiting();
});

/* ---------- ACTIVATE ---------- */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME)
          .map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

/* ---------- FETCH ---------- */
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignora requisições cross-origin (fontes Google, etc.)
  if (url.origin !== location.origin) return;

  // Ignora métodos que não sejam GET
  if (request.method !== 'GET') return;

  event.respondWith(
    // Estratégia: Network-first → Cache fallback
    fetch(request)
      .then(response => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        }
        return response;
      })
      .catch(() =>
        caches.match(request)
          .then(cached => cached || caches.match(OFFLINE_URL))
      )
  );
});

/* ---------- MESSAGE ---------- */
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
