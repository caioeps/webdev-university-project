global.API_ROOT = __dirname;

const path       = require('path');
const express    = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json({ type: 'application/*+json' }))

app.use('/', require('./routes'));

module.exports = app;
