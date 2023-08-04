const express = require('express')
const router = express.Router()

const User = require('../../models/user')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', (req, res) => {
})

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body
    const user = await User.findOne({ email }).lean()

    if (user) {
      console.log('User already exists.')
      return res.render('register', { ...req.body })
    } else {
      await User.create({ ...req.body })
      return res.redirect('/')
    }

  } catch (error) {
    return next(error)
  }


})

module.exports = router