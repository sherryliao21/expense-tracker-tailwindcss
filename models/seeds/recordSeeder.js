const mongoose = require('mongoose')
const category = require('../category')
const Record = require('../record')
const recordList = require('../record.json')

mongoose.connect('mongodb://localhost/Expense', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  recordList.forEach(record => {
    Record.create({
      name: record.name,
      category: record.category,
      date: record.date,
      amount: record.amount
    })
  })
  console.log('done creating record seed data')
})