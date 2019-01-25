import React from 'react';
import axios from 'axios';

const LogoutButton = (props) => {
	return (
		<button 
		className="logoutbutton" 
		onClick={()=>{
			axios.get('/auth/logout')
			props.reroute('/')
			}}
		>
			logout
		</button>
	)
}

export default LogoutButton;