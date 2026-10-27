/* =========================================================================
   sw.js — Service Worker (çevrimdışı çalışma)
   -------------------------------------------------------------------------
   Strateji:
     - install  : uygulama kabuğunu (HTML, CSS, JS, ikonlar) önbelleğe al
     - activate : eski sürüm önbelleklerini sil
     - fetch    :
         * Sayfa gezintisi (navigate) → network-first: çevrimiçiyken hep
           güncel index.html, çevrimdışıyken önbellekteki kopya.
         * Aynı kökenli statik dosyalar → stale-while-revalidate: önbellekten
           anında yanıt ver, arka planda ağdan tazele.
         * Google Fonts → stale-while-revalidate (ayrı runtime önbelleği).

   Dosyaları değiştirip yayınladığında CACHE_VERSION'ı artır; böylece
   kullanıcılar eski önbelleği bırakıp yeni sürümü alır.
   ========================================================================= */

const CACHE_VERSION = "v3"; // v3: DAG topolojisi, ilerleme sistemi, Müfredat Modu
const STATIC_CACHE = `oop-neural-static-${CACHE_VERSION}`;
const RUNTIME_CACHE = `oop-neural-runtime-${CACHE_VERSION}`;

// Yollar sw.js'e göre görelidir → GitHub Pages alt klasöründe de çalışır
const PRECACHE_URLS = [
  "./",
  "./index.html",
  "./style.css",
  "./manifest.json",
  "./js/data.js",
  "./js/highlight.js",
  "./js/physics.js",
  "./js/curriculum.js",
  "./js/renderer.js",
  "./js/panel.js",
  "./js/search.js",
  "./js/main.js",
  "./icons/icon.svg",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
];

const FONT_HOSTS = ["fonts.googleapis.com", "fonts.gstatic.com"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting()) // yeni sürüm beklemeden devreye girsin
  );
});

self.addEventListener("activate", (event) => {
  const keep = new Set([STATIC_CACHE, RUNTIME_CACHE]);
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => !keep.has(key)).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()) // açık sekmeleri hemen kontrol et
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request));
  } else if (url.origin === self.location.origin) {
    event.respondWith(staleWhileRevalidate(request, STATIC_CACHE, event));
  } else if (FONT_HOSTS.includes(url.hostname)) {
    event.respondWith(staleWhileRevalidate(request, RUNTIME_CACHE, event));
  }
  // Diğer istekler: Service Worker karışmaz, tarayıcı normal davranır
});

async function networkFirst(request) {
  const cache = await caches.open(STATIC_CACHE);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    // Çevrimdışı: bu sayfanın kopyası yoksa uygulama kabuğuna düş
    return (await cache.match(request)) || (await cache.match("./index.html")) || Response.error();
  }
}

async function staleWhileRevalidate(request, cacheName, event) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then((response) => {
      // opaque: CORS'suz çapraz köken yanıtı (font dosyaları) — yine de saklanabilir
      if (response.ok || response.type === "opaque") cache.put(request, response.clone());
      return response;
    })
    .catch(() => null);

  if (cached) {
    event.waitUntil(network); // arka planda tazele
    return cached;
  }
  return (await network) || Response.error();
}
