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
const routes = require('./routes');
const usePassport = require('./config/passport');
require('./config/mongoose')
const app = express()
const PORT = process.env.PORT || 3000

app.engine('hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs', helpers: multihelpers }))
app.set('view engine', 'hbs')

app.use(session({
  secret: 'ThisIsMySecret',
  resave: false,
  saveUninitialized: true
}))

app.use(bodyParser.urlencoded({ extended: true })); //才抓得到req
app.use(methodOverride('_method')) //可將方法由POST改為PUT

usePassport(app)

app.use(routes)

app.listen(PORT, () => {
  console.log('App is running on http://localhost:${PORT}')
})