const express = require('express')
const app = express()
require('./config/mongoose')
const exphbs = require('express-handlebars')
const Record = require('./models/record')

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.get('/', (req, res) => {
  Record.find()
    .lean()
    .then(records => res.render('index', { records }))
    .catch(error => console.log('error!'))
})

app.get('/records/new', (req, res) => {
  return res.render('new')
})

app.listen(3000, () => {
  console.log(`App is running on localhost:3000`)
})