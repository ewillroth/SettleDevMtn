import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import promiseMiddleware from "redux-promise-middleware";
import userReducer from "./reducers/userReducer";
import settleReducer from './reducers/settleReducer';

//devtools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const enhancer = composeEnhancers(applyMiddleware(promiseMiddleware()));

//combine reducers
const combinedReducers = combineReducers({
	userRdcr: userReducer,
	settleRdcr: settleReducer
});

const store = createStore(combinedReducers, enhancer);

export default store;
