
self.importScripts('/js/dbhelper.js');

var cache_name = 'resturant-cache';

// install cache
self.addEventListener('install', function(event) {
  console.log('[ServiceWorker] Install');
  event.waitUntil(
    caches.open(cache_name).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll([
        '/',
        '/index.html',
        '/restaurant.html',
        '/css/styles.css',
        '/js/dbhelper.js',
        '/js/main.js',
        '/js/restaurant_info.js',
        '/img/1.webp',
        '/img/2.webp',
        '/img/3.webp',
        '/img/4.webp',
        '/img/5.webp',
        '/img/6.webp',
        '/img/7.webp',
        '/img/8.webp',
        '/img/9.webp',
        '/img/10.webp',
        '/addReview.html'
      ]);
    })
  );
});



// activate cache
self.addEventListener('activate',  event => {
  event.waitUntil(self.clients.claim());
});

// fetch
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request, {ignoreSearch:true}).then(response => {
      return response || fetch(event.request);
    })
  );
});

//wait until connection stablish
self.addEventListener('sync', function(event) {
  if (event.tag == 'myFirstSync') {
    event.waitUntil(DBHelper.kkk());
  }
});

self.addEventListener('push', (event) => {
  console.log('Received a push event', event);

  const options = {
    title: 'I got a message for you!',
    body: 'you are working offline',
    icon: '/img/icon-192x192.png',
    tag: 'tag-for-this-notification',
  }

  event.waitUntil(
    self.registration.showNotification(title, options)
  )
})


