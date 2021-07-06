const express = require('express')
const session = require('express-session')
const usePassport = require('./config/passport')
const app = express()

require('./config/mongoose')
const routes = require('./routes')

const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const { storeLocals } = require('./middleware/storeLocals')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const PORT = process.env.PORT

app.engine('hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  helpers: {
    isSelected: (v1, v2) => {
      if (v1 === v2) return true
    }
  }
}))
app.set('view engine', 'hbs')

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

app.use(express.static('public'))
app.use('/upload', express.static(__dirname + '/upload'))
app.use(express.urlencoded({ extended: true }))   // replace body-parser(deprecated)
app.use(express.json())   // replace body-parser(deprecated)
app.use(methodOverride('_method'))
usePassport(app)
app.use(flash())
app.use(storeLocals)
app.use(routes)

app.listen(PORT, () => {
  console.log(`App is running on localhost:3000`)
})