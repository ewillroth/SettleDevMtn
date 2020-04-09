import React from "react";
import * as firebaseui from "firebaseui";
import firebase, { auth } from "../firebase";
import SignOutButton from "./SignOutButton";
import { firebaseLogin } from "../redux/reducers/userReducer";

const Auth = () => {
	firebase.auth().onAuthStateChanged(
		function (user) {
			if (user) {
				// User is signed in.
				const displayName = user.displayName;
				const email = user.email;
				const emailVerified = user.emailVerified;
				const photoURL = user.photoURL;
				const uid = user.uid;
				const phoneNumber = user.phoneNumber;
				const providerData = user.providerData;
				user.getIdToken().then(function (accessToken) {
					const user = {
						displayName: displayName,
						email: email,
						emailVerified: emailVerified,
						phoneNumber: phoneNumber,
						photoURL: photoURL,
						uid: uid,
						accessToken: accessToken,
						providerData: providerData,
					};
					//actionCreator
					firebaseLogin(user);
				});
			} else {
				// User is signed out.
				console.log("No User");
			}
		},
		function (error) {
			console.log(error);
		}
	);

	const uiConfig = {
		autoUpgradeAnonymousUsers: true,
		signInSuccessUrl: "auth",
		signInOptions: [
			firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID,
			firebase.auth.GoogleAuthProvider.PROVIDER_ID,
			firebase.auth.FacebookAuthProvider.PROVIDER_ID,
			firebase.auth.TwitterAuthProvider.PROVIDER_ID,
		],
		tosUrl: "termsofservice",
		privacyPolicyUrl: "privacypolicy",
		callbacks: {
			signInSuccessWithAuthResult: function (authResult, redirectUrl): any {
				const {
					displayName,
					email,
					emailVerified,
					phoneNumber,
					photoURL,
					uid,
					providerData,
					metadata,
				} = authResult.user;

				const { lastSignInTime, creationTime } = metadata;

				const user = {
					displayName,
					email,
					emailVerified,
					phoneNumber,
					photoURL,
					uid,
					providerData,
					lastSignInTime,
					creationTime,
					accessToken: authResult.credential.accessToken,
				};

				firebase
					.app()
					.database()
					.ref("users/" + authResult.user.uid)
					.set(user, () => {
						console.log("finished write");
						window.location.assign("/dashboard");
					});
			},
			signInFailure: function (error) {
				if (error.code !== "firebaseui/anonymous-upgrade-merge-conflict") {
					return Promise.resolve();
				}
				let data = null;
				const cred = error.credential;
				const app = firebase.app();
				const anonymousUser = firebase.auth().currentUser;
				return app
					.database()
					.ref("users/" + firebase.auth().currentUser?.uid)
					.once("value")
					.then(function (snapshot) {
						data = snapshot.val();
						return firebase.auth().signInWithCredential(cred);
					})
					.then(function (user) {
						return app
							.database()
							.ref("users/" + user.uid)
							.set(data);
					})
					.then(function () {
						return anonymousUser?.delete();
					})
					.then(function () {
						console.log("anonymous user converted to guest user");
						data = null;
						window.location.assign("dashboard");
					});
			},
		},
	};

	const ui = new firebaseui.auth.AuthUI(auth);
	ui.start("#firebaseui-auth-container", uiConfig);

	return (
		<>
			<SignOutButton></SignOutButton>
			<div id="firebaseui-auth-container"></div>
		</>
	);
};

export default Auth;
