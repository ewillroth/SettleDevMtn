import React, {Component} from "react";
import Header from "../Header";
import axios from 'axios';
import { toast } from "react-toastify";

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

	componentDidMount(){
		//adds user to user_settles
		axios.put(`/api/settle/${this.props.id}/adduser`)
		.then()
		.catch(err=>console.log(err))
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

	copy = () => {
		/* Get the text field */
		var copyText = document.getElementById("settlelink");
		/* Select the text field */
		copyText.select();
		/* Copy the text inside the text field */
		document.execCommand("copy");
		/* Alert the copied text */
		toast.info("Copied the text: " + copyText.value);
	}
	

	render(){
		const displayemails = this.state.emails.map((e,i)=> (<li key={i}>{e}<button onClick={()=>{
			let emails = this.state.emails.slice()
			emails.splice(i,1)
			this.setState({emails})
			}}>X</button></li>))
		const displaynumbers = this.state.numbers.map((e,i)=><li key={i}>{e}<button onClick={()=>{
			let numbers = this.state.numbers.slice()
			numbers.splice(i,1)
			this.setState({numbers})
			}}>X</button></li>)
		return (
			<div className="new">
				<Header/>
				<div className="settlelink" >
					<p>Invite friends via link:</p>
					<input id="settlelink" readOnly value={`http://localhost:3334${this.props.url}`}></input>
					<button onClick={this.copy} className="copybutton">copy</button>
				</div>
				<div className="inviteboxes">
					<div className="emailcontainer">
						<p>Invite friends via email:</p>
						<input name="email" value={this.state.email} onChange={this.onChange}></input>
						<button onClick={() => { this.setState({ emails: [...this.state.emails, this.state.email] }, this.setState({email: ''})) }}>+</button>
						<ul className="invitelist">
							{displayemails}
						</ul>
					</div>
					<div className="numbercontainer">
						<p>Invite friends via text:</p>
						<input name="number" value={this.state.number} onChange={this.onChange}></input>
						<button onClick={() => { this.setState({ numbers: [...this.state.numbers, this.state.number] }, this.setState({ number: '' })) }}>+</button>
						<ul className="invitelist">
							{displaynumbers}
						</ul>
					</div>
				</div>
				<button onClick={this.onClick}>Submit</button>
			</div>
		)
	}
};

export default New;