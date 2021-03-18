module.exports = {
  authenticator: (req, res, next) => {
    if (req.isAuthenticated()) {  // function provided by passport.js
      return next()
    }
    req.flash('warning_msg', '請先登入才能使用！')
    res.redirect('/users/login')
  }
}