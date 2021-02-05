const express = require('express')
const router = express.Router()

const Record = require('../../models/record')

router.get('/', (req, res) => {
  const category = req.query.category
  if (category && category !== 'all') {
    return Record.find({ category })
      .lean()
      .then(records => {
        res.render('index', { records })
      })
      .catch(error => console.log(error))
  } else {
    Record.find()
      .lean()
      .sort({ date: 'asc' })
      .then(records => res.render('index', { records }))
      .catch(error => console.log(error))
  }
})

module.exports = router