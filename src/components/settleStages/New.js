import React, {Component} from "react";
import Header from "../Header";
import axios from 'axios';
import { toast } from "react-toastify";
import MaskedInput from 'react-text-mask'

class New extends Component{
	constructor(){
		super()
		this.state={
			emails: [],
			email: '',
			number: '',
			numbers: []
		}
	}

	componentDidMount(){
		//adds user to user_settles
		axios.put(`/api/settle/${this.props.id}/adduser`)
		.then(()=>console.log('user added to settle'))
		.catch(err=>console.log(err))
	}

	onChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value
		})
	}

	onClick = () => {
		//send email invites
		if(this.state.emails.length>0){
			this.state.emails.forEach((e,i)=>{
				axios
					.post("/api/nodemailer", {
						link: `https://settleit.app${this.props.url}`,
						email: e
					})
					.then(response => console.log(response))
					.catch(err => console.log(err));
			})
		}
		if(this.state.email.includes('@')){
			axios
				.post("/api/nodemailer", {
					link: `https://settleit.app${this.props.url}`,
					email: e
				})
				.then(response => console.log(response))
				.catch(err => console.log(err));
		}
		//send text invites
		if(this.state.numbers.length>0){
			this.state.numbers.forEach((e,i)=>{
				axios
					.post("/api/twilio", {
						link: `https://settleit.app${this.props.url}`,
						number: "+1" + e
					})
					.then(response => console.log(response))
					.catch(err => console.log(err));
			})
		}
		if(this.state.number.length===10){
			axios
				.post("/api/twilio", {
					link: `https://settleit.app${this.props.url}`,
					number: "+1" + e
				})
				.then(response => console.log(response))
				.catch(err => console.log(err));
		}
		//set new to false in db and isnew to false in state
		axios.put(`/api/settle/${this.props.id}/removenew`)
		.then((response)=>{
			this.props.changeStage('inactive')
		})
		.catch(err=>console.log(err))
	}

	addEmail = (e) => {
		e.preventDefault()
		if(this.state.email){
			this.setState({ emails: [...this.state.emails, this.state.email] }, this.setState({ email: '' }))
		}
	}

	addNumber = (e) => {
		e.preventDefault()
		if(this.state.number){
			this.setState({ numbers: [...this.state.numbers, this.state.number] }, this.setState({ number: '' }))
		}
	}

	copy = (e) => {;
		e.preventDefault()
		var copyText = document.getElementById("settlelink");
		copyText.select();
		document.execCommand("copy");
		toast.info("Copied!", {
			autoClose: 900,
			hideProgressBar: true
		});
	}

	render(){
		const displayemails = this.state.emails.map((e,i)=> (<li className="inviteform" key={i}>{e}<button onClick={()=>{
			let emails = this.state.emails.slice()
			emails.splice(i,1)
			this.setState({emails})
			}}><img src="https://firebasestorage.googleapis.com/v0/b/settle-io.appspot.com/o/images%2Ficons%2Fbackspace-arrow.png?alt=media&token=55eb66ee-6b56-48bf-b866-ac04bedb077d" alt="delete"></img></button></li>))
		const displaynumbers = this.state.numbers.map((e,i)=><li className="inviteform" key={i}>{e}<button onClick={()=>{
			let numbers = this.state.numbers.slice()
			numbers.splice(i,1)
			this.setState({numbers})
			}}><img src="https://firebasestorage.googleapis.com/v0/b/settle-io.appspot.com/o/images%2Ficons%2Fbackspace-arrow.png?alt=media&token=55eb66ee-6b56-48bf-b866-ac04bedb077d" alt="delete"></img></button></li>)
		return <>
				<Header />
				<div className="new">
					<div className="settlelink">
						<p>Invite friends via link:</p>
						<form className="inviteform">
						<input id="settlelink" readOnly value={`https://settleit.app${this.props.url}`} />
							<button onClick={this.copy} className="copybutton"><img src="https://firebasestorage.googleapis.com/v0/b/settle-io.appspot.com/o/images%2Ficons%2F001-copy-file.png?alt=media&token=6ade3f9b-06c0-46aa-82b4-6d69f7265d36" alt="copy"></img></button>
						</form>
					</div>
					<div className="emailcontainer">
						<p>Invite friends via email:</p>
						<form className="inviteform" onSubmit={this.addEmail}>
							<input type="email" name="email" value={this.state.email} onChange={this.onChange} />
							<button><img src="https://firebasestorage.googleapis.com/v0/b/settle-io.appspot.com/o/images%2Ficons%2F003-rounded-add-button.png?alt=media&token=1a0a79f4-c459-4811-aec1-73530173c95c" alt="add"></img></button>
						</form>
						<ul className="invitelist">{displayemails}</ul>
					</div>
					<div className="numbercontainer">
						<p>Invite friends via text:</p>
						<form className="inviteform" onSubmit={this.addNumber}>
						<MaskedInput
							mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
							name="number"
							value={this.state.number}
							onChange={this.onChange}
						/>
							<button><img src="https://firebasestorage.googleapis.com/v0/b/settle-io.appspot.com/o/images%2Ficons%2F003-rounded-add-button.png?alt=media&token=1a0a79f4-c459-4811-aec1-73530173c95c" alt="add"></img></button>
						</form>
						<ul className="invitelist">{displaynumbers}</ul>
					</div>
					<button className="nextbutton" onClick={this.onClick}>
						Submit <img alt="submit arrow" src="https://firebasestorage.googleapis.com/v0/b/settle-io.appspot.com/o/images%2Ficons%2F006-right-arrow.png?alt=media&token=4e005751-6488-4415-85e8-25c00fae8cdf" />
					</button>
				</div>
			</>;
	}
};

export default New;