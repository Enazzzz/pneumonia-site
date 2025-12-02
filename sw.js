/**
 * SERVICE WORKER
 * 
 * Enables PWA capabilities for offline access and faster loading.
 * Features:
 * - Caches static assets
 * - Offline fallback
 * - Fast loading on repeat visits
 * 
 * Note: Service workers only work over HTTPS or localhost
 */

const CACHE_NAME = 'pneumonia-site-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/main.js',
  '/js/modules/particles.js',
  '/js/modules/parallax.js',
  '/js/modules/breathing.js',
  '/js/modules/quiz.js',
  '/js/modules/smooth-scroll.js',
  '/js/modules/micro-interactions.js',
  '/js/modules/theme-toggle.js',
  '/js/modules/charts.js',
  '/js/modules/timeline.js',
  '/js/modules/custom-cursor.js',
  '/js/modules/nav-highlights.js',
  '/js/libs/gsap.min.js',
  '/js/libs/ScrollTrigger.min.js',
  '/js/libs/ScrollToPlugin.min.js',
  '/assets/svg/lungs.svg',
  '/assets/svg/icons.svg'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching assets');
        return cache.addAll(urlsToCache);
      })
      .catch((err) => {
        console.error('[SW] Cache failed:', err);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
      .catch(() => {
        // Offline fallback
        if (event.request.destination === 'document') {
          return caches.match('/index.html');
        }
      })
  );
});

