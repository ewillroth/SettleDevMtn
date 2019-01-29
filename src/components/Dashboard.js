import React, { Component } from 'react';
import { getUser, updatePicture} from '../redux/reducers/userReducer';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom'
import {storage} from '../firebase'
import {Link} from 'react-router-dom'
import { toast } from 'react-toastify';
import axios from 'axios';
import NewSettleButton from './NewSettleButton';
import LogoutButton from './LogoutButton';

class Dashboard extends Component {
	constructor(){
		super()
		this.state={
			edit: false,
			picture: '',
			url: '',
			name: '',
			email: '',
			active: false,
			activesettles: [],
			loaded: false,
			update: false,
			mostsuggested: '',
			mostsuggestednumber: '',
			winningnumber: '',
			participated: ''
		}
	}
	//checks if there is a user on session and redirects to '/' if there is not or user is a guest
	componentDidMount() {
		this.props.getUser()
		.then((response)=>{
			this.setState({
				loaded: true,
				username: this.props.user.name,
				useremail: this.props.user.email
			})
			if(response.action.payload.data.name === 'guest'){
				this.props.history.push('/')
			}
			console.log(this.props.user.profilepic)
			this.setState({
				url: this.props.user.profilepic
			})
		})
		.catch(() => {
		this.props.history.push('/')
		})

		axios.get(`/api/user/settles`)
		.then(response=>{this.setState({activesettles: response.data})})
		.catch(err=>console.log(err))

		axios.get('api/user/stats/suggested')
			.then(response => this.setState({ mostsuggested: response.data.suggestion, mostsuggestednumber: response.data.count}))
			.catch(err => console.log(err))

		axios.get('api/user/stats/winning')
			.then(response => this.setState({winningnumber: response.data.count }))
			.catch(err => console.log(err))

		axios.get('api/user/stats/participated')
			.then(response => this.setState({participated: response.data.count }))
			.catch(err => console.log(err))

	}

	componentDidUpdate(prevProps, prevState) {
		if(this.state.update !== prevState.update){
			console.log('updating')
			this.props.getUser()
				.then((response) => {
					this.setState({
						loaded: true
					})
					if (response.action.payload.data.name === 'guest') {
						this.props.history.push('/')
					}
					this.setState({
						url: this.props.user.profilepic
					})
				})
				.catch(() => {
					this.props.history.push('/')
				})

			axios.get(`/api/user/settles`)
				.then(response => { this.setState({ activesettles: response.data }) })
				.catch(err => console.log(err))
		}
	}
	//changes the userpanel view to allow users to edit their profile picture
	onClick=()=>{
		this.setState({
			edit: !this.state.edit
		})
	}

	onChange= async (e)=>{
		await this.setState({picture: e.target.files[0]})
	}

	captureTyping = (e) => {
		this.setState({[e.target.name]:e.target.value})
	}

	uploadFile=(e)=>{
		e.preventDefault()
		const upload = storage.ref(`images/profile/${this.props.user.user_id}`).put(this.state.picture)
		upload.on('state_changed', () => this.setState({edit:false}), (err) => console.log("upload error",err), () => {
			//.on accepts 4 params, ???, progress, error, complete
			console.log('doneuploading')
			storage.ref(`images/profile/${this.props.user.user_id}`).getDownloadURL()
			.then(url => console.log(url)||this.props.updatePicture(url).then(response=>this.setState({url:response.value.data.profilepic})).catch(err=>console.log('cant update picture')))
			//getDownloadURL returns a promise with the video URL to be used in your img src
		})
	}

	updateName=(e)=>{
		e.preventDefault()
		axios.put('/api/user/name', {name:this.state.name})
		.then(()=>{
			this.setState({update: !this.state.update, edit: false})
		})
		.catch(err=>console.log('updateName error', err))
	}

	updateEmail=(e)=>{
		e.preventDefault()
		axios.put('/api/user/email', {email:this.state.email})
		.then(()=>{
			this.setState({update: !this.state.update, edit: false})
		})
		.catch(err=>{
			toast.warn('Email is already registered to another account')
			console.log('updateEmail error', err)
		})
	}

	render() {
		const activesettles = this.state.activesettles.length>0?this.state.activesettles.map((e,i)=>{
			return <Link key={i} to={`/settle/${e.settle_id}`}>{`${e.stage} settle ${e.settle_id}`}</Link>
		}):<>No Active Settles</>
		return (
			!this.state.loaded?
			<></>
			:
			<div className="dashboard">
				{//change user info panel view when updating profile picture
				!this.state.edit
				?//user panel standard view
				<div className="userpanel">
					<h1 className="logo">Settle!</h1>
					<img className="profilepic" src={this.state.url} alt="profile"></img>
					<div className="userinfo">
						<p>Name:  {this.props.user.name}</p>
						<p>Email:  {this.props.user.email}</p>
					</div>
					<NewSettleButton reroute={(str) => this.props.history.push(str)} />
					<button className="activesettles" onClick={() => { this.setState({ active: !this.state.active }) }}>active Settles</button>
					<button className="editaccountbutton" onClick={this.onClick}>edit account</button>
					<LogoutButton reroute={(str)=>this.props.history.push(str)}/>
				</div>
				://user panel view when edit options are available
				<div className="userpanel">
					<h1 className="logo">Settle!</h1>
					<img className="profilepic" src={this.state.url} alt="profile"></img>
					<form className="edituserinfo" onSubmit={this.uploadFile}>
						<p>upload a new profile picture</p>
						<input type="file" onChange={this.onChange} required></input>
						<button>submit</button>
					</form>
					<form className="edituserinfo" onSubmit={this.updateName}>
						<p>change your name:</p>
						<input name="name" onChange={this.captureTyping} required></input>
						<button>submit</button>
					</form>
					<form className="edituserinfo" onSubmit={this.updateEmail}>
						<p>change your email:</p>
						<input type="email" name="email" onChange={this.captureTyping} required></input>
						<button>submit</button>
					</form>
					<button className="deleteaccount" onClick={() => { axios.delete('/auth/me').then(() => { this.props.history.push('/') }).catch(err => console.log(err)) }}>delete account</button>
					<button onClick={this.onClick}>done editing</button>
				</div>
				}
				<div className={this.state.active?'activebox':'hide'}>
					{activesettles}
				</div>
				<div className={this.state.active?'hide':'activebox'}>
					<p>{this.state.mostsuggested?`You have suggested ${this.state.mostsuggested} ${this.state.mostsuggestednumber} times.`:null}</p>
					<p>{this.state.winningnumber?`Your suggestions have won ${this.state.winningnumber} times.`:null}</p>
					<p>{this.state.participated?`You have participated in ${this.state.participated} settles.`:null}</p>
				</div>
				{this.props.user.name === 'guest'?<Redirect to='/'/>:null}
			</div>
		)
	}
}

const mapStateToProps = state => {
	return {
		user: state.userRdcr.user
	}
}

export default connect(mapStateToProps, { getUser, updatePicture})(Dashboard);