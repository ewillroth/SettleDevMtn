import React, { Component } from 'react';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import {connect} from 'react-redux';
import New from './settleStages/New';
import Inactive from './settleStages/Inactive/Inactive';
import Active from './settleStages/Active';
import Completed from './settleStages/Completed';
import {getUser} from '../redux/reducers/userReducer';

class Settle extends Component {
	constructor(){
		super()
		this.state={
			settle: {}
		}
	}
	componentDidMount(){
		//retrieves the settle from db adds it to state- redirects to '/' if the settle doesnt exist in db
		axios.get(`/api/settle/${this.props.match.params.id}`)
		.then(response=>{
			if(response.data){
				this.setState({
					...this.state,
					settle: response.data
				})
			}else{
				this.props.history.push('/')
			}
		})
		.catch(()=>this.props.history.push('/'))

		//checks if there is a user on session and creates a guest user in db if not
		this.props.getUser()
			.then()
			.catch(() => {
				const guestemail = bcrypt.hashSync('email', 4)
				axios.post('/auth/register', { email: guestemail, name: 'guest', password: 'doesntmatter' })
					.then()
					.catch()
			})
	}



	changeStage = (stage) =>{
		this.setState({
			settle: {...this.state.settle, stage}
		})
	}

	render() {
		const stage = this.state.settle.stage
		const url = this.props.match.url
		const id = this.props.match.params.id
		//return a different component depending on the stage of the current settle
		//New > Inactive > Active > Completed > Nonexistant
		return (
			<>
			{stage=== 'new' ? <New id={id} url={url} changeStage={this.changeStage}/> 
			: stage === 'inactive' ? <Inactive id={id} changeStage={this.changeStage}/> 
			: stage === 'active' ? <Active /> 
			: stage === 'completed' ? <Completed /> 
			: <></> }
			</>
		)
	}
}


const mapStateToProps = state => {
	return {
		user: state.userRdcr.user
	}
}

export default connect(mapStateToProps, { getUser })(Settle);