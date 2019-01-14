import React, {Component} from "react";
import Header from "../../Header";
import Participants from '../Inactive/Participants';
import axios from "axios";

class Inactive extends Component{
	constructor(){
		super()
		this.state={
			suggestion1: '',
			suggestion2: '',
			suggestion3: ''
		}
	}
	componentDidMount(){
		//check if there is a user on session
	}

	onChange = (e) => {
		this.setState({
			[e.target.name] : e.target.value
		})
	}

	submitForm= () =>{
		axios.put('/api/settle/submit', {suggestion1: this.state.suggestion1, suggestion2: this.state.suggestion2, suggestion3: this.state.suggestion3})
		.then()
		.catch()
	}

	onClick = (e) => {
		//change stage to active
		this.props.changeStage("active");
	}
	
	render(){
		return (
			<div className="settlecontainer">
				<Header />
				<div className="inactivecontainer">
					<Participants />
					<form className="submitlist" onSubmit={this.submitForm}>
							<p>Add your suggestions:</p>
							<input name="suggestion1" value={this.state.suggestion1}></input>
							<input name="suggestion2" value={this.state.suggestion2}></input>
							<input name="suggestion3" value={this.state.suggestion3}></input>
							<button>Submit</button>
					</form>
				</div>
				<button onClick={this.onClick}>Submit</button>
			</div>
		)
	}
};

export default Inactive;
