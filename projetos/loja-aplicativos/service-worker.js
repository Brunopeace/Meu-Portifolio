const CACHE_NAME = "union-apps-cache-v1"; // Alterar versão do cache ao atualizar
const urlsToCache = [
  "/",
  "/index.html",
  "/css/aplicativos.css",
  "/css/contato.css",
  "/css/dns.css",
  "/css/menu.css",
  "/css/tutoriais.css",
  "/img/logo-padrao.png",
  "/img/192x192.png",
  "/img/512x512.png",
  "/img/p2p-beta1.jpg",
  "/img/p2p-beta2.jpg",
  "/img/p2p-beta3.jpg",
  "/img/p2p-ultra1.jpg",
  "/img/p2p-ultra2.jpg",
  "/img/p2p-ultra3.jpg",
  "/img/union-gold1.jpg",
  "/img/union-gold2.jpg",
  "/img/union-gold3.jpg",
  "/img/union-smarters01.jpg",
  "/img/union-smarters02.jpg",
  "/img/union-smarters03.jpg",
  "/home/aplicativos.html",
  "/home/dns.html",
  "/home/tutoriais.html",
  "/home/contato.html",
  "/js/scripts.js"
];

// Instalando o Service Worker e adicionando arquivos ao cache
self.addEventListener("install", (event) => {
  console.log("[Service Worker] Instalando nova versão...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting(); // Ativa o novo SW imediatamente
});

// Ativando o Service Worker e limpando caches antigos
self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Ativando nova versão...");
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("[Service Worker] Removendo cache antigo:", cache);
            return caches.delete(cache);
          }
        })
      )
    )
  );
  self.clients.claim(); // Faz com que o novo SW assuma o controle imediatamente
});

// Interceptando requisições e retornando do cache, se disponível
self.addEventListener("fetch", (event) => {
  console.log("[Service Worker] Interceptando:", event.request.url);
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Notificar os usuários sobre uma atualização
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting();
  }
});





// Listener para notificações push
self.addEventListener("push", function (event) {
  const data = event.data?.json() || {
    title: "Nova mensagem",
    body: "Você tem uma nova mensagem!",
  };

  const options = {
    body: data.body,
    icon: "/img/192x192.png",
    badge: "/img/192x192.png",
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});