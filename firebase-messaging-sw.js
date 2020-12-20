// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.1.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.1.2/firebase-messaging.js');
importScripts('https://www.gstatic.com/firebasejs/8.1.2/firebase-auth.js');
importScripts('https://www.gstatic.com/firebasejs/8.1.2/firebase-firestore.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object

firebase.initializeApp({
 	apiKey: "AIzaSyB8v8pD2b70NHbEVcR25KO6opvP_s8BYyw",
	authDomain: "pdpu-medical-website.firebaseapp.com",
	databaseURL: "https://pdpu-medical-website.firebaseio.com",
	projectId: "pdpu-medical-website",
	storageBucket: "pdpu-medical-website.appspot.com",
	messagingSenderId: "216334365459",
	appId: "1:216334365459:web:14c70ae25afcab9b6ce0e6"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

// messaging.onMessage((payload) => {
//   console.log('Message received. ', payload);
//   // ...
// });

var dName = "";

// firebase.auth().onAuthStateChanged(user3 => {
//   if (user3) {
//   	console.log("[service workder.js] Auth Logged in : "+user3.email);
//   	firebase.firestore().doc(`doctors/${user3.uid}`).get().then((snap) => {
//   		window.dName = snap.data().name;
//   		console.log("dName : "+window.dName);
//   	})

//   }
//  })

messaging.setBackgroundMessageHandler((payload) => {
  console.log('Message received. [service workder.js]', payload);

	const title = "MediTech HealthCare";
	const options = {
		body: `New AI Disease Added`,
		icon: 'https://firebasestorage.googleapis.com/v0/b/pdpu-medical-website.appspot.com/o/email%2FOGFB4B0.jpg?alt=media&token=1d056122-1fa6-4b73-b427-1c9986a2ebd7'
	};
	return self.registration.showNotification(title,options);
})
