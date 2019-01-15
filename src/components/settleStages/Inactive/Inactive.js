import React, {Component} from "react";
import Header from "../../Header";
import Participants from '../Inactive/Participants';
import axios from "axios";

class Inactive extends Component {
	constructor() {
		super();
		this.state = {
			suggestion1: "",
			suggestion2: "",
			suggestion3: "",
			update: true
		};
	}
	componentDidMount() {
		//adds user to user_settles
		axios
			.put(`/api/settle/${this.props.id}/adduser`)
			.then()
			.catch(err => console.log(err));
	}

	onChange = e => {
		this.setState({
			[e.target.name]: e.target.value
		});
	};

	submitForm = (e) => {
		e.preventDefault()
		axios
			.put(`/api/settle/${this.props.id}/submit`, {
				suggestion1: this.state.suggestion1,
				suggestion2: this.state.suggestion2,
				suggestion3: this.state.suggestion3
			})
			.then()
			.catch();
	};

	onClick = e => {
		//change stage to active
		this.props.changeStage("active");
	};

	render() {
		return (
			<div className="settlecontainer">
				<Header />
				<div className="inactivecontainer">
					<Participants update={this.state.update} id={this.props.id}/>
					<form className="submitlist" onSubmit={this.submitForm}>
						<p>Add your suggestions:</p>
						<input onChange={this.onChange} name="suggestion1" value={this.state.suggestion1} />
						<input onChange={this.onChange} name="suggestion2" value={this.state.suggestion2} />
						<input onChange={this.onChange} name="suggestion3" value={this.state.suggestion3} />
						<button>Submit</button>
					</form>
				</div>
				<button onClick={this.onClick}>Submit</button>
			</div>
		);
	}
};

export default Inactive;
