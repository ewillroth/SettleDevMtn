import axios from 'axios';

//initial state
const initialState = {
	user: { user_id: 0, name: 'guest', email: 'guest' },
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
export const resetForm = (user) => {
	return {
		type: RESET_FORM,
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
				...state,
				user: {user_id: 0, name: 'guest', email: 'guest'}
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
		case RESET_FORM:
			return {
				...state,
				user: action.payload,
				name: '',
				email: '',
				password: ''
			}
		default:
			return state;
	}
};