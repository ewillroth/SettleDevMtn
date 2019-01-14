import React from 'react';
import {Link} from 'react-router-dom';
import NewSettle from './NewSettle';

const Splash = (props) => {
	return (
		<>
		<div className="splash-nav">
			<Link to="/login">Login</Link>
			<Link to="/register">Register</Link>
		</div>
		<div className="splash-line"></div>
		<div className="splash-main">
			<h1 className="logo">Settle!</h1>
			<p>Settle is a tool to help groups make decisions. Each person writes down three unique suggestions, suggestions are crossed off one at a time, and the last suggestion remaining is the winner.</p>
		<NewSettle reroute={(str) => props.history.push(str)} />
		</div>
		</>
	)
}

export default Splash;