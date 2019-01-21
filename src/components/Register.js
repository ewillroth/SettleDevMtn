import React, { Component } from 'react';
import {connect} from 'react-redux';
import Header from './Header';
import {updateName, updateEmail, updatePassword, resetForm, getUser} from '../redux/reducers/userReducer';
import axios from 'axios';
import { toast } from 'react-toastify';

class Register extends Component {

	//redirects to dashboard if there is a non-guest user on session already
	componentDidMount() {
		this.props
			.getUser()
			.then(response => {
				if (response.action.payload.data.name !== "guest") {
					this.props.history.push("/dashboard");
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
				this.props.resetForm(response);
				this.props.history.push("/dashboard");
			})
			.catch(err => {
				toast.error(err.response.request.response);
			});
	};

	render() {
		return this.props.user.name !== 'guest' ? (
			<></>
		) : (
			<>
				<Header />
				<form className="register" onSubmit={this.onSubmit}>
					<p>Name</p>
					<input
						onChange={e => this.props.updateName(e.target.value)}
						value={this.props.name}
					/>
					<p>Email</p>
					<input
						onChange={e => this.props.updateEmail(e.target.value)}
						value={this.props.email}
					/>
					<p>Password</p>
					<input
						onChange={e => this.props.updatePassword(e.target.value)}
						value={this.props.password}
						type="password"
					/>
					<button>Submit</button>
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

export default connect(mapStateToProps, {updateName,updateEmail, updatePassword, resetForm, getUser})(Register);