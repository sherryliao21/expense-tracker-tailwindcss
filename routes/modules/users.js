const express = require('express')
const router = express.Router()
const User = require('../../models/user')
const passport = require('passport')
const bcrypt = require('bcryptjs')
const { authenticator } = require('../../middleware/auth')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const multer = require('multer') // file upload middleware
const upload = multer({ dest: 'temp/' }) // upload to temp folder

router.get('/login', (req, res) => {
	res.render('login')
})

router.get('/register', (req, res) => {
	res.render('register')
})

router.get('/logout', (req, res) => {
	req.logOut() // a function which eliminates this session at the moment, provided by passport.js
	req.flash('success_msg', '你已成功登出！')
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
			errors.push({ message: '所有欄位都是必填！' })
			console.log(errors)
		}
		if (password !== confirmPassword) {
			errors.push({ message: '密碼與確認密碼不一致！' })
			console.log(errors)
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
			errors.push({ message: '此信箱已註冊過' })
			res.render('login', {
				errors,
				name,
				email,
				password,
				confirmPassword
			})
		} else {
			const salt = await bcrypt.genSalt(10)
			const hash = await bcrypt.hash(password, salt)
			await User.create({
				name,
				email,
				password: hash
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
				errors.push({ message: '所有欄位都是必填！' })
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

			return res.redirect('/')
		} catch (error) {
			console.log(error)
		}
	})

module.exports = router
