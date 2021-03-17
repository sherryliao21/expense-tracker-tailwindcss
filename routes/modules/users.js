const express = require('express')
const router = express.Router()
const User = require('../../models/user')

router.get('/login', (req, res) => {
  res.render('login')
})

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/login', (req, res) => {

})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  User.findOne({ email })
    .then(user => {
      if (user) {
        console.log('此使用者已註冊')
        res.render('login', {
          name, email, password, confirmPassword
        })
      } else {
        return User.create({
          name, email, password, confirmPassword
        })
          .then(() => res.redirect('/'))
          .catch(err => console.log(err))
      }
    })
})

module.exports = router