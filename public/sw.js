const CACHE_NAME = "meshtastic-cache";
const urlsToCache = [
  "/meshtastic-configurator/",
  "/meshtastic-configurator/index.html",
  "/meshtastic-configurator/src/styles.css",
  "/meshtastic-configurator/src/main.ts",
  "/meshtastic-configurator/assets/icon-192x192.png",
  "/meshtastic-configurator/assets/icon-512x512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
