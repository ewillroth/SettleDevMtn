import React, {Component} from "react";
import Header from "../Header";
import axios from "axios";

class Completed extends Component{
	constructor(props){
		super(props)
		this.state={
			winner: ''
		}
	}

	componentDidMount(){
		axios.get(`/api/settle/${this.props.id}/suggestions`)
		.then(response=>this.setState({winner:response.data[0].suggestion}))
		.catch(err=>console.log(err))
	}

	render(){
		return (
			<div className="completed">
				<Header />
				<div className="winner">
					{this.state.winner?this.state.winner:null}
				</div>
				<div className="sharing">

				</div>
			</div>
		)
	}
};

export default Completed;
