const CACHE = 'xs-prescricao-shell-v1';
const ASSETS = ['./', './index.html', './styles.css', './app.js', './config.js', './manifest.webmanifest', './offline.html'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith('xs-prescricao-shell-') && key !== CACHE).map(key => caches.delete(key))
  )));
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || event.request.method !== 'GET') return;

  event.respondWith(caches.open(CACHE).then(cache => cache.match(event.request).then(hit => hit || fetch(event.request).catch(() => {
    if (event.request.mode === 'navigate') return cache.match('./offline.html');
    throw new Error('offline');
  }))));
});
