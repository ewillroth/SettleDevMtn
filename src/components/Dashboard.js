import React, { Component } from 'react';
import { getUser } from '../redux/reducers/userReducer';
import {connect} from 'react-redux';
import NewSettleButton from './NewSettleButton';
import LogoutButton from './LogoutButton';
import Stats from './dashboard/Stats';
import Friends from './dashboard/Friends';

class Dashboard extends Component {
	constructor(){
		super()
		this.state={
			update: false
		}
	}

	//checks if there is a user on session and redirects to '/' if there is not
	componentDidMount() {
		this.props.getUser()
		.then()
		.catch(() => this.props.history.push('/'))
	}

	onClick=()=>{
		this.setState({
			update: !this.state.update
		})
	}

	render() {
		return (
			<>
			{//change user info panel view when updating profile picture
			!this.state.update
			?
			<div className="userpanel">
				<img src={this.props.user.profilepic} alt="profile"></img>
				<button onClick={this.onClick}>Edit profile picture</button>
				<div className="userinfo">
					<p>Name: {this.props.user.name}</p>
					<p>Email: {this.props.user.email}</p>
				</div>
			<LogoutButton reroute={(str)=>this.props.history.push(str)}/>
			</div>
			:
			<div className="userpanel">
				<img src={this.props.user.profilepic} alt="profile"></img>
				<button onClick={this.onClick}>Cancel</button>
				<form>
					<input placeholder="insert url?"></input>
					<button>Submit</button>
				</form>
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

export default connect(mapStateToProps, { getUser })(Dashboard);