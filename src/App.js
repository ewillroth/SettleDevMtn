import React, { Component } from 'react';
import routes from './routes';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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
			<ToastContainer/>
			</div>
		);
	}
}

export default App;
