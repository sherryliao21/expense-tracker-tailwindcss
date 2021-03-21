const express = require('express')
const router = express.Router()

const Record = require('../../models/record')

router.get('/', (req, res) => {
  const userId = req.user._id
  const category = req.query.category
  const month = req.query.month
  const months = []
  if (category) {
    if (month) {
      return Record.find({ userId, category, month })
        .lean()
        .sort({ date: 'desc' })
        .then(records => {
          for (let i = 0; i < records.length; i++) {
            months.push({ month: records[i].month })
          }
          const set = new Set();
          const monthOptions = months.filter(item => !set.has(item.month) ? set.add(item.month) : false)
          return res.render('index', { records, monthOptions, category, month })
        })
        .catch(error => console.log(error))
    }
    return Record.find({ userId, category })
      .lean()
      .sort({ date: 'desc' })
      .then(records => {
        for (let i = 0; i < records.length; i++) {
          months.push({ month: records[i].month })
        }
        const set = new Set();
        const monthOptions = months.filter(item => !set.has(item.month) ? set.add(item.month) : false)
        return res.render('index', { records, monthOptions, category, month })
      })
      .catch(error => console.log(error))
  }
  if (month) {
    if (category) {
      return Record.find({ userId, month, category })
        .lean()
        .sort({ date: 'desc' })
        .then(records => {
          for (let i = 0; i < records.length; i++) {
            months.push({ month: records[i].month })
          }
          const set = new Set();
          const monthOptions = months.filter(item => !set.has(item.month) ? set.add(item.month) : false)
          return res.render('index', { records, monthOptions, category, month })
        })
        .catch(error => console.log(error))
    }
    return Record.find({ userId, month })
      .lean()
      .sort({ date: 'desc' })
      .then(records => {
        for (let i = 0; i < records.length; i++) {
          months.push({ month: records[i].month })
        }
        const set = new Set();
        const monthOptions = months.filter(item => !set.has(item.month) ? set.add(item.month) : false)
        return res.render('index', { records, monthOptions, category, month })
      })
      .catch(error => console.log(error))
  }
  // if ((!category && !month) || (category === 'all' || month === 'all')) {
  // if (!category && !month) {
  return Record.find({ userId })
    .lean()
    .sort({ date: 'desc' })
    .then(records => {
      for (let i = 0; i < records.length; i++) {
        months.push({ month: records[i].month })
      }
      const set = new Set();
      const monthOptions = months.filter(item => !set.has(item.month) ? set.add(item.month) : false)
      res.render('index', { records, monthOptions, month })
    })
    .catch(error => console.log(error))
  // }

})

module.exports = router