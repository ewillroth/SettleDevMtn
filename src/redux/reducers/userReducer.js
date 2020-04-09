import axios from "axios";

//initial state
const initialState = {
	user: {},
};

//action types
const GET_USER = "GET_USER";
const UPDATE_EMAIL = "UPDATE_EMAIL";
const UPDATE_NAME = "UPDATE_NAME";
const UPDATE_PASSWORD = "UPDATE_PASSWORD";
const RESET_FORM = "RESET_FORM";
const UPDATE_PICTURE = "UPDATE_PICTURE";
const ADD_USER = "ADD_USER";
const FIREBASE_LOGIN = "FIREBASE_LOGIN";
const FIREBASE_LOGOUT = "FIREBASE_LOGOUT";

//action creators
export const getUser = () => {
	return {
		type: GET_USER,
		payload: axios.get("/auth/me"),
	};
};
export const updateEmail = (email) => {
	return {
		type: UPDATE_EMAIL,
		payload: email,
	};
};
export const updateName = (name) => {
	return {
		type: UPDATE_NAME,
		payload: name,
	};
};
export const updatePassword = (password) => {
	return {
		type: UPDATE_PASSWORD,
		payload: password,
	};
};
export const resetForm = () => {
	return {
		type: RESET_FORM,
		payload: "",
	};
};

export const updatePicture = (picture) => {
	return {
		type: UPDATE_PICTURE,
		payload: axios.put("/auth/picture", { picture }),
	};
};

export const addUser = (user) => {
	return {
		type: ADD_USER,
		payload: user,
	};
};
export const firebaseLogin = (user) => {
	return {
		type: FIREBASE_LOGIN,
		payload: user,
	};
};
export const firebaseLogout = (user) => {
	return {
		type: FIREBASE_LOGOUT,
		payload: user,
	};
};

//reducer
export default function userReducer(state = initialState, action) {
	switch (action.type) {
		case `${GET_USER}_FULFILLED`:
			return {
				...state,
				user: action.payload.data,
			};
		case `${GET_USER}_REJECTED`:
			return {
				...state,
			};
		case UPDATE_EMAIL:
			return {
				...state,
				email: action.payload,
			};
		case UPDATE_NAME:
			return {
				...state,
				name: action.payload,
			};
		case UPDATE_PASSWORD:
			return {
				...state,
				password: action.payload,
			};
		case `${UPDATE_PICTURE}_FULFILLED`:
			return {
				...state,
				user: { ...state.user, profilepic: action.payload.data.profilepic },
			};
		case `${UPDATE_PICTURE}_REJECTED`:
			return {
				...state,
				user: { ...state, profilepic: null },
			};
		case RESET_FORM:
			return {
				...state,
				name: "",
				email: "",
				password: "",
			};
		case ADD_USER:
			return {
				...state,
				user: action.payload,
			};
		case FIREBASE_LOGIN:
			return {
				...state,
				user: action.payload,
			};
		case FIREBASE_LOGOUT:
			return {
				...state,
				user: action.payload,
			};
		default:
			return state;
	}
}
