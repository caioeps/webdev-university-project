const path = require('path');
const mongoose = require('mongoose');
var { MongoClient } = require('mongodb')

const dbHost = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/`;
const dbOptions = {
  dbName: process.env.DB_NAME,
  user:   process.env.DB_USER,
  pass:   process.env.DB_PASSWORD,
  autoIndex: true,
  useNewUrlParser: true
};

// TODO: Move this later to an express middleware.
const db = mongoose.createConnection(dbHost, dbOptions);

module.exports = db;
