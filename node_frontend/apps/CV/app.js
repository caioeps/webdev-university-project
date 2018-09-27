const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'templates'));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

app.use('/', require('./routes'));

app.locals.viewHelpers = {
  getAssetUrl: require('./helpers/getAssetUrl')
}

module.exports = app;
