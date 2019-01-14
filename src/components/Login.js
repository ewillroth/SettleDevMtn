import React, { Component } from 'react';
import {connect} from 'react-redux';
import {updateEmail, updatePassword, resetForm, getUser} from '../redux/reducers/userReducer';
import axios from 'axios';
import Header from './Header';

class Login extends Component {

	componentDidMount() {
		this.props.getUser()
		.then(()=>this.props.history.push('/dashboard'))
		.catch(err=>console.log(err))
	}


	onSubmit = (e) => {
		e.preventDefault()
		const {email, password} = this.props
		axios.post('/auth/login', {email, password})
		.then((response) => {
			this.props.resetForm(response)
			this.props.history.push('/dashboard')
		}
		)
		.catch(err => { alert(err.response.request.response) })
	}

	render(){
		return (
			this.props.user.user_id?<></>:
			<>
			<Header/>
			<form className="login" onSubmit={this.onSubmit}>
				<p>Email:</p>
				<input name="email" value={this.props.email} onChange={(e)=>this.props.updateEmail(e.target.value)}></input>
				<p>Password:</p>
				<input name="password" value={this.props.password} onChange={(e)=>this.props.updatePassword(e.target.value)}></input>
				<button>Submit</button>
			</form>
			</>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		user: state.userRdcr.user,
		email: state.userRdcr.email,
		password: state.userRdcr.password
	}
}

export default connect(mapStateToProps, {updateEmail, updatePassword, resetForm, getUser})(Login);