// sw.js - This file needs to be in the root of the directory to work,
//         so do not move it next to the other scripts

const CACHE_NAME = 'lab-7-starter';

const recipes = [
  '/',
  'https://introweb.tech/assets/json/ghostCookies.json',
  'https://introweb.tech/assets/json/birthdayCake.json',
  'https://introweb.tech/assets/json/chocolateChip.json',
  'https://introweb.tech/assets/json/stuffing.json',
  'https://introweb.tech/assets/json/turkey.json',
  'https://introweb.tech/assets/json/pumpkinPie.json'
];


// Once the service worker has been installed, feed it some initial URLs to cache
self.addEventListener('install', function (event) {
  /**
   * TODO - Part 2 Step 2
   * Create a function as outlined above
   */

  //Citation: This code is not mine! It's from the Google tutorial on Service Workers.
  
   event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(recipes);
      })
  );
  
  

});

/**
 * Once the service worker 'activates', this makes it so clients loaded
 * in the same scope do not need to be reloaded before their fetches will
 * go through this service worker
 */
self.addEventListener('activate', function (event) {
  /**
   * TODO - Part 2 Step 3
   * Create a function as outlined above, it should be one line
   */

  //Citation: This code is not mine! It's from the Google tutorial on Service Workers.

  

  var cacheAllowlist = [CACHE_NAME];

   event.waitUntil(
     caches.keys().then(function(cacheNames) {
       return Promise.all(
         cacheNames.map(function(cacheName) {
           if (cacheAllowlist.indexOf(cacheName) === -1) {
             return caches.delete(cacheName);
           }
         })
       );
     })
   );
  
   
});

// Intercept fetch requests and store them in the cache
self.addEventListener('fetch', function (event) {
  /**
   * TODO - Part 2 Step 4
   * Create a function as outlined above
   */

  //Citation: This code is not mine! It's from the Google tutorial on Service Workers.
 
   
   event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
    
  
});
