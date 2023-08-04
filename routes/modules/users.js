const express = require('express')
const router = express.Router()
const User = require('../../models/user')
const passport = require('passport')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

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

router.get('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) { return next(err); }
    return res.redirect('/users/login');
  });
});

module.exports = router