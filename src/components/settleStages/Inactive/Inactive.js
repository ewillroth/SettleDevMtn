import React, {Component} from "react";
import {connect} from 'react-redux'
import axios from "axios";
import bcrypt from "bcryptjs";
import { toast } from 'react-toastify';
import {getUser} from '../../../redux/reducers/userReducer';
import {getParticipants} from '../../../redux/reducers/settleReducer';
import Header from "../../Header";
import List from '../Active/List';
import Participants from '../Inactive/Participants';

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
		const {socket} = this.props

		//socket listeners
		socket && socket.on('user_added', ()=>{this.setState({update:!this.state.update})})
		socket && socket.on('suggestion_added', ()=>{this.setState({update:!this.state.update})})
		socket && socket.on('suggestion_removed', ()=>{this.setState({update:!this.state.update})})
		socket && socket.on('user_ready', ()=>{this.setState({update:!this.state.update})})
		//gets the settle from db and adds it to state
		axios.get(`/api/settle/${this.props.id}`)
			.then(response => {
				if (response.data) {
					this.setState({
						settle: response.data
					})
				}
				//checks if there is a user on session and creates a guest user in db if no user. checks if user is creator of settle
				this.props.getUser()
				.then((response) => {
					console.log('gotuser', response)
					if (response.value.data.user_id === this.state.settle.creator_id) {
						this.setState({
							creator: true
						})
						console.log('creator', this.state.settle.creator_id)
					}
					else {
						this.setState({
							creator: false
						})
					}
					this.addUserToSettle()
				})
				.catch(() => {
					const guestemail = bcrypt.hashSync('email', 4)
					axios.post('/auth/register', { email: guestemail, name: 'guest', password: 'doesntmatter' })
						.then(()=>{
							this.addUserToSettle()
						})
						.catch()
				})
		})
		.catch(err=>console.log(err))
	}

	addUserToSettle = () => {
		//adds user to user_settles
		axios
			.put(`/api/settle/${this.props.id}/adduser`)
			.then(() => {
				const {socket} = this.props
				this.setState({})
				socket && socket.emit('user_added', { room: this.props.id })
				//gets participants from user_settles
				this.props.getParticipants(this.props.id)
					.then(() => {
						this.setState({
							participants: this.props.participants.length
						})
						//gets suggestions = used to verify if all users have submitted their suggestions
						axios.get(`/api/settle/${this.props.id}/suggestions`)
							.then(response => {
								this.setState({
									numberofsuggestions: response.data.length
								})
								//gets user's suggestions for this settle- disables submission form on reloads
								axios.get(`/api/settle/${this.props.id}/usersuggestions`)
									.then(response => {
										if (response.data.length === 3) {
											this.setState({
												suggestion1: response.data[0].suggestion,
												suggestion2: response.data[1].suggestion,
												suggestion3: response.data[2].suggestion,
												suggestion1done: true,
												suggestion2done: true,
												suggestion3done: true,
											})
										} else if (response.data.length === 2) {
											this.setState({
												suggestion1: response.data[0].suggestion,
												suggestion2: response.data[1].suggestion,
												suggestion1done: true,
												suggestion2done: true
											})
										} else if (response.data.length === 1) {
											this.setState({
												suggestion1: response.data[0].suggestion,
												suggestion1done: true
											})
										}
									})
									.catch(err => console.log(err))
								//checks if user is done submitting and sets state accordingly
								axios.get(`/api/settle/${this.props.id}/donesubmitting`)
									.then(response => {
										response.data[0] && this.setState({ done: response.data[0].done })
									})
									.catch(err => console.log(err))
							})
							.catch(err => {
								this.setState({})
								console.log(err)
							})
					})
					.catch(err => console.log(err))
			})
			.catch(err => console.log(err));
	}

	componentDidUpdate(prevProps,prevState){
		const { socket } = this.props
		const { id } = this.props
		if(prevState.suggestion1done !== this.state.suggestion1done 
		|| prevState.suggestion2done !== this.state.suggestion2done 
		|| prevState.suggestion3done !== this.state.suggestion3done 
		// || prevState.done !== this.state.done
		|| prevState.update !== this.state.update){
			console.log('componentDidUpdate')
			this.props.getParticipants(id)
				.then(() => {
					console.log('got participants', this.props.participants.length)
					this.setState({
						participants: this.props.participants.length
					})
					//gets suggestions = used to verify if all users have submitted their suggestions
					axios.get(`/api/settle/${id}/suggestions`)
						.then(response => {
							console.log('got suggestions', response.data.length)
							this.setState({
								numberofsuggestions: response.data.length
							})
						})
						.catch(err => console.log(err))
				})
				.catch(err => console.log(err))
			//checks if all three suggestions have been submitted and sets user to ready if so
			if(this.state.done === false && this.state.suggestion1done && this.state.suggestion2done && this.state.suggestion3done){
				console.log('done?', this.state.done, this.state.suggestion1done,this.state.suggestion2done, this.state.suggestion3done)
				axios.post(`/api/settle/${id}/donesubmitting`)
					.then(() => {
						socket.emit('user_ready', { room: id })
						this.props.getParticipants(id)
						.then(()=>this.setState({
							participants: this.props.participants.length,
							done: true
						}))
						.catch(err=>console.log(err))
					})
					.catch(err => console.log(err))
			}else if(!this.state.suggestion1done || !this.state.suggestion2done || !this.state.suggestion3done){
				if(prevState.done === true){
					console.log('was done and now is not done')
					axios.put(`/api/settle/${id}/donesubmitting`)
						.then(()=>{
							socket.emit('user_ready', {room: id})
							this.props.getParticipants(id)
							.then(()=>this.setState({
								participants: this.props.participants.length,
								done: false
							}))
							.catch(err=>console.log(err))
						})
						.catch(err=>console.log(err))
				}
			}
		}
	}

	onChange = e => {
		this.setState({
			[e.target.name]: e.target.value
		});
	};

	submitOne = (e) => {
		const { socket } = this.props
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
		const { socket } = this.props
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
		const { socket } = this.props
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
		const { socket } = this.props
		axios.put(`/api/settle/${this.props.id}/delete`, {suggestion: this.state.suggestion1})
			.then(() => {
				socket.emit('suggestion_removed', {room:this.props.id}) 
				this.setState({ suggestion1done: false })
			})
			.catch(err=>console.log(err))
	}
	editTwo = () => {
		const { socket } = this.props
		axios.put(`/api/settle/${this.props.id}/delete`, { suggestion: this.state.suggestion2 })
			.then(() => {
				socket.emit('suggestion_removed', {room:this.props.id}) 
				this.setState({ suggestion2done: false })
			})
			.catch(err=>console.log(err))
	}
	editThree = () => {
		const { socket } = this.props
		axios.put(`/api/settle/${this.props.id}/delete`, { suggestion: this.state.suggestion3 })
			.then(() => {
				socket.emit('suggestion_removed', {room:this.props.id}) 
				this.setState({ suggestion3done: false })
			})
			.catch(err=>console.log(err))
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
							<button onClick={this.editOne}>Edit</button>
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
							<button onClick={this.editTwo}>Edit</button>
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
							<button onClick={this.editThree}>Edit</button>
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