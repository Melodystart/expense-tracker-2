const mongoose = require('mongoose');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();  //可以使用process.env.的參數
}

mongoose.connect(process.env.MONGODB_URI);

const db = mongoose.connection;

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
})

module.exports = db