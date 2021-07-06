const db = require('../../config/mongoose')
const Category = require('../category')
const categoryList = require('../jsons/category.json')

db.once('open', () => {
  const categories = []
  categoryList.forEach((categoryItem) => {
    categories.push(
      Category.create({
        name: categoryItem.name,
        iconURL: categoryItem.iconURL,
        icon: categoryItem.icon,
      })
    )
  })
  console.log('done creating category seed')
  Promise.all(categories)
    .catch((error) => console.log(error))
    .finally(() => db.close())
})
