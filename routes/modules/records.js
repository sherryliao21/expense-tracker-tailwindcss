const express = require('express')
const router = express.Router()

const Record = require('../../models/record')
const Category = require('../../models/category')

router.get('/new', (req, res) => {

  // add
  const categoryOptions = []
  Category.find()
    .lean()
    .then(category => {
      category.forEach(item => {
        categoryOptions.push(item.name)
      })
      console.log(categoryOptions)
    })
    .catch(err => console.lo(err))
  //


  return res.render('new', { categoryOptions })
})

router.get('/:id/edit', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Record.findOne({ userId, _id })
    .lean()
    .then(record => res.render('edit', { record }))
    .catch(error => console.log(error))
})

router.post('/', (req, res) => {
  const userId = req.user._id
  const { name, date, category, amount, merchant } = req.body
  const month = date.split('-')[0] + date.split('-')[1]
  let icon = ''

  if (category === '餐飲食品') {
    icon = 'fas fa-utensils'
  } else if (category === '交通出行') {
    icon = 'fas fa-shuttle-van'
  } else if (category === '休閒娛樂') {
    icon = 'fas fa-grin-beam'
  } else if (category === '家居物業') {
    icon = 'fas fa-home'
  } else if (category === '其他') {
    icon = 'fas fa-pen'
  }
  return Record.create({ name, date, month, icon, category, amount, merchant, userId })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

router.put('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  const { name, date, category, amount, merchant } = req.body
  const month = date.split('-')[0] + date.split('-')[1]
  let icon = ''
  if (category) {
    Category.find({ name: category })
      .lean()
      .then(item => {
        icon = item[0].icon
      })
      .catch(error => console.log(error))
  }
  return Record.findOne({ userId, _id })
    .then(record => {
      record.name = name
      record.date = date
      record.month = month
      record.icon = icon
      record.category = category
      record.amount = amount
      record.merchant = merchant
      return record.save()
    })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

router.delete('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Record.findOne({ _id, userId })
    .then(record => record.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router