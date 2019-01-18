import React, {Component} from "react";
import {connect} from 'react-redux'
import axios from "axios";
import Header from "../../Header";
import Participants from '../Inactive/Participants';
import {getUser} from '../../../redux/reducers/userReducer';
import {getParticipants} from '../../../redux/reducers/settleReducer';


class Inactive extends Component {
	constructor(props) {
		super(props);
		this.state = {
			suggestion1: "",
			suggestion2: "",
			suggestion3: "",
			creator: false,
			alldone: false,
			done: false,
			update: false,
			suggestions: [],
			participants: 0,
			numberofsuggestions: 0
		};
	}
	componentDidMount() {
		//adds user to user_settles
		axios
			.put(`/api/settle/${this.props.id}/adduser`)
			.then(()=>{
				this.setState({update:!this.state.update})
			})
			.catch(err => console.log(err));
		
		//gets user from session- used to verify if user is creator
		this.props.getUser()
		.then(()=>{
			if(this.props.user.user_id===this.props.creator){
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

		//gets participants from user_settles
		this.props.getParticipants(this.props.id)
		.then(()=>{
			this.setState({
				participants: this.props.participants.length
			})
		})
		.catch(err=>console.log(err))

		//gets suggestions = used to verify if all users have submitted their suggestions
		axios.get(`/api/settle/${this.props.id}/suggestions`)
		.then(response=>{
			this.setState({
				numberofsuggestions: response.data.length
			})
		})
		.catch(err=>console.log(err))
	}

	componentDidUpdate(prevProps,prevState){
		if(prevState.done !== this.state.done){
			this.props.getParticipants(this.props.id)
				.then(() => {
					this.setState({
						participants: this.props.participants.length
					})
				})
				.catch(err => console.log(err))
			
			//gets suggestions = used to verify if all users have submitted their suggestions
			axios.get(`/api/settle/${this.props.id}/suggestions`)
				.then(response => {
					this.setState({
						numberofsuggestions: response.data.length
					})
				})
				.catch(err => console.log(err))
			
		}
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
			.then(response=>{
				this.setState({
					update:!this.state.update,
					done: response.data.donesubmitting
				})
				axios.get(`/api/settle/${this.props.id}/usersuggestions`)
				.then(response=>{
					let suggestions = response.data.map((e,i)=>e.suggestion)
					this.setState({suggestions})
				})
				.catch(err=>console.log(err))
			})
			.catch(err=>alert(err.response.request.response));
	};

	onClick = e => {
		//randomly assign one of the participants to cross off first and sets the stage to active
		axios.get(`/api/settle/${this.props.id}/start`).then(()=>this.props.changeStage('active'))
	};

	render() {
		return <div className="inactive">
				<Header />
				<div className="inactivecontainer">
					<Participants number={this.state.participants} stage="inactive" id={this.props.id} />
					{//removes the form once user has submitted all suggestions
					this.state.done
					? 
					<ul className="usersuggestions">
						<li>{this.state.suggestions[0]}</li>
						<li>{this.state.suggestions[1]}</li>
						<li>{this.state.suggestions[2]}</li>
					</ul> 
					: //displays form if user has submitted all suggestions
					<form className="submitlist" onSubmit={this.submitForm}>
						<p>Add your suggestions:</p>
						<input onChange={this.onChange} name="suggestion1" value={this.state.suggestion1} />
						<input onChange={this.onChange} name="suggestion2" value={this.state.suggestion2} />
						<input onChange={this.onChange} name="suggestion3" value={this.state.suggestion3} />
						<button>Submit</button>
					</form>
					}
				</div>
				{//only displays the Start Settle button for the creator && if all participants have submitted their suggestions
				this.state.creator && this.state.numberofsuggestions / this.state.participants === 3
				? 
				<button onClick={this.onClick}> Start Settle </button> 
				: 
				this.state.creator && this.state.numberofsuggestions / this.state.participants !== 3
				?
				<p>Waiting until everyone is ready</p>
				:
				this.state.numberofsuggestions / this.state.participants !== 3
				?
				<p>Waiting for all participants to submit suggestions</p>
				:
				this.state.numberofsuggestions / this.state.participants === 3
				?
				<p>Waiting for the creator to begin the settle</p>
				:
				<></>
				}
			</div>;
	}
};

const mapStateToProps = (state) => {
	return {
		user: state.userRdcr.user,
		participants: state.settleRdcr.participants
	}
}

export default connect(mapStateToProps, {getUser, getParticipants})(Inactive);