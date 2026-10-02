// QSO-Logbuch Service Worker
// Bei jedem Update der App diese Versionsnummer erhöhen, damit alle Geräte die neue Version laden.
const VERSION = 'v5';
const APP = 'qso-app-' + VERSION;
const LIBS = 'qso-libs-v1';
const TILES = 'qso-tiles-de-v1';
const MAX_TILES = 1500;

const APP_FILES = ['./', './index.html', './manifest.webmanifest',
  './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png',
  './lib/leaflet/leaflet.js', './lib/leaflet/leaflet.css', './firebase-config.js',
  './lib/firebase/firebase-app-compat.js', './lib/firebase/firebase-auth-compat.js', './lib/firebase/firebase-firestore-compat.js'];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    await (await caches.open(APP)).addAll(APP_FILES);
    self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys())
      if (![APP, LIBS, TILES].includes(k)) await caches.delete(k);
    await self.clients.claim();
  })());
});

async function trimTiles() {
  const c = await caches.open(TILES); const keys = await c.keys();
  for (let i = 0; i < keys.length - MAX_TILES; i++) await c.delete(keys[i]);
}

self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Ortssuche immer live
  if (url.hostname.includes('nominatim')) return;

  // App selbst: zuerst Netz (für Updates), sonst Offline-Kopie
  if (url.origin === location.origin) {
    e.respondWith((async () => {
      try {
        const res = await fetch(req);
        if (res.ok) (await caches.open(APP)).put(req, res.clone());
        return res;
      } catch (err) {
        return (await caches.match(req, {ignoreSearch: true})) ||
               (req.mode === 'navigate' ? caches.match('./index.html') : Response.error());
      }
    })());
    return;
  }

  // Kartenkacheln: aus dem Zwischenspeicher, sonst laden und merken
  if (url.hostname === 'tile.openstreetmap.de') {
    e.respondWith((async () => {
      const c = await caches.open(TILES); const hit = await c.match(req);
      if (hit) return hit;
      try { const res = await fetch(req); if (res.ok || res.type === 'opaque') { c.put(req, res.clone()); trimTiles(); } return res; }
      catch (err) { return Response.error(); }
    })());
    return;
  }

  // Schriften: zuerst Zwischenspeicher
  if (/fonts\.(googleapis|gstatic)\.com/.test(url.hostname)) {
    e.respondWith((async () => {
      const c = await caches.open(LIBS); const hit = await c.match(req);
      if (hit) return hit;
      try { const res = await fetch(req); c.put(req, res.clone()); return res; }
      catch (err) { return Response.error(); }
    })());
  }
});
