import axios from 'axios';

//initial state
const initialState = {
	settle: {},
	participants: {}
};

//action types
const CREATE_SETTLE = 'CREATE_SETTLE'
const GET_PARTICIPANTS = 'GET_PARTICIPANTS'

//action creators
export const createSettle = (user_id) => {
	return {
		type: CREATE_SETTLE,
		payload: axios.post('/api/settle', {user_id})
	}
}
export const getParticipants = (settle_id) => {
	return {
		type: GET_PARTICIPANTS,
		payload: axios.get(`/api/settle/${settle_id}/participants`)
	}
}

//reducer
export default function settleReducer(state = initialState, action) {
	switch (action.type) {
		case `${CREATE_SETTLE}_FULFILLED`:
			return {
				...state,
				settle: action.payload.data
			}
		case `${CREATE_SETTLE}_REJECTED`:
			return {
				...state
			}
		case `${GET_PARTICIPANTS}_FULFILLED`:
			return {
				...state,
				participants: action.payload.data
			}
		case `${GET_PARTICIPANTS}_REJECTED`:
			return {
				...state
			}
		default:
			return state;
	}
};