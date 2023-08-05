const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const FacebookStrategy = require('passport-facebook').Strategy

module.exports = app => {
  // 初始化 Passport 模組
  app.use(passport.initialize())
  app.use(passport.session())
  // 設定本地登入策略
  passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, async (req, email, password, done) => {
    try {
      const user = await User.findOne({ email })
      if (!user) {
        return done(null, false, req.flash('warning_msg', '這個 Email 尚未註冊。'))
      }

      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return done(null, false, req.flash('warning_msg', 'Email 或 密碼有誤。'))
      }

      return done(null, user)

    } catch (err) {
      return done(err, false)
    }
  }))

  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const { name, email } = profile._json
      const user = await User.findOne({ email })
      if (user) return done(null, user)
      const randomPassword = Math.random().toString(36).slice(-8)
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(randomPassword, salt)
      createdUser = await User.create({ name, email, password: hash })
      return done(null, createdUser)

    } catch (error) {
      return done(error, false)
    }
  }))

  // 設定序列化與反序列化
  passport.serializeUser((user, done) => {
    return done(null, user.id)
  })
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id).lean()
      return done(null, user)
    } catch (err) { return done(err, null) }
  })
}