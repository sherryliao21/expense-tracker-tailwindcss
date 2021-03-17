const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')

module.exports = app => {
  // initialize passport module
  app.use(passport.initialize())
  app.use(passport.session())
  // local strategy settings
  passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ email })
      .then(user => {
        if (!user) {
          return done(null, false, { message: '此信箱未註冊' })
        }
        if (user.password !== password) {
          return done(null, false, { message: '信箱或密碼輸入錯誤' })
        }
        return done(null, user)
      })
      .catch(err => console.log(err))
  }))
  // store/get data
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err, null))
  })
}