const CACHE_NAME = "meshtastic-cache";
const urlsToCache = [
  "/meshtastic-configurator/",
  "/meshtastic-configurator/index.html",
  "/meshtastic-configurator/assets/icon-192x192.png",
  "/meshtastic-configurator/assets/icon-512x512.png",
  // Files will be dynamically handled
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      // Open cache and fetch the manifest for hashed files
      const manifest = await fetch("/meshtastic-configurator/manifest.json").then(response => response.json());

      // Add all hashed files (CSS/JS) to the cache
      const urlsToCache = [
        "/meshtastic-configurator/",
        "/meshtastic-configurator/index.html",
        `/meshtastic-configurator/${manifest?.['src/main.ts']?.file}`,
        `/meshtastic-configurator/${manifest?.['src/styles.css']?.file}`,
        "/meshtastic-configurator/assets/icon-192x192.png",
        "/meshtastic-configurator/assets/icon-512x512.png"
      ];

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
