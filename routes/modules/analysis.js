const express = require("express")
const router = express.Router()
const passport = require("passport")
const Chart = require("chart.js")
const Record = require("../../models/record")

router.get("/", async (req, res) => {
	try {
		const userId = req.user._id
		const records = await Record.find({ userId }).sort({ date: "desc" }).lean()
		const monthOptions = new Set()
		const categoryOptions = new Set()
		const type = "total"
		let totalAmount = 0

		const categories = ["餐飲食品", "家居物業", "交通出行", "休閒娛樂", "其他"]
		const categoryAmount = [0, 0, 0, 0, 0]

		records.forEach(record => {
			const date = new Date(record.date)
			monthOptions.add(
				date.getFullYear().toString() + "-" + (date.getMonth() + 1).toString()
			)
			const category = record.category
			categoryOptions.add(category)

			if (record.recordType === "income") {
				totalAmount += record.amount
			} else {
				totalAmount -= record.amount
			}

			/////////////////////////// count categoryAmount
			for (let i in categories) {
				if (record.category === categories[i]) {
					if (record.recordType === "income") {
						categoryAmount[i] += record.amount
					} else {
						categoryAmount[i] -= record.amount
					}
				}
			}
		})

		const limit = 6
		const RECORDS_PER_PAGE = records.length / limit
		const pages = Array.from(Array(Math.ceil(RECORDS_PER_PAGE)).keys()).map(
			page => page + 1
		)

		return res.render("analysis", {
			records: records.slice(0, limit),
			monthOptions,
			categoryOptions,
			type,
			totalAmount,
			pages,
			categoryAmount,
		})
	} catch (error) {
		console.log(error)
	}
})

router.get("/filter", async (req, res) => {
	try {
		const userId = req.user._id
		let { category, date, type } = req.query

		const monthOptions = new Set()
		const categoryOptions = new Set()

		// create filterCondition object to store query filters
		let filterCondition = { userId } // first pass in userId

		// add type filter
		if (type && type !== "total") {
			filterCondition = {
				...filterCondition,
				recordType: type,
			}
		}
		// add month filter
		if (date && date !== "all") {
			const [year, month] = date.split("-")
			const startDate = new Date(year, month - 1, 2)
			const endDate = new Date(year, month, 2)
			filterCondition = {
				...filterCondition,
				date: {
					$gte: startDate.toISOString().split("T")[0],
					$lt: endDate.toISOString().split("T")[0],
				},
			}
		}
		// add category filter
		if (category && category !== "all") {
			filterCondition = {
				...filterCondition,
				category,
			}
		}

		const records = await Record.find(filterCondition)
			.sort({ date: "desc" })
			.lean()

		// render total amount & category/month options
		let totalAmount = 0

		const categories = ["餐飲食品", "家居物業", "交通出行", "休閒娛樂", "其他"]
		const categoryAmount = [0, 0, 0, 0, 0]

		await records.forEach(record => {
			const date = new Date(record.date)
			monthOptions.add(
				date.getFullYear().toString() + "-" + (date.getMonth() + 1).toString()
			)
			const category = record.category
			categoryOptions.add(category)

			if (record.recordType === "income") {
				totalAmount += record.amount
			} else {
				totalAmount -= record.amount
			}
			/////////////////////////// count categoryAmount
			for (let i in categories) {
				if (record.category === categories[i]) {
					if (record.recordType === "income") {
						categoryAmount[i] += record.amount
					} else {
						categoryAmount[i] -= record.amount
					}
				}
			}
		})

		// render pagination
		const page = req.query.page || 1
		const limit = 6
		const offset = (page - 1) * limit
		const endIndex = offset + limit
		const RECORDS_PER_PAGE = records.length / limit
		const pages = Array.from(Array(Math.ceil(RECORDS_PER_PAGE)).keys()).map(
			page => page + 1
		)

		return res.render("analysis", {
			records: records.slice(offset, endIndex),
			monthOptions,
			categoryOptions,
			category,
			date,
			type,
			totalAmount,
			page,
			pages,
			categoryAmount,
		})
	} catch (error) {
		console.log(error)
	}
})

module.exports = router
