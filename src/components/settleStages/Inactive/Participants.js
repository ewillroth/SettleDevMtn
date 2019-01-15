import React, { Component } from "react";
import axios from "axios";

class Participants extends Component {
	constructor(){
		super()
		this.state={
			participants: [],
			map: [],
			update: true
		}
	}
	//triggers rerender after participants are updated
	componentDidMount(){
		axios.get(`/api/settle/${this.props.id}/participants/`)
		.then(response=>{
			this.setState({
			participants: response.data,
			update: !this.state.update
		})})
		.catch(err=>console.log(err))
	}
	//gets participants again if parent adds a participant to db
	componentDidUpdate(prevProps){
		if(this.propsate!==prevProps){
			axios.get(`/api/settle/${this.props.id}/participants/`)
				.then(response => {
					this.setState({
						participants: response.data,
						update: !this.state.update
					})
				})
				.catch(err => console.log(err))
		}
	}

	render() {
		const map = this.state.participants.length > 0 ? this.state.participants.map(
					(e, i) => {
						return (
						<div key={i}>
								<p>User ID</p>
								<p>{e.user_id}</p>
								<p>Suggestions:</p>
								<p>{e.suggestion1}</p>
								<p>{e.suggestion2}</p>
								<p>{e.suggestion3}</p>
						</div>
						)
					}
				) : <></>;
			return(
				<div className="participants">
					<p>Participants</p>
					{map}
				</div>
			)
	}
};

export default Participants;
