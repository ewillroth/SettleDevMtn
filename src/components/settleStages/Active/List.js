import React, {Component} from 'react';
import axios from 'axios';

class List extends Component {
	constructor(){
		super()
		this.state={
			suggestions: []
		}	
	}

	componentDidMount(){
		//gets suggestions and makes the list
		axios.get(`/api/settle/${this.props.id}/suggestions`)
			.then(response => {
				let arr = response.data
				let suggestions = []
				arr.forEach((e, i) => { suggestions.push(e.suggestion) })
				this.setState({ suggestions })
			})
			.catch(err => console.log(err))
	}

	componentDidUpdate(prevProps, prevState){
		if(this.props.suggestions !== prevProps.suggestions){
			//updates the list when parent updates number of suggestions
			axios.get(`/api/settle/${this.props.id}/suggestions`)
				.then(response => {
					let arr = response.data
					let suggestions = []
					arr.forEach((e, i) => { suggestions.push(e.suggestion) })
					this.setState({ suggestions })
				})
				.catch(err => console.log(err))
		}
	}

	render(){
		const list = this.state.suggestions.map((e, i) => {
			return (
					<p key={i}>{e}</p>
			)
		})
		return (
			<div>
				{list}
			</div>
		)
	}
}

export default List;