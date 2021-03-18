const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const db = require('../../config/mongoose')
const Record = require('../record')
const recordList = require('../record.json')
const User = require('../user')

const SEED_USERS = [{
  name: 'Naruto',
  email: 'user1@example.com',
  password: '12345678'
}, {
  name: 'Sasuke',
  email: 'user2@example.com',
  password: '12345678'
}]

db.once('open', () => {
  SEED_USERS.forEach((user, index) => {
    bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(user.password, salt))
      .then(hash =>
        User.create({
          name: user.name,
          email: user.email,
          password: hash
        }))
      .then(userSeed => {
        const userId = userSeed._id
        const recordItem = recordList
        return Promise.all(
          Array.from({ length: 3 }, (_, i) =>
            Record.create({
              name: recordItem[(i + (index * 3))].name,
              icon: recordItem[(i + (index * 3))].icon,
              category: recordItem[(i + (index * 3))].category,
              date: recordItem[(i + (index * 3))].date,
              merchant: recordItem[(i + (index * 3))].merchant,
              amount: recordItem[(i + (index * 3))].amount,
              userId
            })
          ))
      })
      .then(() => {
        console.log('done creating seed data')
        process.exit()
      })
      .catch(err => console.log(err))
  })
})