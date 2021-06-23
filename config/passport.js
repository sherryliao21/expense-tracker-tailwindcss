const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const User = require('../models/user')
const bcrypt = require('bcryptjs')

module.exports = app => {
  // initialize passport module
  app.use(passport.initialize())
  app.use(passport.session())
  // local strategy settings
  passport.use(new LocalStrategy(
    {
    usernameField: 'email',
    passReqToCallback: true
    }, 
    async(req, email, password, done) => {
      try {
        const user = await User.findOne({ email })
        if (!user) {
          req.flash('warning_msg', '此信箱未註冊')
          return done(null, false)
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
          req.flash('warning_msg', '信箱或密碼輸入錯誤')
          return done(null, false)
        }
        return done(null, user)
      }
      catch (error) {
        console.log(error)
      } 
    }
  ))
  // Facebook strategy settings
  passport.use(new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK,
      profileFields: ['email', 'displayName']
    }, 
    async(accessToken, refreshToken, profile, done) => {
      try {
        const { name, email } = profile._json
        const user = await User.findOne({ email })
        if (user) return done(null, user)
        const randomPassword = Math.random.toString(36).slice(-8)
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(randomPassword, salt)
        await User.create({
          name, email, password: hash
        })
        return done(null, user)  
      }
      catch (error) {
        console.log(error)
        return done(error, false)
      }
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