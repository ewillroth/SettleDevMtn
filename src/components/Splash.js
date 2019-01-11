import React from 'react';

const Splash = () => {
	return (
		<>
		<div className="splash-nav">
			<button>Login</button>
			<button>Register</button>
		</div>
		<div className="splash-line"></div>
		<div className="splash-main">
			<h1 className="logo">Settle!</h1>
			<p>Settle is a tool to help groups make decisions. Each person writes down three unique suggestions, suggestions are crossed off one at a time, and the last suggestion remaining is the winner.</p>
			<button>Start</button>
		</div>
		</>
	)
}

export default Splash