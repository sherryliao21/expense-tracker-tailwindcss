const express = require('express')
const app = express()
require('./config/mongoose')
const exphbs = require('express-handlebars')
const Record = require('./models/record')
const Category = require('./models/category')
const bodyParser = require('body-parser')

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  const category = req.query.category
  if (category) {
    return Record.find({ category })
      .lean()
      .then(records => {
        res.render('index', { records, category })
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

app.get('/records/new', (req, res) => {
  return res.render('new')
})

app.get('/records/:id/edit', (req, res) => {
  const id = req.params.id
  return Record.findById(id)
    .lean()
    .then(record => res.render('edit', { record }))
    .catch(error => console.log(error))
})

app.post('/records', (req, res) => {
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
  return Record.create({ name, icon, date, category, amount })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

app.post('/records/:id/edit', (req, res) => {
  const id = req.params.id
  const { name, date, category, amount } = req.body
  let icon = ''
  if (category) {
    Category.find({ name: category })
      .lean()
      .then(category => { return icon = category.icon })
      .catch(error => console.log(error))
  }
  // if (category === 'food') {
  //   icon = 'fas fa-utensils'
  // } else if (category === 'transportation') {
  //   icon = 'fas fa-shuttle-van'
  // } else if (category === 'entertainment') {
  //   icon = 'fas fa-grin-beam'
  // } else if (category === 'housing') {
  //   icon = "fas fa-home"
  // } else if (category === 'others') {
  //   icon = "fas fa-pen"
  // }
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

app.post('/records/:id/delete', (req, res) => {
  const id = req.params.id
  return Record.findById(id)
    .then(record => record.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

app.listen(3000, () => {
  console.log(`App is running on localhost:3000`)
})