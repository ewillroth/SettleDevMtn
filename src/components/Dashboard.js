import React, { Component } from 'react';
import { getUser } from '../redux/reducers/userReducer';
import {connect} from 'react-redux';
import NewSettleButton from './NewSettleButton';
import LogoutButton from './LogoutButton';

class Dashboard extends Component {

	//checks if there is a user on session and redirects to '/' if there is not
	componentDidMount() {
		this.props.getUser()
		.catch(() => this.props.history.push('/'))
	}

	render() {
		return (
			<>
			<div className="userpanel">
				<img src={this.props.user.profilepic} alt="profile"></img>
				<p>Name: {this.props.user.name}</p>
				<p>Email: {this.props.user.email}</p>
			</div>
			<NewSettleButton reroute={(str)=>this.props.history.push(str)}/>
			<LogoutButton reroute={(str)=>this.props.history.push(str)}/>
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