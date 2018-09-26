const path = require('path');
const loki = require('lokijs');

const database = new loki(path.resole(__dirname, 'database.json'));

module.exports = database;
