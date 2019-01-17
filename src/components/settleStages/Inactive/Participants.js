import React, { Component } from "react";
import {connect} from 'react-redux';
import {getParticipants} from '../../../redux/reducers/settleReducer';

class Participants extends Component {
	constructor(){
		super()
		this.state={
			update: true
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
						<div className="participant" key={i}>
							<img src={e.profilepic} alt="user"/>
							{this.props.stage==="inactive"
							?
							<img className="donesubmitting" src={e.done ? "https://image.flaticon.com/icons/svg/291/291201.svg" :"https://image.flaticon.com/icons/svg/291/291202.svg"} alt="user status"/>
							:
							this.props.stage==="active"
							?
							<div>Add as a freind</div>
							: <></>
							}
						</div>
						)
					}
				) : <></>;
			return(
				<div className="participants">
					<p>Participants</p>
					{map}
				</div>
			)
	}
};

const mapStateToProps = (state) => {
	return {
		participants: state.settleRdcr.participants
	}
}

export default connect(mapStateToProps, {getParticipants})(Participants);
