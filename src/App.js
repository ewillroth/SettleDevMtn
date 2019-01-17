import React, { Component } from 'react';
import routes from './routes'


class App extends Component {
	// componentDidMount() {
	// 	const {endpoint} = 'http://localhost:PORT'
	// 	const socket = socketIOCLient(endpoint)
	// 	socket.on('hello', res=>console.log(res))
	// }
	render() {
		return (
			<div className="App">
			{routes}
			</div>
		);
	}
}

export default App;
