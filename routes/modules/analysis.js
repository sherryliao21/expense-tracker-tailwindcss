const express = require("express")
const router = express.Router()
const passport = require("passport")
const Chart = require("chart.js")
const Record = require("../../models/record")

router.get("/", async (req, res) => {
	try {
		const userId = req.user._id
		const records = await Record.find({ userId }).sort({ date: "desc" }).lean()
		let totalAmount = 0
		const monthOptions = new Set()
		const categoryOptions = new Set()
		const type = "total"

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
		})

		return res.render("analysis", {
			records,
			monthOptions,
			categoryOptions,
			type,
		})
	} catch (error) {
		console.log(error)
	}
})

module.exports = router
