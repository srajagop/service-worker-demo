const VERSION = '1398946769990';

const CACHE_TYPE = 'app-';

const CACHE_NAME = CACHE_TYPE + VERSION;


/*// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
  'messagingSenderId': '766910702567'
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
// [END initialize_firebase_in_sw]

messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[serviceWorker.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/images/icons/firebase-logo.png'
  };

  return self.registration.showNotification(notificationTitle,
      notificationOptions);
});*/


var appUrls = [
        'https://fonts.googleapis.com/css?family=Roboto:200,300,400,500,700'
];

const swlog = function(){
	 var args = Array.prototype.slice.call(arguments);
	 args.unshift('[SW] :');
	 console.log.apply(console, args);
}
 
	
	
self.addEventListener('install', event => {
  // Do install stuff
	swlog('sw Installing');
	event.waitUntil(
			 caches.open(CACHE_NAME)
		      .then(function(cache) {
		        return cache.addAll(appUrls);
		      }).then(function(){
		    	  swlog('sw Installed');
		    	  swlog("sw cache open", CACHE_NAME);
		    		self.skipWaiting();
		      }).catch(function(error){
		    	  swlog('Failed to cache', error);
		      })
	)
	
});

self.addEventListener('activate', event => {
  // Do activate stuff: This will come later on.
	swlog('Active');
	var cacheWhitelist = [];
	
	event.waitUntil(
			caches.keys().then(function(cacheNames) {
				return Promise.all(
				        cacheNames.map(function(cacheName) {
				        		if(cacheName !== CACHE_NAME){
				        			swlog("deleting cache", cacheName)
				        			return caches.delete(cacheName);
				        		}
				        })
				     );
			}).then(function() {
			      return self.clients.claim();
			})	
	)
});

self.addEventListener('fetch', event => {
	
	  event.respondWith(
	    caches.match(event.request).then(function(response) {
	        // Cache hit - return response
	    	swlog("sw response", response);
	        if (response) {
	          return response;
	        }
	        return fetch(event.request).then(function(response) {
	        	if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }
	        	
	        	var clonedResponse = response.clone();
	        	
	        	  caches.open(CACHE_NAME).then(function(cache) {
	        		 // swlog("sw caching", event.request);
                      cache.put(event.request, clonedResponse);
                  });
	        	  return response;
	        });
	      })
	  );
});

self.addEventListener('push', function(event) {
	  console.log('[Service Worker] Push Received.');
	  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

	  const title = 'Test Push';
	  const options = {
	    body: 'Yay it works.',
	    icon: '/firebase-logo.png',
	    badge: '/firebase-logo.png'
	  };

	  event.waitUntil(self.registration.showNotification(title, options));
	});
