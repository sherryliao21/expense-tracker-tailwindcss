const bcrypt = require('bcryptjs')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const db = require('../../config/mongoose')
const Record = require('../record')
const recordList = require('../jsons/record.json')
const User = require('../user')

const SEED_USERS = [
  {
    name: 'Naruto',
    email: 'user1@example.com',
    password: '12345678',
  },
  {
    name: 'Sasuke',
    email: 'user2@example.com',
    password: '12345678',
  },
]

db.once('open', async () => {
  try {
    SEED_USERS.forEach(async (user, index) => {
      const salt = await bcrypt.genSalt(10)
      const password = await bcrypt.hash(user.password, salt)
      const userSeed = await User.create({
        name: user.name,
        email: user.email,
        password,
        avatar: '/Portrait_Placeholder.png'
      })
      const userId = userSeed._id
      const recordItem = recordList
      await Promise.all(
        Array.from({ length: 3 }, (_, i) =>
          Record.create({
            name: recordItem[i + index * 3].name,
            icon: recordItem[i + index * 3].icon,
            category: recordItem[i + index * 3].category,
            date: recordItem[i + index * 3].date,
            merchant: recordItem[i + index * 3].merchant,
            amount: recordItem[i + index * 3].amount,
            userId,
            recordType: recordItem[i + index * 3].recordType,
          })
        )
      )
      console.log('done creating seed data!')
      process.exit()
    })
  }
  catch (error) {
    console.log(error)
  }
})
