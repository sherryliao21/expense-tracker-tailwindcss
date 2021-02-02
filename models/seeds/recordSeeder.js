const db = require('../../config/mongoose')
const Record = require('../record')
const recordList = require('../record.json')

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