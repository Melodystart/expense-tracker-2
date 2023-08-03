const mongoose = require('mongoose')
const Record = require('../record')
const Category = require('../category')
const User = require('../user')
const SEED_RECORD = require('../../record.json').results
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
const SEED_USER = [
  {
    name: '廣志',
    email: 'user1@example.com',
    password: '12345678',
    recordLst: [0, 1, 2, 4]
  },
  {
    name: '小新',
    email: 'user2@example.com',
    password: '12345678',
    recordLst: [3]
  }]

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', async () => {
  try {
    await Promise.all(
      SEED_USER.map(async (user) => {
        const createdUser = await User.create({
          ...user
        })

        await Promise.all(
          user.recordLst.map(async (recordNum) => {

            const findCategory = await Category.findOne({ name: SEED_RECORD[recordNum].category })

            await Record.create({
              ...SEED_RECORD[recordNum],
              userId: createdUser._id,
              categoryId: findCategory._id
            })
          })
        )
      })
    )
    console.log('users and records created!')
    process.exit()

  } catch (error) {
    console.log(error)
  }
})