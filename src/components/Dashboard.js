import React, { Component } from 'react';
import { getUser } from '../redux/reducers/userReducer';
import {connect} from 'react-redux';
import NewSettle from './NewSettle';

class Dashboard extends Component {

	componentDidMount() {
		this.props.getUser()
		.catch(() => this.props.history.push('/login'))
	}

	render() {
		return (
			<>
			<div className="userpanel">
				<img src={this.props.user.profilepic} alt="profile"></img>
				<p>Name: {this.props.user.name}</p>
				<p>Email: {this.props.user.email}</p>
			</div>
			<NewSettle reroute={(str)=>this.props.history.push(str)}/>
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