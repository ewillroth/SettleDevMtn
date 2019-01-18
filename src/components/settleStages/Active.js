import React, {Component} from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import {getParticipants} from '../../redux/reducers/settleReducer';
import {getUser} from '../../redux/reducers/userReducer';
import Participants from './Inactive/Participants';
import {Link} from 'react-router-dom'

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
			arr.forEach((e,i)=>{suggestions.push(e.suggestion)})
			this.setState({suggestions})
		})
		.catch(err=>console.log(err))
		}

	render(){
		const list = this.state.suggestions.map((e,i)=>{return <li key={i}>{e}</li>})
		return (
			<div className="active">
				<div className="userpanel">
					<h1 className="logo">Settle!</h1>
					<img src={this.props.user.profilepic} alt="profile"></img>
					<p>{this.props.user.name}</p>
					{this.props.user.name!=="guest"?<Link to="/dashboard">Dashboard</Link>:<></>}
					<Participants stage="active" id={this.props.id}/>
				</div>
				<div className="thelist">
					<ul>
						{list}
					</ul>
				</div>
				<div className="chat">

				</div>
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