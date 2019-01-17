import React, {Component} from 'react';
import dotenv from 'dotenv'
import io from 'socket.io-client'
dotenv.config()
const socketUrl = `http://localhost:${process.env.PORT}`

class Chat extends Component{
	constructor(props){
		super(props)

		this.state = {
			socket: null
		}
	}

	initSocket = () => {
		const socket = io(socketUrl)
		this.setState({socket})
	}

	render(){
		return(
			<div>

			</div>
		)
	}
}

export default Chat;