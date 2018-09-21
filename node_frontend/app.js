global.APP_ROOT = __dirname;

let express = require('express');
let createError = require('http-errors');
let path = require('path');

let configure = require('./config/application');

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');

let app = configure(express());

app.use('/public', express.static('public'));

app.use('/labActivities', require('./apps/labActivities/app'));

app.get('/', (req, res) => {
  res.redirect('/labActivities');
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
