const express = require("express")
const router = express.Router()
const Record = require("../../models/record")

router.get("/", async (req, res) => {
  try {
    const userId = req.user._id
    const records = await Record.find({ userId }).sort({ date: "desc" }).lean()
    const monthOptions = new Set()
    const categoryOptions = new Set()
    const type = "total"
    let totalAmount = 0

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
    })

    const limit = 5
    const RECORDS_PER_PAGE = records.length / limit
    const pages = Array.from(Array(Math.ceil(RECORDS_PER_PAGE)).keys()).map(
      page => page + 1
    )

    return res.render("home", {
      records: records.slice(0, limit),
      monthOptions,
      categoryOptions,
      type,
      totalAmount,
      pages,
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

    // render pagination
    const page = req.query.page || 1
    const limit = 5
    const offset = (page - 1) * limit
    const endIndex = offset + limit
    const RECORDS_PER_PAGE = records.length / limit
    const pages = Array.from(Array(Math.ceil(RECORDS_PER_PAGE)).keys()).map(
      page => page + 1
    )

    return res.render("home", {
      records: records.slice(offset, endIndex),
      monthOptions,
      categoryOptions,
      category,
      date,
      type,
      totalAmount,
      page,
      pages,
    })
  } catch (error) {
    console.log(error)
  }
})

module.exports = router
