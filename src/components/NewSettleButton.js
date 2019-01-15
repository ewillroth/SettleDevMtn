import React, {Component} from 'react';
import { connect } from 'react-redux';
import {createSettle} from '../redux/reducers/settleReducer'

class NewSettleButton extends Component {
	render(){
		return (
			<button 
			className='newsettle'
			onClick={()=>{
				this.props.createSettle()
				.then(response => this.props.reroute(`/settle/${response.value.data.settle_id}`))
				.catch(err=>console.log(err))}}
			>Create Settle</button>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		user_id: state.userRdcr.user.user_id
	}
}

export default connect(mapStateToProps, {createSettle})(NewSettleButton);
