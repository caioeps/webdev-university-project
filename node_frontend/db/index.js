const path = require('path');
const loki = require('lokijs');

const database = new loki('database.json', {
  autoload: true,
  autosave: true
});

module.exports = database;
