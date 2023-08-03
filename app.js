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
const Record = require('./models/record');
const Category = require('./models/category');


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

app.get('/', (req, res) => {
  Record.find()
    .populate('categoryId')
    .lean() // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
    .then(records => {
      let totalAmount = 0
      records.forEach((record) => totalAmount += record.amount);
      return res.render('index', { records, totalAmount });
    })
    .catch(error => console.error(error))
})

app.get('/records/new', (req, res) => {
  return res.render('new')
})

app.post('/records', async (req, res) => {
  const { name, date, categoryName, amount } = req.body
  const findCategory = await Category.findOne({ name: categoryName }).lean()
  await Record.create({ name, date, amount, categoryId: findCategory._id, userId: '64ca286960148ab9e2d8ec55' })
    .then(() => { return res.redirect('/') })
    .catch(error => console.log(error))
})

app.get('/records/:id/edit', (req, res) => {
  const _id = req.params.id
  Record.findById(_id)
    .populate('categoryId')
    .lean()
    .then((record) => { return res.render('edit', { record }) })
    .catch(error => console.log(error))
})

app.put('/records/:id', async (req, res) => {
  const _id = req.params.id
  const categoryName = req.body.categoryName
  const findCategory = await Category.findOne({ name: categoryName }).lean()

  await Record.findByIdAndUpdate(_id, { ...req.body, categoryId: findCategory._id })
    .lean()
    .then(() => { return res.redirect('/') })
    .catch(error => console.log(error))
})

app.delete('/records/:id', (req, res) => {
  const _id = req.params.id
  Record.findByIdAndDelete(_id)
    .then(() => { return res.redirect('/') })
    .catch(error => console.log(error))
})

app.listen(3000, () => {
  console.log('App is running on http://localhost:3000')
})