import firebase from "firebase";

const config = {
	apiKey: process.env.REACT_APP_FIREBASE_API,
	authDomain: "settle-io.firebaseapp.com",
	databaseURL: "https://settle-io.firebaseio.com",
	projectId: "settle-io",
	storageBucket: "gs://settle-io.appspot.com/",
	messagingSenderId: "985342258862",
};
firebase.initializeApp(config);

const storage = firebase.storage();
const database = firebase.database();
const auth = firebase.auth();

export { auth, storage, database, firebase as default };
