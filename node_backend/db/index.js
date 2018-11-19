const path = require('path');
const Datastore = require('nedb');

function generateCollection(collectionName) {
  return new Datastore({
    filename: path.resolve(__dirname, 'collections', `${collectionName}.json`),
    autoload: true
  });
}

const db = {};

db.users = generateCollection('users');
db.cvs = generateCollection('cvs');

module.exports = db;
