const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')

router.get('/new', async (req, res) => {
	try {
		const categoryOptions = new Set()
		const category = await Category.find().lean()
		category.forEach(item => {
			categoryOptions.add(item.name)
		})
		return res.render('newEdit', { categoryOptions })
	} catch (error) {
		console.log(error)
	}
})

router.get('/:id/edit', async (req, res) => {
	try {
		const userId = req.user._id
		const _id = req.params.id
		const categoryOptions = new Set()
		const category = await Category.find().lean()
		category.forEach(item => {
			categoryOptions.add(item.name)
		})
		const record = await Record.findOne({ userId, _id }).lean()
		return res.render('newEdit', { record, categoryOptions })
	} catch (error) {
		console.log(error)
	}
})

router.post('/', async (req, res) => {
	try {
		const userId = req.user._id
		const { name, date, category, amount, merchant, type } = req.body
		const errors = []
		if (
			!name.trim() ||
			!date ||
			!category ||
			!amount.trim() ||
			!merchant.trim() ||
			!type
		) {
			errors.push({ message: '所有欄位都是必填！' })
		}
		if (errors.length) {
			console.log(errors)
			return res.render('newEdit', {
				errors,
				name,
				date,
				category,
				amount,
				merchant,
				type
			})
		}
		if (category) {
			const selectedCategory = await Category.find({ name: category }).lean()
			await Record.create({
				name,
				date,
				icon: selectedCategory[0].icon,
				category,
				amount,
				merchant,
				userId,
				recordType: type
			})
			return res.redirect('/')
		}
	} catch (error) {
		console.log(error)
	}
})

router.put('/:id', async (req, res) => {
	try {
		const userId = req.user._id
		const _id = req.params.id
		const { name, date, category, amount, merchant, type } = req.body
		if (category) {
			const selectedCategory = await Category.find({ name: category }).lean()
			const record = await Record.findOne({ userId, _id })

			record.name = name
			record.date = date
			record.icon = selectedCategory[0].icon
			record.category = category
			record.amount = amount
			record.merchant = merchant
			record.recordType = type

			await record.save()

			return res.redirect('/')
		}
	} catch (error) {
		console.log(error)
	}
})

router.delete('/:id', async (req, res) => {
	try {
		const userId = req.user._id
		const _id = req.params.id
		const record = await Record.findOne({ _id, userId })

		await record.remove()

		return res.redirect('/')
	} catch (error) {
		console.log(error)
	}
})

module.exports = router
