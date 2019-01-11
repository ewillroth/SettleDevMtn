require('dotenv').config()
const express = require('express');
const massive = require('massive');
const { json } = require('body-parser');
const session = require('express-session');
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
		maxAge: 1000 * 60 * 60 * 24 * 3
	}
}))

// ENDPOINTS


app.listen(port, ()=>console.log(`listening on ${port}`))