const express = require('express')
const router = express.Router()
const User = require('../../models/user')
const passport = require('passport')
const bcrypt = require('bcryptjs')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureFlash: true
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body
    const user = await User.findOne({ email }).lean()
    const errors = []

    if (!name || !email || !password || !confirmPassword) {
      errors.push({ message: '所有欄位都是必填。' })
    }
    if (password !== confirmPassword) {
      errors.push({ message: '密碼與確認密碼不相符！' })
    }
    if (errors.length) {
      return res.render('register', { errors, ...req.body })
    }
    if (user) {
      errors.push({ message: '這個 Email 已經註冊過了。' })
      return res.render('register', { errors, ...req.body })
    } else {
      bcrypt.genSalt(10, async function (err, salt) {
        bcrypt.hash(password, salt, async function (err, hash) {
          await User.create({ name, email, password: hash })
          return res.redirect('/')
        });
      });

      // const salt = bcrypt.genSalt(10)
      // const hash = bcrypt.hash(password, salt)
      // await User.create({ name, email, password: hash })
      // return res.redirect('/')
    }

  } catch (error) {
    return next(error)
  }
})

router.get('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) { return next(err); }
    req.flash('success_msg', '你已經成功登出。');
    return res.redirect('/users/login');
  });
});

module.exports = router