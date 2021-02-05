const db = require('../../config/mongoose')
const Record = require('../record')
const recordList = require('../record.json')

db.once('open', () => {
  const records = []
  recordList.forEach(record => {
    records.push(
      Record.create({
        name: record.name,
        icon: record.icon,
        category: record.category,
        date: record.date,
        amount: record.amount
      })
    )
  })
  console.log('done creating record seed')
  Promise.all(records)
    .catch(error => console.log(error))
    .finally(() => db.close())
})