import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import bcrypt from "bcryptjs";
import { toast } from "react-toastify";
import { getUser } from "../../redux/reducers/userReducer";
import { getParticipants } from "../../redux/reducers/settleReducer";
import Header from "../Header";
import List from "./List";
import Participants from "./Participants";

class Inactive extends Component {
	constructor(props) {
		super(props);
		this.state = {
			suggestion1: "",
			suggestion1done: false,
			suggestion2: "",
			suggestion2done: false,
			suggestion3: "",
			suggestion3done: false,
			creator: false,
			done: false,
			suggestions: [],
			participants: 0,
			numberofsuggestions: 0,
			settle: {},
			update: false,
			loaded: false,
		};
	}
	checkIfDone = () => {
		//gets user's suggestions for this settle- disables submission form on reloads
		axios
			.get(`/api/settle/${this.props.id}/usersuggestions`)
			.then((response) => {
				if (response.data.length === 3) {
					this.setState({
						suggestion1: response.data[0].suggestion,
						suggestion2: response.data[1].suggestion,
						suggestion3: response.data[2].suggestion,
						suggestion1done: true,
						suggestion2done: true,
						suggestion3done: true,
					});
				} else if (response.data.length === 2) {
					this.setState({
						suggestion1: response.data[0].suggestion,
						suggestion2: response.data[1].suggestion,
						suggestion1done: true,
						suggestion2done: true,
					});
				} else if (response.data.length === 1) {
					this.setState({
						suggestion1: response.data[0].suggestion,
						suggestion1done: true,
					});
				}
				this.setState({ loaded: true });
			})
			.catch((err) => console.log(err));
		//checks if user is done submitting and sets state accordingly
		axios
			.get(`/api/settle/${this.props.id}/donesubmitting`)
			.then((response) => {
				this.setState({ done: response.data[0].done });
			})
			.catch((err) => console.log(err));
	};

	getParticipantsAndSuggestions = () => {
		//gets participants from user_settles
		this.props
			.getParticipants(this.props.id)
			.then(() => {
				this.setState({
					participants: this.props.participants.length,
				});
				//gets suggestions = used to verify if all users have submitted their suggestions
				axios
					.get(`/api/settle/${this.props.id}/suggestions`)
					.then((response) => {
						this.setState({
							numberofsuggestions: response.data.length,
						});
					})
					.catch((err) => {
						this.setState({});
						console.log(err);
					});
			})
			.catch((err) => {
				console.log(err);
			});
	};

	onceUserExists = () => {
		console.log("onceUserExists");
		//adds user to user_settles
		axios
			.put(`/api/settle/${this.props.id}/adduser`)
			.then(() => {
				const { socket } = this.props;
				console.log("user added to settle");
				socket && socket.emit("user_added", { room: this.props.id });
				this.getParticipantsAndSuggestions();
				this.checkIfDone();
			})
			.catch((err) => {
				console.log("user already added?");
				this.getParticipantsAndSuggestions();
				this.checkIfDone();
			});
	};

	componentDidMount() {
		const { socket } = this.props;
		//socket listeners
		socket &&
			socket.on("user_added", () => {
				console.log("socket:user_added") ||
					this.setState({ update: !this.state.update });
			});
		socket &&
			socket.on("suggestion_added", () => {
				console.log("socket:suggestion_added") ||
					this.setState({ update: !this.state.update });
			});
		socket &&
			socket.on("suggestion_removed", () => {
				console.log("socket:suggestion_removed") ||
					this.setState({ update: !this.state.update });
			});
		socket &&
			socket.on("user_ready", () => {
				console.log("socket:user_ready") ||
					this.setState({ update: !this.state.update });
			});
		//gets the settle from db and adds it to state
		axios
			.get(`/api/settle/${this.props.id}`)
			.then((response) => {
				console.log("got settle", response.data);
				if (response.data) {
					this.setState({
						settle: response.data,
					});
				}
				//checks if there is a user on session and creates a guest user in db if no user. checks if user is creator of settle
				this.props
					.getUser()
					.then((response) => {
						console.log("gotuser", response.value.data);
						this.onceUserExists();
						if (response.value.data.user_id === this.state.settle.creator_id) {
							this.setState({
								creator: true,
							});
						} else {
							this.setState({
								creator: false,
							});
						}
					})
					.catch(() => {
						const guestemail = bcrypt.hashSync("email", 4);
						axios
							.post("/auth/register", {
								email: guestemail,
								name: "guest",
								password: "doesntmatter",
							})
							.then(() => {
								console.log("user created");
								this.onceUserExists();
							})
							.catch((err) => console.log(err));
					});
			})
			.catch((err) => console.log(err));
	}

