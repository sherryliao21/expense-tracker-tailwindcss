const express = require('express')
const router = express.Router()
const Record = require('../../models/record')

router.get('/', async (req, res) => {
  try {
    const userId = req.user._id
    const records = await Record.find({ userId }).sort({ date: 'desc' }).lean()
    let totalAmount = 0
    const monthOptions = new Set()
    const categoryOptions = new Set()
    const type = 'total'

    await records.forEach((record) => {
      const date = new Date(record.date)
      monthOptions.add(
        date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString()
      )
      const category = record.category
      categoryOptions.add(category)

      if (record.recordType === 'income') {
        totalAmount += record.amount
      } else {
        totalAmount -= record.amount
      }
    })

    return res.render('index', {
      records,
      monthOptions,
      categoryOptions,
      type,
      totalAmount,
    })
  } catch (error) {
    console.log(error)
  }
})

router.get('/filter', async (req, res) => {
  try {
    const userId = req.user._id
    const { category, date, type } = req.query
    const monthOptions = new Set()
    const categoryOptions = new Set()

    // create filterCondition object to store query filters
    let filterCondition = { userId } // first pass in userId

    // add type filter
    if (type && type !== 'total') {
      filterCondition = {
        ...filterCondition,
        recordType: type,
      }
    }
    // add month filter
    if (date && date !== 'all') {
      const [year, month] = date.split('-')
      const startDate = new Date(year, month - 1)
      const endDate = new Date(year, month, 0)
      filterCondition = {
        ...filterCondition,
        date: {
          $gte: startDate.toISOString().split('T')[0],
          $lt: endDate.toISOString().split('T')[0],
        },
      }
    }
    // add category filter
    if (category && category !== 'all') {
      filterCondition = {
        ...filterCondition,
        category,
      }
    }
    const records = await Record.find(filterCondition)
      .sort({ date: 'desc' })
      .lean()

    let totalAmount = 0

    await records.forEach((record) => {
      const date = new Date(record.date)
      monthOptions.add(
        date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString()
      )
      const category = record.category
      categoryOptions.add(category)

      if (record.recordType === 'income') {
        totalAmount += record.amount
      } else {
        totalAmount -= record.amount
      }
    })

    return res.render('index', {
      records,
      monthOptions,
      categoryOptions,
      category,
      date,
      type,
      totalAmount,
    })
  } catch (error) {
    console.log(error)
  }
})

module.exports = router
