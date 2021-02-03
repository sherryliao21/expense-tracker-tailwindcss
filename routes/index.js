const express = require('express')
const router = express.Router()

const home = require('./modules/home')
const records = require('./modules/records')

router.use('/', home)
router.use('/records', records)

module.exports = router