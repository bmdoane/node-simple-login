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
router.post('/register', ({body: {email, password, confirmation}}, res, err) => {
	// This log no longer works since req is deconstructed
	//console.log("req.body", req.body);
	if (password === confirmation) {
		// To verify if email is already in db
		User.findOne({email})
			.then(user => {
				if (user) {
				res.render('register', { msg: 'Email is already registered'})
			} else {
				// save data
				return new Promise((resolve, reject) => {
					// Promise makes sure this resolves before user is created
					bcrypt.hash(password, 10, (err, hash) => {
						if (err) {
							reject(err)
						} else {
							resolve(hash)
						}
					})
				})
			}
		})				
		// This method needs to send an object, thus {}
		.then(hash => User.create({email, password: hash }))
		.then(() => res.redirect('/'))
		.catch(err)
	} else {
		// Message tied to reg.pug file
		res.render('register', {msg: 'Passwords do not match'})
	}
})

// When you install session
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

router.get('/logout', (req, res) => {
  if (req.session.email) {
    res.render('logout', { page: 'Logout'})
  } else {
    res.redirect('/login')
  }
})

router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) throw err
    res.redirect('/login')
  })
})

module.exports = router
