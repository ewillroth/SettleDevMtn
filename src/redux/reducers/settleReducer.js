import axios from 'axios';

//initial state
const initialState = {
	settle: {}
};

//action types
const CREATE_SETTLE = 'CREATE_SETTLE'

//action creators
export const createSettle = (user_id) => {
	return {
		type: CREATE_SETTLE,
		payload: axios.post('/api/settle', {user_id})
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
		default:
			return state;
	}
};