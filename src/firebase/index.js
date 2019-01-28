import 'firebase/storage'

var firebase = require('firebase/app')

console.log(process.env.REACT_APP_FIREBASE_API)

var config = {
	apiKey: process.env.REACT_APP_FIREBASE_API,
	authDomain: "tacotracker2019.firebaseapp.com",
	databaseURL: "https://tacotracker2019.firebaseio.com",
	projectId: "tacotracker2019",
	storageBucket: "gs://settle-io.appspot.com/",
	messagingSenderId: "985342258862"
};
firebase.initializeApp(config);

const storage = firebase.storage()

export {
	storage, firebase as default
}