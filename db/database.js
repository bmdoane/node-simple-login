'use strict'
// changes out mongodb for mongoose
// The databse is available throughout the app
const mongoose = require('mongoose')

// String - database/localhost:mongodPort/databaseName
const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/simpleLogin'

// Says use native node promise library (instead of mongoose promise)
mongoose.Promise = Promise

// Exporting connection to server whether local or remote
module.exports.connect = () => mongoose.connect(MONGODB_URL)
module.exports.disconnect = () => mongoose.disconnect()