const express = require('express')
const router = express.Router()

const Record = require('../../models/record')

router.get('/', (req, res) => {
  const userId = req.user._id
  const category = req.query.category
  const month = req.query.month
  const months = []
  if (month && month !== 'all') {
    return Record.find({ userId, month })
      .lean()
      .then(records => {
        res.render('index', { records, month })
      })
      .catch(error => console.log(error))
  }
  if (category && category !== 'all') {
    return Record.find({ userId, category })
      .lean()
      .then(records => {
        res.render('index', { records, category })
      })
      .catch(error => console.log(error))
  }
  return Record.find({ userId })
    .lean()
    .sort({ date: 'desc' })
    .then(records => {
      for (let i = 0; i < records.length; i++) {
        months.push({ month: records[i].month })
      }
      const set = new Set();
      const monthOptions = months.filter(item => !set.has(item.month) ? set.add(item.month) : false)
      res.render('index', { records, monthOptions })
    })
    .catch(error => console.log(error))
})

module.exports = router