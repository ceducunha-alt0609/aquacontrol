// HidroSmart SW v15 — cache isolado / GitHub Pages /aquacontrol/
const CACHE = 'hidrosmart-v15-isolated-cache';
const CACHE_PREFIX = 'hidrosmart-';
const OFFLINE_URLS = ['/aquacontrol/', '/aquacontrol/index.html'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(OFFLINE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(k => k.startsWith(CACHE_PREFIX) && k !== CACHE)
          .map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET') return;

  // O HidroSmart só interfere em recursos do próprio escopo.
  if (url.origin === self.location.origin && !url.pathname.startsWith('/aquacontrol/')) return;

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/aquacontrol/index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(r => r || fetch(event.request))
  );
});
