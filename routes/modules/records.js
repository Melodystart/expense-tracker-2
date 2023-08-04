const express = require('express')
const router = express.Router()

const Record = require('../../models/record')
const Category = require('../../models/category')
const User = require('../../models/user')

router.get('/new', (req, res) => {
  return res.render('new')
})

router.post('/', async (req, res, next) => {
  try {
    const { name, date, categoryName, amount } = req.body
    const category = await Category.findOne({ name: categoryName }).lean()

    await Record.create({ name, date, amount, categoryId: category._id, userId: '64ca286960148ab9e2d8ec55' })
    return res.redirect('/')

  } catch (error) {
    return next(error)
  }
})

router.get('/:id/edit', async (req, res, next) => {
  try {
    const _id = req.params.id
    const record = await Record.findById(_id).populate('categoryId').lean()

    if (!record.length) { console.log("找不到資料") }
    return res.render('edit', { record })

  } catch (error) {
    return next(error)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    const _id = req.params.id
    const categoryName = req.body.categoryName

    const category = await Category.findOne({ name: categoryName }).lean()
    const record = await Record.findByIdAndUpdate(_id, { ...req.body, categoryId: category._id }).lean()

    if (!record.length) { console.log("找不到資料") }
    return res.redirect('/')

  } catch (error) {
    return next(error)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const _id = req.params.id
    const record = await Record.findByIdAndDelete(_id)

    if (!record.length) { console.log("找不到資料") }
    return res.redirect('/')

  } catch (error) {
    return next(error)
  }
})

module.exports = router