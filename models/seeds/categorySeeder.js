const mongoose = require('mongoose')
const Category = require('../category')
const CATEGORY = {
  家居物業: "https://fontawesome.com/icons/home?style=solid",
  交通出行: "https://fontawesome.com/icons/shuttle-van?style=solid",
  休閒娛樂: "https://fontawesome.com/icons/grin-beam?style=solid",
  餐飲食品: "https://fontawesome.com/icons/utensils?style=solid",
  其他: "https://fontawesome.com/icons/pen?style=solid"
}
function iconUrl(url) {
  const trimStart = "/icons/"
  const trimEnd = "?style="
  const start = url.indexOf(trimStart) + 7
  const end = url.indexOf(trimEnd)
  const result = "fa-" + url.slice(end + 7, url.length) + " fa-" + url.slice(start, end)
  return result
}


if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', async () => {
  try {
    await Promise.all(Array.from(Object.entries(CATEGORY), ([key, value]) => Category.create({ name: key, icon: iconUrl(value) })
    ))
    console.log('categories created!')
    process.exit()

  } catch (error) {
    console.log(error)
  }
})