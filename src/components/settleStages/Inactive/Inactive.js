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
			update: true,
			user: {},
			creator: false
		};
	}
	componentDidMount() {
		//adds user to user_settles
		axios
			.put(`/api/settle/${this.props.id}/adduser`)
			.then()
			.catch(err => console.log(err));
		//gets user from session- used to verify if user is creator
		axios.get('/auth/me')
		.then(response=>{
			this.setState({user:response.data})
			if(response.data.user_id===this.props.creator){
				this.setState({
					creator: true
				})
			}
			else{
				this.setState({
					creator: false
				})
			}
		})
		.catch(err=>console.log(err))
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
		axios.put(`/api/settle/${this.props.id}/stage`, { status: 'active' })
			.then(() => {
				this.props.changeStage('active')
			})
			.catch(err => console.log(err))
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
				{this.state.creator
				?
				<button onClick={this.onClick}>Start Settle</button>
				:
				<></>
				}
			</div>
		);
	}
};

export default Inactive;
