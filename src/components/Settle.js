import React, { Component } from 'react';
import axios from 'axios';
import New from './settleStages/New';
import Inactive from './settleStages/Inactive';
import Active from './settleStages/Active';
import Completed from './settleStages/Completed';

class Settle extends Component {
	constructor(){
		super()
		this.state={
			settle: {}
		}
	}
	//retrieves the settle from the db using the id from the url and adds it to state- redirects if the settle doesnt exist in db
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

	render() {
		const stage = this.state.settle.stage
		//return a different component depending on the stage of the current settle
		//New > Inactive > Active > Completed > Nonexistant
		return (
			<>
			{stage=== 'new' ? <New/> : stage === 'inactive' ? <Inactive /> : stage === 'active' ? <Active /> : stage === 'completed' ? <Completed /> : <></> }
			</>
		)
	}
}

export default Settle;