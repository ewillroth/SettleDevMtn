import React, {Component} from "react";
import {connect} from 'react-redux'
import axios from "axios";
import Header from "../../Header";
import Participants from '../Inactive/Participants';
import {getUser} from '../../../redux/reducers/userReducer';
import {getParticipants} from '../../../redux/reducers/settleReducer';
import { toast } from 'react-toastify';


class Inactive extends Component {
	constructor(props) {
		super(props);
		this.state = {
			suggestion1: "",
			suggestion1done: false,
			suggestion2: "",
			suggestion2done: false,
			suggestion3: "",
			suggestion3done: false,
			creator: false,
			done: false,
			suggestions: [],
			participants: 0,
			numberofsuggestions: 0,
		};
	}
	componentDidMount() {
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
			//adds user to user_settles
			axios
				.put(`/api/settle/${this.props.id}/adduser`)
				.then(()=>{
					this.setState({})
					//gets participants from user_settles
					this.props.getParticipants(this.props.id)
					.then(()=>{
						this.setState({
							participants: this.props.participants.length
						})
						//gets suggestions = used to verify if all users have submitted their suggestions
						axios.get(`/api/settle/${this.props.id}/suggestions`)
						.then(response=>{
							this.setState({
								numberofsuggestions: response.data.length
							})
						})
						.catch(err=>{
							this.setState({})
							console.log(err)
						})
					})
					.catch(err=>console.log(err))
				})
				.catch(err => console.log(err));
		})
		.catch(err=>console.log(err))
		
		//gets user's suggestions for this settle- disables submission form on reloads
		axios.get(`/api/settle/${this.props.id}/usersuggestions`)
		.then(response=>{
			if(response.data.length===3){
				this.setState({
					suggestion1: response.data[0].suggestion,
					suggestion2: response.data[1].suggestion,
					suggestion3: response.data[2].suggestion,
					suggestion1done: true,
					suggestion2done: true,
					suggestion3done: true,
				})
			}else if (response.data.length===2){
				this.setState({
					suggestion1: response.data[0].suggestion,
					suggestion2: response.data[1].suggestion,
					suggestion1done: true,
					suggestion2done: true
				})
			}else if (response.data.length===1){
				this.setState({ 
					suggestion1: response.data[0].suggestion,
					suggestion1done: true
				})
			}
			if(this.props.user.donesubmitting){
				this.setState({
					done: true
				})
			}
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

	submitOne = (e) => {
		e.preventDefault()
		axios
			.put(`/api/settle/${this.props.id}/submit`, {
				suggestion:this.state.suggestion1
			})
			.then(()=>this.setState({suggestion1done: true}))
			.catch(err=>toast.warn(err.response.request.response));
	};
	submitTwo = (e) => {
		e.preventDefault()
		axios
			.put(`/api/settle/${this.props.id}/submit`, {
				suggestion:this.state.suggestion2
			})
			.then(()=>this.setState({suggestion2done: true}))
			.catch(err=>toast.warn(err.response.request.response));
	};
	submitThree = (e) => {
		e.preventDefault()
		axios
			.put(`/api/settle/${this.props.id}/submit`, {
				suggestion:this.state.suggestion3
			})
			.then(()=>this.setState({suggestion3done: true}))
			.catch(err=>toast.warn(err.response.request.response));
	};

	doneSubmitting = () => {
		axios.post(`/api/settle/${this.props.id}/donesubmitting`)
		.then(()=>{this.setState({done: true})})
		.catch(err => console.log(err))
	}

	onClick = e => {
		//randomly assign one of the participants to cross off first and sets the stage to active
		axios.get(`/api/settle/${this.props.id}/start`).then(()=>this.props.changeStage('active'))
	};

	render() {
		return <div className="inactive">
				<Header />
				<div className="inactivecontainer">
					<Participants number={this.state.participants} stage="inactive" id={this.props.id} />
					<div>
						{this.state.suggestion1done
						?
						<p>{this.state.suggestion1}</p>
						:
						<form className="submitlist" onSubmit={this.submitOne}>
							<input onChange={this.onChange} name="suggestion1" value={this.state.suggestion1} />
							<button>+</button>
						</form>
						}
						{this.state.suggestion2done
						?
						<p>{this.state.suggestion2}</p>
						:
						<form className="submitlist" onSubmit={this.submitTwo}>
							<input onChange={this.onChange} name="suggestion2" value={this.state.suggestion2} />
							<button>+</button>
						</form>
						}
						{this.state.suggestion3done
						?
						<p>{this.state.suggestion3}</p>
						:
						<form className="submitlist" onSubmit={this.submitThree}>
							<input onChange={this.onChange} name="suggestion3" value={this.state.suggestion3} />
							<button>+</button>
						</form>
						}
					</div>
				</div>
				{//only displays the Start Settle button for the creator && if all participants have submitted their suggestions
				!this.state.suggestion1done || !this.state.suggestion2done || !this.state.suggestion3done
				?
				<></>
				:
				this.state.suggestion1done && this.state.suggestion2done && this.state.suggestion3done && !this.state.done
				?
				<button onClick={this.doneSubmitting}>Ready</button>
				:
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