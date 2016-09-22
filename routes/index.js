'use strict'

const { Router } = require('express')
const bcrypt = require('bcrypt')

const router = Router()

const User = require('../models/user')

router.get('/', (req, res) =>
	res.render('index')
)

router.get('/login', (req, res) =>
	res.render('login', {page: 'Login'})
)

router.get('/register', (req, res) =>
	res.render('register', {page: 'Register'})
)

// Clicking submit on the pug will create a form object
router.post('/register', (req, res) => {
	//console.log("req.body", req.body);
	if (req.body.password === req.body.confirmation) {
		// save data
		console.log("req.body", req.body);
		User.create( req.body )
		res.redirect('/')
	} else {
		// Message tied to reg.pug file
		res.render('register', {msg: 'Passwords do not match'})
	}
})

router.post('/login', ({session, body: {email, password}}, res, err) => {
	User.findOne({ email })
	.then(user => {
		if (user) {
			return new Promise((resolve, reject) => {
				bcrypt.compare(password, user.password, (err, matches) => {
					if (err) {
						reject(err)
					} else {
						resolve(matches)
					}
				})
			})
		} else {
			res.render('login', {msg: 'Email does not exist in our system'})
		}
	})
	.then((matches) => {
		if (matches) {
			session.email = email
			res.redirect('/')
		} else {
			res.render('login', {msg: 'Password does not match'})
		}
	})
})

module.exports = router
