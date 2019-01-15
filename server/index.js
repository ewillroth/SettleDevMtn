require('dotenv').config()
const express = require('express');
const massive = require('massive');
const { json } = require('body-parser');
const session = require('express-session');
const auth = require('./controllers/authController');
const settle = require('./controllers/settleController');
const app = express()
const port = process.env.PORT || 3001

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

app.post('/api/settle', settle.create)
app.get('/api/settle/:id', settle.getSettle)
app.put('/api/settle/:id/stage', settle.updateStage)
app.put('/api/settle/:id', settle.addSuggestions)

app.listen(port, ()=>console.log(`listening on ${port}`))