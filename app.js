const express = require('express')
const session = require('express-session')
const app = express()
require('./config/mongoose')
const routes = require('./routes')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const PORT = process.env.PORT || 3000


app.engine('hbs', exphbs({
  defaultLayout: 'main', extname: '.hbs', helpers: {
    isSelected: function (v1, v2) {
      return v1 === v2
    }
  }
}))
app.set('view engine', 'hbs')
app.use(session({
  secret: 'narutosWalletSecret',
  resave: false,
  saveUninitialized: true
}))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(methodOverride('_method'))

app.use(routes)

app.listen(PORT, () => {
  console.log(`App is running on localhost:3000`)
})