const path = require('path');
const loki = require('lokijs');

const database = new loki(path.resolve(__dirname, 'database.json'), {
  autoload: true,
  autosave: true
});

module.exports = database;
