/*
 * sw.js — Eski "OOP Neural Knowledge Graph" sürümü bir service worker ile önbellek tutuyordu.
 * Yeni sürüm (OOP Interactive Lab) service worker kullanmaz. Bu dosya, eski worker'ı kurmuş
 * tarayıcılarda önbelleği temizler, kendini kaldırır ve sayfayı yeni sürümle yeniden yükler.
 */
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => caches.delete(k)));
    await self.registration.unregister();
    const clients = await self.clients.matchAll({ type: 'window' });
    clients.forEach((c) => c.navigate(c.url));
  })());
});
