// HidroSmart SW v14 — Gesture/Icon Fix / GitHub Pages /aquacontrol/
const CACHE = 'hidrosmart-v14-gesture-icon-fix';
const OFFLINE_URLS = ['/aquacontrol/', '/aquacontrol/index.html'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(OFFLINE_URLS)));
});
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).catch(() => caches.match('/aquacontrol/index.html')));
    return;
  }
  event.respondWith(caches.match(event.request).then(r => r || fetch(event.request)));
});
