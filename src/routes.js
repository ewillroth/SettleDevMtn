import React from 'react'
import { Switch, Route } from 'react-router-dom';
import Splash from './components/Splash';
import Login from './components/Login';
import Register from './components/Register';
import Settle from './components/Settle';
import Dashboard from './components/Dashboard';

export default (
	<Switch>
		<Route path="/login" component={Login}></Route>
		<Route path="/register" component={Register}></Route>
		<Route path="/dashboard" component={Dashboard}></Route>
		<Route path="/settle" component={Settle}></Route>
		<Route path="/" component={Splash}></Route>
	</Switch>
)