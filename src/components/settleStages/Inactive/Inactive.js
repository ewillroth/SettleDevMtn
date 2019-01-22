import React, {Component} from "react";
import {connect} from 'react-redux'
import axios from "axios";
import Header from "../../Header";
import Participants from '../Inactive/Participants';
import List from '../Active/List';
import {getUser} from '../../../redux/reducers/userReducer';
import {getParticipants} from '../../../redux/reducers/settleReducer';
import { toast } from 'react-toastify';
import socketIOClient from 'socket.io-client';

const socket = socketIOClient('http://localhost:3333')

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
			settle: {},
			update: false
		};
	}
	componentDidMount() {
		//joins the socket room with the settle id
		socket.emit('join', {room:this.props.id})
		//socket listeners
		socket.on('user_added', ()=>{this.setState({update:!this.state.update})})
		socket.on('suggestion_added', ()=>{this.setState({update:!this.state.update})})
		socket.on('suggestion_removed', ()=>{this.setState({update:!this.state.update})})
		//gets the settle from db and adds it to state
		axios.get(`/api/settle/${this.props.id}`)
			.then(response => {
				if (response.data) {
					this.setState({
						settle: response.data
					})
				}
				//gets user from session- used to verify if user is creator
				this.props.getUser()
				.then((response)=>{
					console.log('gotuser', response)
					if(response.value.data.user_id===this.state.settle.creator_id){
						this.setState({
							creator: true
						})
						console.log('creator', this.state.settle.creator_id)
					}
					else{
						this.setState({
							creator: false
						})
					}
				})
			
			//adds user to user_settles
			axios
				.put(`/api/settle/${this.props.id}/adduser`)
				.then(()=>{
					this.setState({})
					socket.emit('user_added', {room:this.props.id})
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
		if(prevState.suggestion1done !== this.state.suggestion1done 
		|| prevState.suggestion2done !== this.state.suggestion2done 
		|| prevState.suggestion3done !== this.state.suggestion3done 
		|| prevState.done !== this.state.done
		|| prevState.update !== this.state.update){
			console.log('componentDidUpdate')
			this.props.getParticipants(this.props.id)
				.then(() => {
					console.log('got participants', this.props.participants.length)
					this.setState({
						participants: this.props.participants.length
					})
					//gets suggestions = used to verify if all users have submitted their suggestions
					axios.get(`/api/settle/${this.props.id}/suggestions`)
						.then(response => {
							console.log('got suggestions', response.data.length)
							this.setState({
								numberofsuggestions: response.data.length
							})
						})
						.catch(err => console.log(err))
				})
				.catch(err => console.log(err))
		}
	}

	componentWillUnmount(){
		socket.emit('leave', {room:this.props.id})
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
			.then(()=>{
				socket.emit('suggestion_added', {room:this.props.id})
				this.setState({suggestion1done: true})
			})
			.catch(err=>{
				this.setState({update: !this.state.update})
				toast.warn(err.response.request.response)
			});
	};
	submitTwo = (e) => {
		e.preventDefault()
		axios
			.put(`/api/settle/${this.props.id}/submit`, {
				suggestion:this.state.suggestion2
			})
			.then(()=>{
				socket.emit('suggestion_added', {room:this.props.id})
				this.setState({suggestion2done: true})
			})
			.catch(err=>{
				this.setState({update: !this.state.update})
				toast.warn(err.response.request.response)
			});
	};
	submitThree = (e) => {
		e.preventDefault()
		axios
			.put(`/api/settle/${this.props.id}/submit`, {
				suggestion:this.state.suggestion3
			})
			.then(()=>{
				socket.emit('suggestion_added', {room:this.props.id})
				this.setState({suggestion3done: true})
			})
			.catch(err=>{
				this.setState({update: !this.state.update})
				toast.warn(err.response.request.response)
			});
	};
	editOne = () => {
		axios.put(`/api/settle/${this.props.id}/delete`, {suggestion: this.state.suggestion1})
			.then(() => {
				socket.emit('suggestion_removed', {room:this.props.id}) 
				this.setState({ suggestion1done: false })
			})
			.catch(err=>console.log(err))
	}
	editTwo = () => {
		axios.put(`/api/settle/${this.props.id}/delete`, { suggestion: this.state.suggestion2 })
			.then(() => {
				socket.emit('suggestion_removed', {room:this.props.id}) 
				this.setState({ suggestion2done: false })
			})
			.catch(err=>console.log(err))
	}
	editThree = () => {
		axios.put(`/api/settle/${this.props.id}/delete`, { suggestion: this.state.suggestion3 })
			.then(() => {
				socket.emit('suggestion_removed', {room:this.props.id}) 
				this.setState({ suggestion3done: false })
			})
			.catch(err=>console.log(err))
	}

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
					<List id={this.props.id} suggestions={this.state.numberofsuggestions}/>
					<div>
						{this.state.suggestion1done
						?
						<div>
							<p>{this.state.suggestion1}</p>
							{this.state.done?<></>:<button onClick={this.editOne}>Edit</button>}
						</div>
						:
						<form className="submitlist" onSubmit={this.submitOne}>
							<input onChange={this.onChange} name="suggestion1" value={this.state.suggestion1} />
							<button>+</button>
						</form>
						}
						{this.state.suggestion2done
						?
						<div>
							<p>{this.state.suggestion2}</p>
							{this.state.done?<></>:<button onClick={this.editTwo}>Edit</button>}
						</div>
						:
						<form className="submitlist" onSubmit={this.submitTwo}>
							<input onChange={this.onChange} name="suggestion2" value={this.state.suggestion2} />
							<button>+</button>
						</form>
						}
						{this.state.suggestion3done
						?
						<div>
							<p>{this.state.suggestion3}</p>
							{this.state.done?<></>:<button onClick={this.editThree}>Edit</button>}
						</div>
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