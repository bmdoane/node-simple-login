'use strict'

const { Router } = require('express')
const bcrypt = require('bcrypt')

const router = Router()

const User = require('../models/user')

router.get('/', (req, res) =>
	res.render('index')
)

router.get('login', (req, res) =>
	res.render('login', {page: 'Login'})
)

router.get('register', (req, res) =>
	res.render('register', {page: 'Register'})
)

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
			res.render('login', {msg: 'Password does not match'}
		}
	})
})
