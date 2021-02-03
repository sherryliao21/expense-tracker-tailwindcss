const express = require('express')
const router = express.Router()

const Record = require('../../models/record')
const Category = require('../../models/category')

router.get('/new', (req, res) => {
  return res.render('new')
})

router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  return Record.findById(id)
    .lean()
    .then(record => res.render('edit', { record }))
    .catch(error => console.log(error))
})

router.post('/', (req, res) => {
  const { name, date, category, amount } = req.body
  let icon = ''
  if (category === 'food') {
    icon = 'fas fa-utensils'
  } else if (category === 'transportation') {
    icon = 'fas fa-shuttle-van'
  } else if (category === 'entertainment') {
    icon = 'fas fa-grin-beam'
  } else if (category === 'housing') {
    icon = "fas fa-home"
  } else if (category === 'others') {
    icon = "fas fa-pen"
  }
  return Record.create({ name, date, icon, category, amount })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

router.put('/:id', (req, res) => {
  const id = req.params.id
  const { name, date, category, amount } = req.body
  let icon = ''
  if (category) {
    Category.find({ name: category })
      .lean()
      .then(item => {
        return icon = item[0].icon
      })
      .catch(error => console.log(error))
  }
  return Record.findById(id)
    .then(record => {
      record.name = name
      record.date = date
      record.icon = icon
      record.category = category
      record.amount = amount
      return record.save()
    })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

router.delete('/:id', (req, res) => {
  const id = req.params.id
  return Record.findById(id)
    .then(record => record.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router