	componentDidUpdate(prevProps, prevState) {
		const { socket } = this.props;
		const { id } = this.props;
		if (prevState.update !== this.state.update) {
			console.log("componentDidUpdate- update triggered");
			//get participants length
			this.props
				.getParticipants(id)
				.then(() => {
					// console.log('got participants', this.props.participants.length)
					this.setState({
						participants: this.props.participants.length,
					});
					//get suggestions length
					axios
						.get(`/api/settle/${id}/suggestions`)
						.then((response) => {
							// console.log('got suggestions', response.data.length)
							this.setState({
								numberofsuggestions: response.data.length,
							});
						})
						.catch((err) => console.log(err));
				})
				.catch((err) => console.log(err));
		}
		//verifies if user has submitted all three suggestions and sets them to ready
		if (
			this.state.done === false &&
			this.state.suggestion1done &&
			this.state.suggestion2done &&
			this.state.suggestion3done
		) {
			console.log("ComponentDidUpdate: IsDoneSubmitting?");
			//updates user done submitting to true in db
			axios
				.post(`/api/settle/${id}/donesubmitting`)
				.then(() => {
					socket.emit("user_ready", { room: id });
					this.setState({
						done: true,
						update: !this.state.update,
					});
				})
				.catch((err) => console.log(err));
		} //if user was done but edits one of their suggestions update
		else if (
			!this.state.suggestion1done ||
			!this.state.suggestion2done ||
			!this.state.suggestion3done
		) {
			if (prevState.done === true) {
				console.log("ComponentDidUpdate:was done and now is not done");
				//update user done submitting to false in db
				axios
					.put(`/api/settle/${id}/donesubmitting`)
					.then(() => {
						socket.emit("user_ready", { room: id });
						this.setState({
							done: false,
							update: !this.state.update,
						});
					})
					.catch((err) => console.log(err));
			}
		}
		if (this.props.creator !== prevProps.creator) {
			this.setState({ update: !this.state.update });
		}
	}

	onChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value,
		});
	};

	submitOne = (e) => {
		const { socket } = this.props;
		const { id } = this.props;
		e.preventDefault();
		axios
			.put(`/api/settle/${id}/submit`, {
				suggestion: this.state.suggestion1,
			})
			.then(() => {
				console.log("suggestion added");
				socket && socket.emit("suggestion_added", id);
				this.setState({ suggestion1done: true });
			})
			.catch((err) => {
				this.setState({ update: !this.state.update });
				console.log(err);
				toast.warn(err.response.request.response);
			});
	};
	submitTwo = (e) => {
		const { socket } = this.props;
		const { id } = this.props;
		e.preventDefault();
		axios
			.put(`/api/settle/${id}/submit`, {
				suggestion: this.state.suggestion2,
			})
			.then(() => {
				socket && socket.emit("suggestion_added", id);
				this.setState({ suggestion2done: true });
			})
			.catch((err) => {
				this.setState({ update: !this.state.update });
				console.log(err);
				toast.warn(err.response.request.response);
			});
	};
	submitThree = (e) => {
		const { socket } = this.props;
		const { id } = this.props;
		e.preventDefault();
		axios
			.put(`/api/settle/${id}/submit`, {
				suggestion: this.state.suggestion3,
			})
			.then(() => {
				socket && socket.emit("suggestion_added", id);
				this.setState({ suggestion3done: true });
			})
			.catch((err) => {
				this.setState({ update: !this.state.update });
				console.log(err);
				toast.warn(err.response.request.response);
			});
	};
	editOne = () => {
		const { socket } = this.props;
		const { id } = this.props;
		axios
			.put(`/api/settle/${id}/delete`, { suggestion: this.state.suggestion1 })
			.then(() => {
				socket && socket.emit("suggestion_removed", { room: id });
				this.setState({ suggestion1done: false });
			})
			.catch((err) => console.log(err));
	};
	editTwo = () => {
		const { socket } = this.props;
		const { id } = this.props;
		axios
			.put(`/api/settle/${id}/delete`, { suggestion: this.state.suggestion2 })
			.then(() => {
				socket && socket.emit("suggestion_removed", { room: id });
				this.setState({ suggestion2done: false });
			})
			.catch((err) => console.log(err));
	};
	editThree = () => {
		const { socket } = this.props;
		const { id } = this.props;
		axios
			.put(`/api/settle/${id}/delete`, { suggestion: this.state.suggestion3 })
			.then(() => {
				socket && socket.emit("suggestion_removed", { room: id });
				this.setState({ suggestion3done: false });
			})
			.catch((err) => console.log(err));
	};

	onClick = (e) => {
		//randomly assign one of the participants to cross off first and sets the stage to active
		axios
			.get(`/api/settle/${this.props.id}/start`)
			.then(() => this.props.changeStage("active"));
	};

	render() {
		const suggestions = this.state.numberofsuggestions;
		const participants = this.state.participants;
		return (
			<>
				<Header />
				<div className="inactive">
					<div className="inactivecontainer">
						<Participants
							number={this.state.participants}
							stage="inactive"
							id={this.props.id}
						/>
						<List
							id={this.props.id}
							suggestions={this.state.numberofsuggestions}
						/>
						<div className="usersuggestions">
							{this.state.suggestion1done ? (
								<div className="editablesuggestion">
									<p>{this.state.suggestion1}</p>
									<button onClick={this.editOne}>
										<img
											src="https://firebasestorage.googleapis.com/v0/b/settle-io.appspot.com/o/images%2Ficons%2Fbackspace-arrow.png?alt=media&token=55eb66ee-6b56-48bf-b866-ac04bedb077d"
											alt="delete"
										/>
									</button>
								</div>
							) : (
								<form className="submitlist" onSubmit={this.submitOne}>
									<input
										autoComplete="off"
										tabIndex="1"
										onChange={this.onChange}
										name="suggestion1"
										value={this.state.suggestion1}
										required
									/>
									<button>
										<img
											src="https://firebasestorage.googleapis.com/v0/b/settle-io.appspot.com/o/images%2Ficons%2F003-rounded-add-button.png?alt=media&token=1a0a79f4-c459-4811-aec1-73530173c95c"
											alt="add"
										/>
									</button>
								</form>
							)}
							{this.state.suggestion2done ? (
								<div className="editablesuggestion">
									<p>{this.state.suggestion2}</p>
									<button onClick={this.editTwo}>
										<img
											src="https://firebasestorage.googleapis.com/v0/b/settle-io.appspot.com/o/images%2Ficons%2Fbackspace-arrow.png?alt=media&token=55eb66ee-6b56-48bf-b866-ac04bedb077d"
											alt="delete"
										/>
									</button>
								</div>
							) : (
								<form className="submitlist" onSubmit={this.submitTwo}>
									<input
										autoComplete="off"
										tabIndex="2"
										onChange={this.onChange}
										name="suggestion2"
										value={this.state.suggestion2}
										required
									/>
									<button>
										<img
											src="https://firebasestorage.googleapis.com/v0/b/settle-io.appspot.com/o/images%2Ficons%2F003-rounded-add-button.png?alt=media&token=1a0a79f4-c459-4811-aec1-73530173c95c"
											alt="add"
										/>
									</button>
								</form>
							)}
							{this.state.suggestion3done ? (
								<div className="editablesuggestion">
									<p>{this.state.suggestion3}</p>
									<button onClick={this.editThree}>
										<img
											src="https://firebasestorage.googleapis.com/v0/b/settle-io.appspot.com/o/images%2Ficons%2Fbackspace-arrow.png?alt=media&token=55eb66ee-6b56-48bf-b866-ac04bedb077d"
											alt="delete"
										/>
									</button>
								</div>
							) : (
								<form className="submitlist" onSubmit={this.submitThree}>
									<input
										autoComplete="off"
										tabIndex="3"
										onChange={this.onChange}
										name="suggestion3"
										value={this.state.suggestion3}
										required
									/>
									<button>
										<img
											src="https://firebasestorage.googleapis.com/v0/b/settle-io.appspot.com/o/images%2Ficons%2F003-rounded-add-button.png?alt=media&token=1a0a79f4-c459-4811-aec1-73530173c95c"
											alt="add"
										/>
									</button>
								</form>
							)}
						</div>
					</div>
					{//only displays the Start Settle button for the creator && if all participants have submitted their suggestions
					!this.state.suggestion1done ||
					!this.state.suggestion2done ||
					!this.state.suggestion3done ? (
						<p className="inactivestatus">Add your suggestions!</p>
					) : this.state.creator && suggestions / participants === 3 ? (
						<button className="startsettle" onClick={this.onClick}>
							{" "}
							Start Settle{" "}
							<img
								alt="submit arrow"
								src="https://firebasestorage.googleapis.com/v0/b/settle-io.appspot.com/o/images%2Ficons%2F006-right-arrow.png?alt=media&token=4e005751-6488-4415-85e8-25c00fae8cdf"
							/>{" "}
						</button>
					) : this.state.creator && suggestions / participants !== 3 ? (
						<p className="inactivestatus">Waiting until everyone is ready</p>
					) : suggestions / participants !== 3 ? (
						<p className="inactivestatus">
							Waiting for all participants to submit suggestions
						</p>
					) : suggestions / participants === 3 ? (
						<p className="inactivestatus">
							Waiting for the creator to begin the settle
						</p>
					) : (
						<></>
					)}
				</div>
			</>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		user: state.userRdcr.user,
		participants: state.settleRdcr.participants,
	};
};

export default connect(mapStateToProps, { getUser, getParticipants })(Inactive);
