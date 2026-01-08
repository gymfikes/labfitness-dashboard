self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  clients.claim();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .then(response => response)
      .catch(() =>
        new Response("Offline", {
          status: 200,
          headers: { "Content-Type": "text/plain" }
        })
      )
  );
});
