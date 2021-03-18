const express = require('express')
const router = express.Router()

const Record = require('../../models/record')

router.get('/', (req, res) => {
  const userId = req.user._id
  const category = req.query.category
  const month = req.query.month
  const months = []
  if (category && category !== 'all') {
    return Record.find({ userId, category })
      .lean()
      .then(records => {
        for (let i = 0; i < records.length; i++) {
          months.push({ month: records[i].month })
        }
        const set = new Set();
        const monthOptions = months.filter(item => !set.has(item.month) ? set.add(item.month) : false)
        if (month && month !== 'all') {
          let newList = records.filter(record => {
            return record.month === month
          })
          return res.render('index', { records: newList, monthOptions, category, month })
        } else {
          return res.render('index', { records, monthOptions, category, month })
        }
      })
      .catch(error => console.log(error))
  }
  if (month && month !== 'all') {
    return Record.find({ userId, month })
      .lean()
      .then(records => {
        for (let i = 0; i < records.length; i++) {
          months.push({ month: records[i].month })
        }
        const set = new Set();
        const monthOptions = months.filter(item => !set.has(item.month) ? set.add(item.month) : false)
        if (category && category !== 'all') {
          let newList = records.filter(record => {
            return record.category === category
          })
          return res.render('index', { records: newList, monthOptions, category, month })
        } else {
          return res.render('index', { records, monthOptions, category, month })
        }
      })
      .catch(error => console.log(error))
  }
  if ((!category && !month) || (category === 'all' || month === 'all')) {
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
  }

})

module.exports = router