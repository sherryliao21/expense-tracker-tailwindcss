const express = require('express')
const router = express.Router()
const User = require('../../models/user')
const Record = require('../../models/record')
const passport = require('passport')
const bcrypt = require('bcryptjs')
const { authenticator } = require('../../middleware/auth')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const multer = require('multer') // file upload middleware
const upload = multer({ dest: 'temp/' }) // upload to temp folder
const validator = require('validator')

router.get('/login', (req, res) => {
	res.render('login')
})

router.get('/register', (req, res) => {
	res.render('register')
})

router.get('/logout', (req, res) => {
	req.logOut() // a function which eliminates this session at the moment, provided by passport.js
	req.flash('success_msg', 'Successfully logged out!')
	res.redirect('/users/login')
})

router.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/users/login',
		failureFlash: true
	})
)

router.post('/register', async (req, res) => {
	try {
		const { name, email, password, confirmPassword } = req.body
		const errors = []
		if (!name || !email || !password || !confirmPassword) {
			errors.push({ message: 'All fields are required!' })
			console.log(errors)
		}
		if (!validator.equals(password, confirmPassword)) {
			errors.push({ message: 'Passwords do not match!' })
			console.log(errors)
		}
		if (!validator.isEmail(email)) {
			errors.push({ message: 'Please enter valid email address!'})
		}
		if (!validator.isByteLength(password, { min: 4, max: 8 })) {
    	errors.push({ message: 'Password does not meet the required length!' })
 		}

		if (errors.length) {
			console.log(errors)
			return res.render('register', {
				errors,
				name,
				email,
				password,
				confirmPassword
			})
		}
		const user = await User.findOne({ email })
		if (user) {
			errors.push({ message: 'This email has been registered!' })
			res.render('register', {
				errors,
				name,
				email,
				password,
				confirmPassword
			})
		} else {
			const salt = await bcrypt.genSalt(10)
			const hash = await bcrypt.hash(password, salt)
			const user = await User.create({
				name,
				email,
				password: hash
			})
			const date = new Date()
			await Record.create({
				name: 'example',
				icon: 'fas fa-pen',
				category: 'Others',
				merchant: 'example',
				amount: 100,
				userId: user.id,
				recordType: 'expense',
				date: date.getFullYear().toString() + "-" + (date.getMonth() + 1).toString()
			})
			return res.redirect('/')
		}
	} catch (error) {
		console.log(error)
	}
})

router.route('/settings/edit').get(authenticator, async (req, res) => {
	try {
		const { _id } = req.user
		const user = await User.findOne({ _id }).lean()
		return res.render('settings', {
			user
		})
	} catch (error) {
		console.log(error)
	}
})

router
	.route('/settings')
	.put(authenticator, upload.single('avatar'), async (req, res) => {
		try {
			const { _id } = req.user
			const user = await User.findOne({ _id })

			const { name } = req.body

			const errors = []
			if (!name) {
				errors.push({ message: 'Please fill out every filed!' })
			}

			if (errors.length) {
				return res.render('settings', {
					errors,
					user: user.toJSON()
				})
			}

			user.name = name || user.name

			const file = req.file
			if (file) {
				imgur.setClientID(IMGUR_CLIENT_ID)
				await new Promise((resolve, reject) => {
					imgur.upload(file.path, (err, img) => {
						resolve((user.avatar = img.data.link))
					})
				})
			} else {
				user.avatar = user.avatar
			}

			await user.save()
			req.flash('success_msg', 'Successfully updated!')
			return res.redirect('/users/settings/edit')
		} catch (error) {
			console.log(error)
		}
	})

module.exports = router
