global.APP_ROOT = __dirname;

let express = require('express');
let createError = require('http-errors');
let path = require('path');
let dotenv = require('dotenv');

let configureApp = require('./config/application');

dotenv.config({
  path: path.resolve(__dirname, '.env')
});

let app = configureApp(express());

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'templates'));

//app.use('/cv', require('./apps/CV/app'));
app.use('/api', require('./apps/api/app'));

app.get('/', (req, res) => {
  res.redirect('/cv');
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);

  res.render('error', {
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  });
});

module.exports = app;
