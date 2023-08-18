const express = require('express')
const router = express.Router()

const Record = require('../../models/record')
const Category = require('../../models/category')
const User = require('../../models/user')
const sortList = {
  'latest': { date: 'desc' },
  'amountBiggest': { amount: 'desc' },
  'amountSmallest': { amount: 'asc' }
}
const sortNameMap = {
  'latest': '最新',
  'amountBiggest': '金額最大',
  'amountSmallest': '金額最小'
}

const CATEGORY = {
  家居物業: "https://fontawesome.com/icons/home?style=solid",
  交通出行: "https://fontawesome.com/icons/shuttle-van?style=solid",
  休閒娛樂: "https://fontawesome.com/icons/grin-beam?style=solid",
  餐飲食品: "https://fontawesome.com/icons/utensils?style=solid",
  其他: "https://fontawesome.com/icons/pen?style=solid"
}

router.get('/', async (req, res, next) => {
  try {
    const userId = req.user._id
    const records = await Record.find({ userId }).populate('categoryId').lean().sort({ amount: 'desc' })

    if (!records.length) { req.flash('warning_msg', '找不到資料') }

    const amountList = []
    records.forEach((record) => amountList.push(record.amount))
    const totalAmount = amountList.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    // records.forEach((record) => totalAmount += record.amount);
    return res.render('index', { records, totalAmount, sortNameMap, CATEGORY });

  } catch (error) {
    return next(error)
  }
})

router.get('/search', async (req, res, next) => {
  try {
    const userId = req.user._id
    let filter = { userId }
    const { sort, categoryName } = req.query
    const category = await Category.findOne({ name: categoryName }).lean()
    if (categoryName) {
      filter = { ...filter, categoryId: category._id }
    }

    const records = await Record.find(filter).populate('categoryId').lean().sort(sortList[sort])

    if (!records.length) { req.flash('warning_msg', '找不到資料') }

    const amountList = []
    records.forEach((record) => amountList.push(record.amount))
    const totalAmount = amountList.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    return res.render('index', { records, totalAmount, sort, categoryName, sortNameMap, CATEGORY });

  } catch (error) {
    return next(error)
  }
})

module.exports = router