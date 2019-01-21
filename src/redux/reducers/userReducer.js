import axios from 'axios';

//initial state
const initialState = {
	user: { user_id: 1, name: 'guest', email: 'guest', profilepic: '' },
	email: '',
	name: '',
	password: '',
};

//action types
const GET_USER = 'GET_USER'
const UPDATE_EMAIL = 'UPDATE_EMAIL'
const UPDATE_NAME= 'UPDATE_NAME'
const UPDATE_PASSWORD = 'UPDATE_PASSWORD'
const RESET_FORM = 'RESET_FORM'
const UPDATE_PICTURE = 'UPDATE_PICTURE'
const ADD_USER = 'ADD_USER'

//action creators
export const getUser = () => {
	return {
		type: GET_USER,
		payload: axios.get('/auth/me')
	}
}
export const updateEmail = (email) => {
	return {
		type: UPDATE_EMAIL,
		payload: email
	}
}
export const updateName = (name) => {
	return {
		type: UPDATE_NAME,
		payload: name
	}
}
export const updatePassword = (password) => {
	return {
		type: UPDATE_PASSWORD,
		payload: password
	}
}
export const resetForm = () => {
	return {
		type: RESET_FORM,
		payload: ''
	}
}

export const updatePicture = (picture) => {
	return {
		type: UPDATE_PICTURE,
		payload: axios.put('/auth/picture', {picture})
	}
}

export const addUser = (user) => {
	return {
		type: ADD_USER,
		payload: user
	}
}

//reducer
export default function userReducer(state = initialState, action) {
	switch (action.type) {
		case `${GET_USER}_FULFILLED`:
			return {
				...state,
				user: action.payload.data
			}
		case `${GET_USER}_REJECTED`:
			return {
				...state
			}
		case UPDATE_EMAIL:
			return {
				...state, 
				email: action.payload
			}
		case UPDATE_NAME:
			return {
				...state,
				name: action.payload
			}
		case UPDATE_PASSWORD:
			return {
				...state,
				password: action.payload
			}
		case `${UPDATE_PICTURE}_FULFILLED`:
			return {
				...state,
				user: {...state.user, profilepic:action.payload}
			}
		case `${UPDATE_PICTURE}_REJECTED`:
			return {
				...state
			}
		case RESET_FORM:
			return {
				...state,
				name: '',
				email: '',
				password: ''
			}
		case ADD_USER:
			return {
				...state,
				user: action.payload 
			}
		default:
			return state;
	}
};