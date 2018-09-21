'use strict';

const path = require('path');
const express = require('express');
const sassMiddleware = require('node-sass-middleware');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'templates'));

app.use('/', require('./routes'));

app.use(sassMiddleware({
  src: path.join(__dirname, 'assets'),
  dest: path.join(global.APP_ROOT, 'public', 'assets', 'labActivities'),
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: true
}));

app.locals.viewHelpers = {
  getAssetUrl: require('./helpers/getAssetUrl')
}

module.exports = app;
