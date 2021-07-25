const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const FacebookStrategy = require("passport-facebook").Strategy
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy

const User = require("../models/user")
const bcrypt = require("bcryptjs")

module.exports = app => {
  // initialize passport module
  app.use(passport.initialize())
  app.use(passport.session())
  // local strategy settings
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passReqToCallback: true,
      },
      async (req, email, password, done) => {
        try {
          const user = await User.findOne({ email })
          if (!user) {
            req.flash("warning_msg", "This email is not registered!")
            return done(null, false)
          }
          const isMatch = await bcrypt.compare(password, user.password)
          if (!isMatch) {
            req.flash("warning_msg", "Email or password is wrong")
            return done(null, false)
          }
          return done(null, user)
        } catch (error) {
          console.log(error)
        }
      }
    )
  )
  // Facebook strategy settings
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK,
        profileFields: ["email", "displayName"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const { name, email } = profile._json
          const user = await User.findOne({ email })
          if (user) return done(null, user)
          const randomPassword = Math.random.toString(36).slice(-8)
          const salt = await bcrypt.genSalt(10)
          const hash = await bcrypt.hash(randomPassword, salt)
          await User.create({
            name,
            email,
            password: hash,
          })
          return done(null, user)
        } catch (error) {
          console.log(error)
          return done(error, false)
        }
      }
    )
  )

  // google strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await User.findOne({ googleId: profile.id })
          console.log("=======profile:", profile)
          if (!user) {
            const randomPassword = Math.random.toString(36).slice(-8)
            const salt = await bcrypt.genSalt(10)
            const hash = await bcrypt.hash(randomPassword, salt)
            await User.create({
              name: profile.displayName,
              email: profile.emails[0].value,
              password: hash,
              avatar: profile.photos[0].value,
              googleId: profile.id,
            })
            return done(null, user)
          }
          return done(null, user)
        } catch (error) {
          console.log(error)
        }
      }
    )
  )

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
