const CACHE_NAME = "chatbot-cache-v1";
const urlsToCache = [
  "/",
  "index.html",
  "css/styles.css",
  "js/script.js",
  "img/chatbot.png",
  "img/logo.png",
  "video/conscienciencia.mp4"
];

// Instalação do Service Worker
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Ativação do Service Worker
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }));
    })
  );
});

// Fetch dos recursos
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});