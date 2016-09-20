'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const RedisStore = require('connect-redis')(session)
const routes = require('./routes/') // same as ./routes/index.js

// Initialize
const app = express()

// Configure
const port = process.env.Port || 3000
app.set('port', port)

app.set('view engine', 'pug')

if (process.env.Node_ENV !== 'production') {
	apps.locals.pretty = true
}

// Middlewares


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