/* Service worker do HSK 1.
   ATUALIZAR VERSÃO: mude o número abaixo a cada nova versão do app.
   É a única linha que precisa mudar para o celular buscar a versão nova. */
const VERSAO = "v1";

const CACHE = `hsk1-${VERSAO}`;
const ARQUIVOS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icone-192.png",
  "./icone-512.png",
];

self.addEventListener("install", (e) => {
  // assume o controle sem esperar as abas antigas fecharem
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ARQUIVOS)).catch(() => {}));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  // Rede primeiro para não servir versão velha; cache como reserva offline.
  e.respondWith(
    fetch(e.request)
      .then((r) => {
        const copia = r.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copia)).catch(() => {});
        return r;
      })
      .catch(() => caches.match(e.request).then((r) => r || caches.match("./index.html")))
  );
});
