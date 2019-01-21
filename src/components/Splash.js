import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import bcrypt from 'bcryptjs';
import axios from 'axios'
import NewSettleButton from './NewSettleButton';
import {getUser} from '../redux/reducers/userReducer';

class Splash extends Component{
	constructor(){
		super()
		this.state={
			loaded: false
		}
	}
	//checks if there is a user on session 
		//redirects to dashboard if user is logged in
		//creates a guest user in db if no user
	componentDidMount() {
		this.props.getUser()
		.then((response)=>{
			if(response.action.payload.data.name!=='guest'){
				this.props.history.push('/dashboard')
			} else{
				this.setState({loaded:true})
			}
		})
		.catch(()=>{
			const guestemail = bcrypt.hashSync('email', 4)
			axios.post('/auth/register', {email: guestemail, name: 'guest', password: 'doesntmatter'})
			.then(()=>{this.setState({loaded:true})})
			.catch(err=>console.log(err))
		})
	}

	render(){
		return (
			!this.state.loaded?<></>:
			<>
			<div className="splash-nav">
				<Link to="/login">Login</Link>
				<Link to="/register">Register</Link>
			</div>
			<div className="splash-line"></div>
			<div className="splash-main">
				<h1 className="logo">Settle!</h1>
				<p>Settle is a tool to help groups make decisions. Each person writes down three unique suggestions, suggestions are crossed off one at a time, and the last suggestion remaining is the winner.</p>
			<NewSettleButton reroute={(str) => this.props.history.push(str)} />
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

export default connect(mapStateToProps, { getUser })(Splash);