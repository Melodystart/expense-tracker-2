const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const hbshelpers = require('handlebars-helpers');
const multihelpers = hbshelpers();
const handlebars = require('handlebars');
const numeralHelper = require('handlebars.numeral');
numeralHelper.registerHelpers(handlebars);
handlebars.registerHelper('dateFormat', require('handlebars-dateformat'));
const bodyParser = require('body-parser'); //才抓得到req
const methodOverride = require('method-override') //可將方法由POST改為PUT
const flash = require('connect-flash')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const routes = require('./routes');
const usePassport = require('./config/passport');
require('./config/mongoose')
const app = express()
const PORT = process.env.PORT

app.engine('hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs', helpers: multihelpers }))
app.set('view engine', 'hbs')

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

app.use(bodyParser.urlencoded({ extended: true })); //才抓得到req
app.use(methodOverride('_method')) //可將方法由POST改為PUT

usePassport(app)
app.use(flash())
app.use((req, res, next) => {
  //把req的登入狀態交接給res，才能在前端樣板裡使用這些資訊
  //req.user是在反序列化時，取出的user資訊，之後會放在req.user裡以供後續使用
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  next()
})

app.use(routes)

app.listen(PORT, () => {
  console.log('App is running on http://localhost:${PORT}')
})