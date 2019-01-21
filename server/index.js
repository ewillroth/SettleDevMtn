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
const io = require('socket.io')();

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

app.get('/api/user/settles', user.getSettles)

app.post('/api/twilio', twilio.sendInvite)
app.post('/api/nodemailer', nodemlr.sendInvite)


io.on('connection', socket=> {
	console.log('user connected'),
	socket.emit('hello', {greeting: 'hello world'})
	
	socket.on('disconnect', ()=>{
		console.log('user disconnected')
	})
	
	socket.on('name of event', data => {
		console.log('socket hears the event')
		socket.emit() //sends things to the person that gives you the event
		// socket.broadcast() //sends things to everyone
		// socket.broadcast.to('room1', 'whats up yall')
	})
})

server.listen(port, ()=>console.log(`listening on ${port}`))