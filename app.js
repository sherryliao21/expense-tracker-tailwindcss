const express = require('express')
const session = require('express-session')
const usePassport = require('./config/passport')
const app = express()
require('./config/mongoose')
const routes = require('./routes')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const flash = require('connect-flash')
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
usePassport(app)
app.use(flash())
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user  // req.user is fetched from the deserializer
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  next()
})
app.use(routes)

app.listen(PORT, () => {
  console.log(`App is running on localhost:3000`)
})