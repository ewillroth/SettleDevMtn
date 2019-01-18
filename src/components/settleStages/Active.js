import React, {Component} from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import {getParticipants} from '../../redux/reducers/settleReducer';
import {getUser} from '../../redux/reducers/userReducer';
import Participants from './Inactive/Participants';

class Active extends Component{
	constructor(props){
		super(props)
		this.state={
			suggestions: []
		}
	}
	componentDidMount(){
		//gets user from session
		this.props.getUser()
		.then(()=>console.log('getUser', this.props.user))
		.catch(err => console.log(err))

		//gets suggestions and makes the list
		axios.get(`/api/settle/${this.props.id}/suggestions`)
		.then(response=>{
			let arr = response.data
			let suggestions = []
			arr.map((e,i)=>{
				suggestions = suggestions.concat(Object.values(e))
				return suggestions
			})
			this.setState({suggestions})
		})
		.catch(err=>console.log(err))
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
		const list = this.state.suggestions.map((e,i)=>{return <>{e}</>})
		return (
			<div className="active">
				<div className="userpanel">
					<h1 className="logo">Settle!</h1>
					<img src={this.props.user.profilepic} alt="profile"></img>
					<p>{this.props.user.name}</p>
					<Participants stage="active" id={this.props.id}/>
				</div>
				<div className="thelist"></div>
				{list}
				<div className="chat"></div>
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