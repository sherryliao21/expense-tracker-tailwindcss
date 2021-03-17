module.exports = {
  authenticator: (req, res, next) => {
    if (req.isAuthenticated()) {  // function provided by passport.js
      return next()
    }
    res.redirect('/users/login')
  }
}