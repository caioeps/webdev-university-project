const path = require('path');
const mongoose = require('mongoose');

const dbHost = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/`;
const dbOptions = {
  dbName: process.env.DB_NAME,
  user:   process.env.DB_USER,
  pass:   process.env.DB_PASSWORD,
  autoIndex: process.env.NODE_ENV === 'development',
  useNewUrlParser: true
};

// TODO: Move this later to an express middleware.
const db = mongoose.createConnection(dbHost, dbOptions);

module.exports = db;
