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
			usersuggestions: {},
			update: false,
		};
	}
	componentDidMount() {
		//adds user to user_settles
		axios
			.put(`/api/settle/${this.props.id}/adduser`)
			.then()
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

		//gets participants from user_settles - used to verify if user has submitted all suggestions
		this.props.getParticipants(this.props.id)
		.then(()=>{
			let userindex = this.props.participants.findIndex(i=>i.user_id === this.props.user.user_id)
			let usersuggestions = this.props.participants[userindex]
			let alldone = this.props.participants.findIndex(i=>i.done===false)===-1?true:false
			this.setState({
				usersuggestions,
				alldone
			})
		})
		.catch(err=>console.log(err))
	}

	componentDidUpdate(prevProps){
		//gets participants again if they are updated
		if(prevProps.participants!==this.props.participants){
			this.props.getParticipants(this.props.id)
				.then(() => {
					let userindex = this.props.participants.findIndex(i => i.user_id === this.props.user.user_id)
					let usersuggestions = this.props.participants[userindex]
					let alldone = this.props.participants.findIndex(i => i.done === false) === -1 ? true : false
					this.setState({
						usersuggestions,
						alldone
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
			.then(()=>{this.setState({
				update:!this.state.update
			})})
			.catch(err=>console.log(err));
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
		return <div className="inactive">
				<Header />
				<div className="inactivecontainer">
					<Participants stage="inactive" id={this.props.id} />
					{//removes the form once user has submitted all suggestions
					this.state.usersuggestions&&
					this.state.usersuggestions.suggestion1 && this.state.usersuggestions.suggestion2 && this.state.usersuggestions.suggestion3 
					? 
					<ul className="usersuggestions">
						<li>{this.state.usersuggestions.suggestion1}</li>
						<li>{this.state.usersuggestions.suggestion2}</li>
						<li>{this.state.usersuggestions.suggestion3}</li>
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
				this.state.creator && this.state.alldone !== false 
				? 
				<button onClick={this.onClick}> Start Settle </button> 
				: 
				this.state.creator && this.state.alldone === false 
				?
				<p>Waiting until everyone is ready</p>
				:
				this.state.alldone !== false
				?
				<p>Waiting for creator to begin the settle</p>
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