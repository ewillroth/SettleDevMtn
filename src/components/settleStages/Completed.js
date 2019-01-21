import React, {Component} from "react";
import {connect} from 'react-redux';
import axios from "axios";
import Header from "../Header";
import { Redirect } from 'react-router-dom'
import { getParticipants } from '../../redux/reducers/settleReducer';
import { getUser } from '../../redux/reducers/userReducer';

class Completed extends Component{
	constructor(props){
		super(props)
		this.state={
			winner: ''
		}
	}

	componentDidMount(){
		axios.get(`/api/settle/${this.props.id}/suggestions`)
		.then(response=>{
			this.setState({winner:response.data[0].suggestion})
			//records the winning suggestion and who suggested it to the db
			axios.put(`/api/settle/${this.props.id}/recordwinner`, {winner:response.data[0].suggestion, winnerId: response.data[0].user_id})
			//gets user from session
			this.props.getUser()
				.then(() => {
					this.props.getParticipants(this.props.id)
						.then(() => {
							//checks if the user is in the settle before loading or redirecting
							if (this.props.participants.find(e => e.user_id === this.props.user.user_id)) {
								this.setState({
									loaded: true
								})
							} else {
								this.setState({
									redirect: true
								})
							}
						})
						.catch(err => console.log(err))
				})
				.catch(err => console.log(err))
		})
		.catch(err=>console.log(err))
	}

	render(){
		return (
			this.state.redirect ? <Redirect to="/" /> :
			!this.state.loaded ? <></> :
			<div className="completed">
				<Header />
				<div className="winner">
					{this.state.winner?this.state.winner:null}
				</div>
				<div className="sharing">

				</div>
			</div>
		)
	}
};

const mapStateToProps = (state) => {
	return {
		user: state.userRdcr.user,
		participants: state.settleRdcr.participants
	}
}

export default connect(mapStateToProps, { getUser, getParticipants })(Completed);