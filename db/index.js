const path = require('path');
const mongoose = require('mongoose');
var { MongoClient } = require('mongodb')

let dbOptions = {
  dbName: process.env.DB_NAME,
  user:   process.env.DB_USER,
  pass:   process.env.DB_PASSWORD,
  autoIndex: true,
  useNewUrlParser: true
};

// TODO: Move this later to an express middleware.
const db = mongoose.connect(process.env.MONGODB_URI, dbOptions);

module.exports = db;
