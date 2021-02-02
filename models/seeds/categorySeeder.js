const mongoose = require('mongoose')
const Category = require('../category')
const categoryList = require('../category.json')

mongoose.connect('mongodb://localhost/Expense', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  categoryList.forEach(categoryItem => {
    Category.create({
      name: categoryItem.name,
      icon: categoryItem.icon
    })
  })
  console.log('done creating category seed data')
})