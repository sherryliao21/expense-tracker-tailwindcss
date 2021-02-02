const db = require('../../config/mongoose')
const Category = require('../category')
const categoryList = require('../category.json')

db.once('open', () => {
  categoryList.forEach(categoryItem => {
    Category.create({
      name: categoryItem.name,
      icon: categoryItem.icon
    })
  })
  console.log('done creating category seed data')
})