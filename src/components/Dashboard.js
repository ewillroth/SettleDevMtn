import React, { Component } from 'react';
import { getUser, updatePicture } from '../redux/reducers/userReducer';
import {connect} from 'react-redux';
import NewSettleButton from './NewSettleButton';
import LogoutButton from './LogoutButton';
import Stats from './dashboard/Stats';
import Friends from './dashboard/Friends';
import axios from 'axios';
import {storage} from '../firebase'

class Dashboard extends Component {
	constructor(){
		super()
		this.state={
			edit: false,
			picture: '',
			url: ''
		}
	}
	//checks if there is a user on session and redirects to '/' if there is not
	componentDidMount() {
		this.props.getUser()
		.then(()=>this.setState({
			url: this.props.user.profilepic
		}))
		.catch(() => {
		this.props.history.push('/')
	})
	}

	componentDidUpdate(prevProps, prevState) {
		if(!this.props.user.profilepic){
			this.props.getUser()
			.then(()=>{this.setState({
				picture: '',
				url: this.props.user.profilepic
			})})
			.catch(err=>console.log('error'))
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

	uploadFile=(e)=>{
		e.preventDefault()
		const upload = storage.ref(`images/profile/${this.props.user.user_id}`).put(this.state.picture)
		upload.on('state_changed', () => this.setState({edit:false}), (err) => console.log("upload error",err), () => {
			//.on accepts 4 params, ???, progress, error, complete
			console.log('doneuploading')
			storage.ref(`images/profile/${this.props.user.user_id}`).getDownloadURL().then(url => this.props.updatePicture(url).then(response=>this.setState({url:response.value.data.profilepic})).catch(err=>console.log('cant update picture')))
			//getDownloadURL returns a promise with the video URL to be used in your img src
		})
	}

	render() {
		return (
			<>
			{//change user info panel view when updating profile picture
			!this.state.edit
			?//user panel standard view
			<div className="userpanel">
				<img src={this.state.url} alt="profile"></img>
				<div className="userinfo">
					<p>Name: {this.props.user.name}</p>
					<p>Email: {this.props.user.email}</p>
				</div>
				<button onClick={this.onClick}>Edit profile picture</button>
				<button onClick={() => { axios.delete('/auth/me').then(() => { this.props.history.push('/') }).catch(err => console.log(err)) }}>Delete account</button>
			<LogoutButton reroute={(str)=>this.props.history.push(str)}/>
			</div>
			://user panel view when editing profile picture
			<div className="userpanel">
				<img src={this.state.url} alt="profile"></img>
				<div>
					<input type="file" onChange={this.onChange}></input>
					<button onClick={this.uploadFile}>Submit</button>
				</div>
				<button onClick={this.onClick}>Cancel</button>
				<button onClick={()=>{axios.delete('/auth/me').then(()=>{this.props.history.push('/')}).catch(err=>console.log(err))}}>Delete account</button>
				<LogoutButton reroute={(str)=>this.props.history.push(str)}/>
			</div>
			}
			<div className="dashpanel">
				<div className="dashnav">
					<NewSettleButton reroute={(str)=>this.props.history.push(str)}/>
					<button className="activesettles">Active Settles</button>
					<h1 className="logo">Settle</h1>
				</div>
				<div className="dashmain">
					<Stats/>
					<Friends/>
				</div>
			</div>
			</>
		)
	}
}

const mapStateToProps = state => {
	return {
		user: state.userRdcr.user
	}
}

export default connect(mapStateToProps, { getUser, updatePicture })(Dashboard);