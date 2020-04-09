import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getParticipants } from "../../redux/reducers/settleReducer";
import { getUser } from "../../redux/reducers/userReducer";

class Participants extends Component {
	constructor() {
		super();
		this.state = {
			update: false,
		};
	}
	//triggers rerender after participants are updated
	componentDidMount() {
		this.props
			.getParticipants(this.props.id)
			.then(() => {
				this.setState({
					update: !this.state.update,
				});
			})
			.catch((err) => console.log(err));
	}

	componentDidUpdate(prevProps) {
		if (this.props.number !== prevProps.number) {
			this.setState({ update: !this.state.update });
		}
	}

	render() {
		const participants = this.props.participants;
		const map =
			participants.length > 0 ? (
				participants.map((e, i) => {
					return (
						//only display current user if settle stage is inactive
						e.user_id === this.props.user.user_id &&
							this.props.stage === "active" ? (
							<span key={e.user_id}></span>
						) : (
							<div className="participant" key={e.user_id}>
								<div className="participantimagecontainer">
									<img src={e.profilepic} alt="user" />
									{this.props.stage === "inactive" ? (
										//only display submission status if settle stage is inactive
										<img
											className="donesubmitting"
											src={
												e.done
													? "https://image.flaticon.com/icons/svg/291/291201.svg"
													: "https://image.flaticon.com/icons/svg/291/291202.svg"
											}
											alt="user status"
										/>
									) : (
										<></>
									)}
								</div>
								<p>{e.name}</p>
							</div>
						)
					);
				})
			) : (
				<></>
			);
		return <div className="participants">{map}</div>;
	}
}

const mapStateToProps = (state) => {
	return {
		participants: state.settleRdcr.participants,
		user: state.userRdcr.user,
	};
};

export default connect(mapStateToProps, { getParticipants, getUser })(
	Participants
);

Participants.propTypes = {
	number: PropTypes.number.isRequired,
	stage: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
};
