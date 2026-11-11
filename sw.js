// Wort für Wort — offline cache. Povećaj VERZIJU kad mijenjaš datoteke.
const PREFIX = 'wortfuerwort-';
const VERZIJA = PREFIX + 'v1';
const FILES = ['./', 'index.html', 'app.js', 'data.js', 'manifest.json', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(VERZIJA).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  // briše samo vlastite stare cacheve (Kotoba je na istoj github.io domeni)
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith(PREFIX) && k !== VERZIJA).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request, { cacheName: VERZIJA }).then(r => r || fetch(e.request).then(res => {
    if (res.ok && (e.request.url.startsWith(self.registration.scope) || e.request.url.includes('fonts.g'))) {
      const copy = res.clone(); caches.open(VERZIJA).then(c => c.put(e.request, copy));
    }
    return res;
  }).catch(() => caches.match('index.html', { cacheName: VERZIJA }))));
});
