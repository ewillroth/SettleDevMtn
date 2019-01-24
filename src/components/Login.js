import React, { Component } from 'react';
import {connect} from 'react-redux';
import {toast} from 'react-toastify';
import {Redirect} from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import {updateEmail, updatePassword, resetForm, addUser, getUser} from '../redux/reducers/userReducer';

class Login extends Component {
	constructor(){
		super()
		this.state={
			loaded: false
		}
	}
	//redirects to dashboard if there is a non-guest user on session already
	componentDidMount() {
		this.props.getUser()
		.then((response)=>{
			if(response.action.payload.data.name!=='guest'){
				this.props.history.push('/dashboard')
			}else {
				this.setState({loaded:true})
			}
		})
		.catch(err=>{console.log(err)})
	}

	onSubmit = (e) => {
		e.preventDefault()
		const {email, password} = this.props
		axios.post('/auth/login', {email, password})
		.then((response) => {
			this.props.resetForm()
			this.props.addUser(response)
			this.props.history.push('/dashboard')
		})
		.catch(err => {
			this.props.resetForm()
			toast.error(err.response.request.response, {
				autoClose: 3500,
				hideProgressBar: true
			})})
	}

	render(){
		return (
			!this.state.loaded ? <></> :
			<>
			<Header/>
			<form className="login" onSubmit={this.onSubmit}>
				<p>Email:</p>
				<input name="email" value={this.props.email} onChange={(e)=>this.props.updateEmail(e.target.value)} required></input>
				<p>Password:</p>
				<input name="password" type="password" value={this.props.password} onChange={(e)=>this.props.updatePassword(e.target.value)} required></input>
				<button>Submit</button>
				{this.props.user.name!=='guest'?<Redirect to="/"/>:<></>}
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

export default connect(mapStateToProps, {updateEmail, addUser, updatePassword, resetForm, getUser})(Login);