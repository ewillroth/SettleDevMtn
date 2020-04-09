import React from "react";
import styled from "styled-components";
import { auth } from "../firebase";
import { firebaseLogout } from "../redux/reducers/userReducer";

const Button = styled.button``;

const SignOutButton = () => {
	const signOut = () => {
		auth.signOut();
		firebaseLogout(null);
	};

	return <Button onClick={signOut}>Sign Out</Button>;
};

export default SignOutButton;
