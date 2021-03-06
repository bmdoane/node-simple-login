'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const RedisStore = require('connect-redis')(session)
const routes = require('./routes/') // same as ./routes/index.js
const { connect, disconnect } = require('./db/database')

// Initialize
const app = express()

// Configure
const port = process.env.PORT || 3000
app.set('port', port)

// Pug Config
app.set('view engine', 'pug')

if (process.env.Node_ENV !== 'production') {
	app.locals.pretty = true
}

// Middlewares - after instantiation and before routes
app.use(session({
	store: new RedisStore({
		url: process.env.REDIS_URL || 'redis://localhost:6379'
	}),
	secret: 'simpleloginsupersecretkey'
}))

app.use((req, res, next) => {
	app.locals.email = req.session && req.session.email
	next()
})

 
app.use(bodyParser.urlencoded({ extended: false }))

// Routes
app.use(routes)

// Listen to requests on the provided port and log when available
connect()
	.then(() => {
		app.listen(port, () =>
			console.log(`Listening on port: ${port}`)
		)
	})
	.catch(console.error)
