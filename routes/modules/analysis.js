const express = require('express')
const router = express.Router()
const passport = require('passport')

router.get('/', async (req, res) => {
  return res.render('analysis')
})

module.exports = router
