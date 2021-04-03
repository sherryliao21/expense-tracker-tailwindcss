const express = require('express')
const router = express.Router()

const Category = require('../../models/category')
const Record = require('../../models/record')

router.get('/', (req, res) => {
  const userId = req.user._id
  const category = req.query.category
  const yearMonth = req.query.yearMonth
  const monthOptions = new Set();
  const categoryOptions = new Set()

  let filterCondition = { userId }
  if (yearMonth && yearMonth !== 'all') {
    const [year, month] = yearMonth.split('-')
    const startDate = new Date(year, month - 1)
    const endDate = new Date(year, month, 0)
    filterCondition = {
      ...filterCondition,
      date: {
        $gte: startDate.toISOString().split('T')[0],
        $lt: endDate.toISOString().split('T')[0]
      }
    }
  }
  if (category && category !== 'all') {
    filterCondition = {
      ...filterCondition,
      category
    }
  }

  return Record.find(filterCondition)
    .sort({ date: 'asc' })
    .lean()
    .then(records => {
      records.forEach(record => {
        let date = new Date(record.date);
        monthOptions.add(date.getFullYear().toString() + "-" + (date.getMonth() + 1).toString())
        let category = record.category
        categoryOptions.add(category)
      })

      return res.render('index', { records, monthOptions, categoryOptions, category, yearMonth })
    })
    .catch(error => console.log(error))
})

module.exports = router