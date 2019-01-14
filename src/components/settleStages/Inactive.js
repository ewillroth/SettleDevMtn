import React, {Component} from "react";
import Header from "../Header";

class Inactive extends Component{
	//checks if there is a user on session
	componentDidMount() {
		this.props.getUser()
		.then()
		.catch()
	}

	
	render(){
		return (
			<>
			<Header />
			<p>Inactive</p>
			</>
		)
	}
};

export default Inactive;
