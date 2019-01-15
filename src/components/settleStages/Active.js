import React, {Component} from 'react';
import axios from 'axios';
import Header from "../Header";

class Active extends Component{
	constructor(){
		super()
		this.state={
			participants: [],
			update: true
		}
	}

	componentDidMount(){
		//gets information from db about users and their suggestions
		axios.get(`/api/settle/${this.props.id}/participants/`)
			.then(response => {
				this.setState({
					participants: response.data,
					update: !this.state.update
				})
			})
			.catch(err => console.log(err))
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
		let list = this.state.participants.length>0?this.state.participants.map((e,i)=>{
			return (
			<>
			<li>{e.suggestion1}</li>
			<li>{e.suggestion2}</li>
			<li>{e.suggestion3}</li>
			</>
			)
		}):<></>
		return (
			<div className="settlecontainer">
			<Header />
			<ul>
				{list}
			</ul>
			</div>
		)
	}
}

export default Active;