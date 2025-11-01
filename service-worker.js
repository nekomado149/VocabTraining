const CACHE_NAME = 'vocab-trainer-cache-v1';
const urlsToCache = [
  './',
  'index.html',
  'manifest.json',
  // Fügen Sie hier die Pfade zu Ihren Icons hinzu, sobald diese existieren
  'icons/icon-192x192.png',
  'icons/icon-512x512.png'
];

// Installation des Service Workers und Cachen der statischen Assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Abfangen von Anfragen und Bereitstellen aus dem Cache (Cache-first Strategie)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache Treffer - Rückgabe des gecachten Assets
        if (response) {
          return response;
        }
        
        // Kein Cache Treffer - Anfrage an das Netzwerk
        return fetch(event.request).catch(() => {
            // Wenn Netzwerk fehlschlägt, versuchen Sie, die Hauptseite zurückzugeben
            return caches.match('index.html');
        });
      })
  );
});

// Aktivierung: Aufräumen alter Caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});