import React, {Component} from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import {getParticipants} from '../../redux/reducers/settleReducer';
import {getUser} from '../../redux/reducers/userReducer';
import Header from "../Header";

class Active extends Component{
	componentDidMount(){
		//gets user from session
		this.props.getUser()
		.then(()=>console.log('getUser', this.props.user))
		.catch(err => console.log(err))

		//gets participants from user_settles 
		this.props.getParticipants(this.props.id)
		.then(() => console.log('getParticipants', this.props.participants))
		.catch(err => console.log(err))
		}

	removeSuggestion = () => {
		axios.put(`/api/settle/${this.props.id}/remove`, {suggestion: '', user_id: ''})
		.then(()=>{
			axios.get(`/api/settle/${this.props.id}/participants`)
			.then(response=>{
				this.setState({
					participants: response.data,
					update: !this.state.update
				})
			}).catch(err=>console.log(err))
		})
		.catch(err=>console.log(err))
	}

	render(){
		return (
			<div className="settlecontainer">
			<Header />
				Active
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		user: state.userRdcr.user,
		participants: state.settleRdcr.participants
	}
}

export default connect(mapStateToProps, { getUser, getParticipants })(Active);