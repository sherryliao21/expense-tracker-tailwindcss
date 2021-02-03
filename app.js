const express = require('express')
const app = express()
require('./config/mongoose')
const routes = require('./routes')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

app.engine('hbs', exphbs({
  defaultLayout: 'main', extname: '.hbs', helpers: {
    isSelected: function (v1, v2) {
      return v1 === v2
    }
  }
}))
app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(routes)

app.listen(3000, () => {
  console.log(`App is running on localhost:3000`)
})