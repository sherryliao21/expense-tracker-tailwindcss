module.exports = {
  authenticator: (req, res, next) => {
    if (req.isAuthenticated()) {  // function provided by passport.js
      return next()
    }
    req.flash('warning_msg', 'Please log in first!')
    res.redirect('/users/login')
  }
}