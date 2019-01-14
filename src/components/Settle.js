import React, { Component } from 'react';
import axios from 'axios';
import New from './settleStages/New';
import Inactive from './settleStages/Inactive/Inactive';
import Active from './settleStages/Active';
import Completed from './settleStages/Completed';

class Settle extends Component {
	constructor(){
		super()
		this.state={
			settle: {}
		}
	}
	//retrieves the settle from the db using the id from the url and adds it to state- redirects to '/' if the settle doesnt exist in db
	componentDidMount(){
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

export default Settle;