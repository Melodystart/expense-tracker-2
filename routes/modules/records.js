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
    const userId = req.user._id
    const category = await Category.findOne({ name: categoryName }).lean()

    if (!name || !date || !categoryName || !amount) {
      req.flash('warning_msg', '所有欄位都是必填。')
      return res.render('new', { ...req.body })
    }

    await Record.create({ ...req.body, categoryId: category._id, userId })
    return res.redirect('/')

  } catch (error) {
    return next(error)
  }
})

router.get('/:id/edit', async (req, res, next) => {
  try {
    const _id = req.params.id
    const userId = req.user._id
    const record = await Record.findOne({ _id, userId }).populate('categoryId').lean()

    if (!record) { return next(error) } // 找不到資料
    return res.render('edit', { record })

  } catch (error) {
    return next(error)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    const _id = req.params.id
    const userId = req.user._id
    const { name, date, categoryName, amount } = req.body

    if (!name || !date || !categoryName || !amount) {
      req.flash('warning_msg', '所有欄位都是必填。')
      return res.redirect(`./${_id}/edit`)
    }

    const category = await Category.findOne({ name: categoryName }).lean()
    const record = await Record.findOneAndUpdate({ _id, userId }, { ...req.body, categoryId: category._id }).lean()

    if (!record) { return next(error) } // 找不到資料
    return res.redirect('/')

  } catch (error) {
    return next(error)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const _id = req.params.id
    const userId = req.user._id
    const record = await Record.findOneAndDelete({ _id, userId })

    if (!record) { return next(error) } // 找不到資料
    return res.redirect('/')

  } catch (error) {
    return next(error)
  }
})

module.exports = router