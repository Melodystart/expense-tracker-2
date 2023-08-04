const express = require('express')
const router = express.Router()

const Record = require('../../models/record')
const Category = require('../../models/category')
const User = require('../../models/user')
const sortList = {
  latest: { date: 'desc' },
  amountBiggest: { amount: 'desc' },
  amountSmallest: { amount: 'asc' }
}
// const sortNameMap = {
//   latest: '最新',
//   amountBiggest: '金額最大',
//   amountSmallest: '金額最小'
// }

router.get('/', async (req, res, next) => {
  try {
    const records = await Record.find().populate('categoryId').lean().sort({ amount: 'desc' })

    if (!records.length) { console.log("找不到資料") }
    let totalAmount = 0
    records.forEach((record) => totalAmount += record.amount);
    return res.render('index', { records, totalAmount });

  } catch (error) {
    return next(error)
  }
})

router.get('/search', async (req, res, next) => {
  try {
    let filter = {}
    const { sort, categoryName } = req.query
    const category = await Category.findOne({ name: categoryName }).lean()
    if (categoryName) {
      filter = { ...filter, categoryId: category._id }
    }

    const records = await Record.find(filter).populate('categoryId').lean().sort(sortList[sort])

    if (!records.length) { console.log("找不到資料") }
    let totalAmount = 0
    records.forEach((record) => totalAmount += record.amount);
    return res.render('index', { records, totalAmount, sort, categoryName });

  } catch (error) {
    return next(error)
  }
})

module.exports = router