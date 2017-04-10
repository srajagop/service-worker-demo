importScripts('https://www.gstatic.com/firebasejs/3.7.3/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.7.3/firebase-messaging.js');

var config = {
	apiKey : "AIzaSyBJgwBkaHY1NBsvdk90BatrZVhgWFqzjRs",
	authDomain : "service-worker-demo-5e124.firebaseapp.com",
	databaseURL : "https://service-worker-demo-5e124.firebaseio.com",
	storageBucket : "service-worker-demo-5e124.appspot.com",
	messagingSenderId : "766910702567"
};
firebase.initializeApp(config);

//Retrieve an instance of Firebase Messaging so that it can handle background
//messages.
const messaging = firebase.messaging();
//[END initialize_firebase_in_sw]

//If you would like to customize notifications that are received in the
//background (Web app is closed or not in browser focus) then you should
//implement this optional method.
//[START background_handler]
messaging.setBackgroundMessageHandler(function(payload) {
console.log('[firebase-messaging-sw.js] Received background message ', payload);
// Customize notification here
const notificationTitle = payload.notification.title;
const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon
};

return self.registration.showNotification(notificationTitle,
   notificationOptions);
});
//[END background_handler]
