require('dotenv').config()
const express = require('express');
const massive = require('massive');
const { json } = require('body-parser');
const session = require('express-session');
const auth = require('./controllers/authController');
const settle = require('./controllers/settleController');
const user = require('./controllers/userController');
const twilio = require('./controllers/twilioController');
const nodemlr = require('./controllers/nodemailerController');

const app = express()
const port = process.env.PORT || 3001

//Socket.io
const server = require('http').createServer(app)
const io = require('socket.io')(server);

app.use(json())

massive(process.env.CONNECTION_STRING).then(db=>{
	app.set('db', db)
	console.log(`database connected`)
})

app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: true,
	saveUninitialized: false,
	cookie: {
		maxAge: 1000 * 60 * 60 * 24
	}
}))

// ENDPOINTS

app.get('/auth/me', auth.auth);
app.post('/auth/login', auth.login);
app.post('/auth/register', auth.register);
app.get('/auth/logout', auth.logout)
app.delete('/auth/me', auth.deleteUser)
app.put('/auth/picture', auth.updatePicture)

app.post('/api/settle', settle.create)
app.get('/api/settle/:id', settle.getSettle)
app.put('/api/settle/:id/stage', settle.updateStage)
app.put('/api/settle/:id/adduser', settle.addUser)
app.get('/api/settle/:id/participants', settle.getParticipants)
app.put('/api/settle/:id/submit', settle.addSuggestions)
app.put('/api/settle/:id/remove', settle.removeSuggestion)
app.get('/api/settle/:id/suggestions', settle.getSuggestions)
app.get('/api/settle/:id/usersuggestions', settle.getUserSuggestions)
app.get('/api/settle/:id/start', settle.beginSettle)
app.post('/api/settle/:id/donesubmitting', settle.doneSubmitting)
app.get('/api/settle/:id/donesubmitting', settle.checkIfDone)
app.put('/api/settle/:id/donesubmitting', settle.notDoneSubmitting)
app.put('/api/settle/:id/recordwinner', settle.recordWinner)
app.put('/api/settle/:id/delete', settle.deleteSuggestion)

app.get('/api/user/settles', user.getSettles)

app.post('/api/twilio', twilio.sendInvite)
app.post('/api/nodemailer', nodemlr.sendInvite)

io.on('connection', socket=> {
	console.log(`Socket: user connected`),
	socket.emit('connection')
	//console logs when a user disconnects from the server
	socket.on('disconnect', ()=>{
		console.log('Socket: user disconnected')
	})
	//adds user to room with given settle id
	socket.on('join', (data)=>{
		socket.join(data.room)
		console.log(`Socket: joined room ${data.room}`)
	})
	//leaves the room with given settle id 
	socket.on('leave', (data)=>{
		console.log('Socket: left room')
		socket.leave(data.room)
	})
	//when a user adds a suggestion returns a message to given room so clients will update
	socket.on('suggestion_added', (room)=>{
		console.log(`Socket: suggestion added`)
		io.sockets.in(room).emit("suggestion_added")
	})
	socket.on('suggestion_removed', (data)=>{
		console.log('Socket: suggestion removed')
		io.sockets.in(data.room).emit('suggestion_removed')
	})
	//sends message when settle stage changes
	socket.on('change_stage', room=>{
		console.log('Socket: change stage')
		io.sockets.in(room).emit('change_stage')
	})
	//when a user joins a settle returns a message to given room so clients will update
	socket.on('user_added', (data) => {
		console.log('Socket: user added to settle')
		io.sockets.in(data.room).emit('user_added') 
	})
	//when a user is ready returns a message to given room so clients will update
	socket.on('user_ready', data=>{
		console.log('Socket: user ready')
		io.sockets.in(data.room).emit('user_ready')
	})
})

server.listen(port, ()=>console.log(`listening on ${port}`))