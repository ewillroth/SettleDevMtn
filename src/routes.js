import React from 'react'
import { Switch, Route } from 'react-router-dom';
import Splash from './components/Splash/Splash';

export default (
	<Switch>
		<Route path="/" component={Splash}></Route>
	</Switch>
)