const express = require('express')
const router = express.Router()

const Record = require('../../models/record')

router.get('/', (req, res) => {
  const userId = req.user._id
  const category = req.query.category
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
    .sort({ date: 'asc' })
    .then(records => res.render('index', { records }))
    .catch(error => console.log(error))

})

module.exports = router