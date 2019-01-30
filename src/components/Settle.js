import React, { Component } from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import New from './settleStages/New';
import Inactive from './settleStages/Inactive/Inactive';
import Active from './settleStages/Active/Active';
import Completed from './settleStages/Completed';
import {getUser} from '../redux/reducers/userReducer';
import socketIOClient from "socket.io-client";

const socket = socketIOClient(process.env.REACT_APP_URL);

class Settle extends Component {
	constructor(){
		super()
		this.state={
			settle: {},
			update: false,
			new: false
		}
	}
	componentDidMount(){ 
		//joins the socket room with the settle id
		socket.emit('join', { room: this.props.match.params.id })
		socket.on('connection', ()=>{console.log('Socket:connected')})
		socket.on('change_stage', ()=>{
			console.log("Socket: changing stage")
			this.setState({update:!this.state.update})
		})
		socket.on('not_new', ()=>{
			console.log('socket:not new')
			this.setState({update:!this.state.update})
		})
		//retrieves the settle from db adds it to state- redirects to '/' if the settle doesnt exist in db
		axios.get(`/api/settle/${this.props.match.params.id}`)
		.then(response=>{
			if(response.data){
				this.setState({
					settle: response.data
				})
			}else{
				this.props.history.push('/')
			}
		})
		.catch(()=>this.props.history.push('/'))
	}

	componentDidUpdate(prevProps, prevState){
		if(this.state.update !== prevState.update){
			axios.get(`/api/settle/${this.props.match.params.id}`)
				.then(response => {
					if (response.data) {
						this.setState({
							settle: response.data
						})
					} else {
						this.props.history.push('/')
					}
				})
				.catch(() => this.props.history.push('/'))
		}
	}

	changeStage = (stage) =>{
		if(stage!=='inactive'){
			socket.emit('change_stage', this.props.match.params.id)
		}else{
			socket.emit('not_new')
		}
	}

	render() {
		const isnew = this.state.settle.new
		const stage = this.state.settle.stage
		const url = this.props.match.url
		const id = this.props.match.params.id
		const creator = this.state.settle.creator_id
		//return a different component depending on the stage of the current settle
		return (
			<div className="settlecontainer">{
			//new component is where the creator invites others to the settle
			isnew && this.props.user.user_id === this.state.settle.creator_id ? <New socket={socket} id={id} url={url} changeStage={this.changeStage}/> 
			//only allows creator of the settle to see the New component
			:isnew && this.props.user.user_id !== this.state.settle.creator_id 
			? <Inactive socket={socket} id={id} changeStage={this.changeStage} /> 
			//inactive component allows users to submit their suggestions
			: stage === 'inactive' ? <Inactive socket={socket} creator={creator} id={id} changeStage={this.changeStage}/> 
			//active component is where users settle
			: stage === 'active' ? <Active id={id} socket={socket} changeStage={this.changeStage}/> 
			//completed displays the winning suggestion
			: stage === 'completed' ? <Completed socket={socket} id={id}/> 
			: <></> }
			</div>
		)
	}
}


const mapStateToProps = state => {
	return {
		user: state.userRdcr.user
	}
}

export default connect(mapStateToProps, { getUser })(Settle);