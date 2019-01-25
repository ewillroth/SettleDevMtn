import React, { Component } from 'react';
import {connect} from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import Header from './Header';
import {updateName, updateEmail, updatePassword, addUser, resetForm, getUser} from '../redux/reducers/userReducer';

class Register extends Component {
	constructor(){
		super()
		this.state=({
			loaded: false
		})
	}

	//redirects to dashboard if there is a non-guest user on session already
	componentDidMount() {
		this.props
			.getUser()
			.then(response => {
				if (response.action.payload.data.name !== "guest") {
					this.props.history.push("/dashboard");
				}else {
					this.setState({
						loaded: true
					})
				}
			})
			.catch(err => console.log(err));
	}

	onSubmit = e => {
		e.preventDefault();
		const { email, name, password } = this.props;
		axios
			.post("/auth/register", { email, name, password })
			.then(response => {
				this.props.resetForm();
				this.props.addUser();
				this.props.history.push("/dashboard");
			})
			.catch(err => {
				this.props.resetForm()
				toast.error(err.response.request.response, {
					autoClose: 3500,
					hideProgressBar: true
				});
			});
	};

	render() {
		return (
			!this.state.loaded ? <></> :
			<>
				<Header />
				<form className="register" onSubmit={this.onSubmit}>
					<p>name</p>
					<input
						onChange={e => this.props.updateName(e.target.value)}
						value={this.props.name}
					required/>
					<p>email</p>
					<input
						onChange={e => this.props.updateEmail(e.target.value)}
						value={this.props.email}
					required/>
					<p>password</p>
					<input
						onChange={e => this.props.updatePassword(e.target.value)}
						value={this.props.password}
						type="password"
					required/>
					<button>submit</button>
				</form>
			</>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		user: state.userRdcr.user,
		name: state.userRdcr.name,
		email: state.userRdcr.email,
		password: state.userRdcr.password
	}
}

export default connect(mapStateToProps, {updateName,updateEmail, addUser, updatePassword, resetForm, getUser})(Register);