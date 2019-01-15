import React, { Component } from "react";
import axios from "axios";

class Participants extends Component {
	componentDidMount(){
		axios.get(`/api/settle/${this.props.id}/participants/`)
		.then()
		.catch(err=>console.log(err))
	}

	render() {
			return(
				<div className="participants">
					<p>Participants</p>
				</div>
			)
	}
};

export default Participants;
