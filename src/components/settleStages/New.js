import React, {Component} from "react";
import Header from "../Header";
import axios from 'axios';

class New extends Component{
	constructor(){
		super()
		this.state={
			emails: [],
			email: '',
			number: '',
			numbers: [],
		}
	}

	onChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value
		})
	}

	onClick = () => {
		//send email invites
		//send text invites
		//change stage of settle to inactive in db and parent state
		axios.put(`/api/settle/${this.props.id}/stage`, {status:'inactive'})
		.then(()=>{
			this.props.changeStage('inactive')
		})
		.catch(err=>console.log(err))
	}

	render(){
		const emails = this.state.emails.map((e,i)=> <li key={i}>{e}</li>)
		const numbers = this.state.numbers.map((e,i)=><li key={i}>{e}</li>)
		return (
			<div className="settlecontainer">
				<Header/>
				<div className="settlelink" >
					<p>Invite friends via link:</p>
					<input readOnly value={`http://localhost:3334${this.props.url}`}></input>
				</div>
				<div className="inviteboxes">
					<div className="emailcontainer">
						<p>Invite friends via email:</p>
						<input name="email" value={this.state.email} onChange={this.onChange}></input>
						<button onClick={() => { this.setState({ emails: [...this.state.emails, this.state.email] }, this.setState({email: ''})) }}>+</button>
						<ul>
							{emails}
						</ul>
					</div>
					<div className="numbercontainer">
						<p>Invite friends via text:</p>
						<input name="number" value={this.state.number} onChange={this.onChange}></input>
						<button onClick={() => { this.setState({ numbers: [...this.state.numbers, this.state.number] }, this.setState({ number: '' })) }}>+</button>
						<ul>
							{numbers}
						</ul>
					</div>
				</div>
				<button onClick={this.onClick}>Submit</button>
			</div>
		)
	}
};

export default New;
