const express = require('express');
const mongoose = require('mongoose');
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

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
mongoose.connect(process.env.MONGODB_URI)

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
})

app.engine('hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs', helpers: multihelpers }))
app.set('view engine', 'hbs')

app.use(bodyParser.urlencoded({ extended: true })); //才抓得到req
app.use(methodOverride('_method')) //可將方法由POST改為PUT
app.use(routes)

app.listen(3000, () => {
  console.log('App is running on http://localhost:3000')
})