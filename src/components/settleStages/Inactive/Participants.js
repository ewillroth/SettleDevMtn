import React, { Component } from "react";
import {connect} from 'react-redux';
import {getParticipants} from '../../../redux/reducers/settleReducer';
import {getUser} from '../../../redux/reducers/userReducer';

class Participants extends Component {
	constructor(){
		super()
		this.state={
			update: true,
		}
	}
	//triggers rerender after participants are updated
	componentDidMount(){
		this.props.getParticipants(this.props.id)
		.then(()=>{
			this.setState({
			update: !this.state.update
		})})
		.catch(err=>console.log(err))
	}

	render() {
		const participants = this.props.participants
		const map = participants.length > 0 ? participants.map(
					(e, i) => {
						return (
						//only display current user if settle stage is inactive
						e.user_id === this.props.user.user_id && this.props.stage==='active' ?
						<span key={e.user_id}></span>
						:
						<div className="participant" key={e.user_id}>
							<p>{e.name!=='guest'?e.name:null}</p>
							<img src={e.profilepic} alt="user"/>
							{this.props.stage==="inactive"
							?//only display submission status if settle stage is inactive
							<img className="donesubmitting" src={e.done ? "https://image.flaticon.com/icons/svg/291/291201.svg" :"https://image.flaticon.com/icons/svg/291/291202.svg"} alt="user status"/>
							:
							this.props.stage==="active" && e.name !== "guest"
							?//only show add friend option if settle stage is active and user is not a guest
							<div>Add as a friend</div>
							: <></>
							}
						</div>
						)
					}
				) : <></>;
			return(
				<div className="participants">
					{map}
				</div>
			)
	}
};

const mapStateToProps = (state) => {
	return {
		participants: state.settleRdcr.participants,
		user: state.userRdcr.user
	}
}

export default connect(mapStateToProps, {getParticipants, getUser})(Participants);
