global.APP_ROOT = __dirname;

let express = require('express');
let createError = require('http-errors');
let path = require('path');
let dotenv = require('dotenv');
let mongoose = require('mongoose');
let cors = require('cors');

let configureApp = require('./config/application');

dotenv.config({
  path: path.resolve(__dirname, '.env')
});

let app = configureApp(express());

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'templates'));

app.use(cors());

app.options('*', cors())

//app.use('/cv', require('./apps/CV/app'));
app.use('/api', require('./apps/api/app'));

app.get('/', (req, res) => {
  res.redirect('/cv');
});

app.get('/check', (req, res) => {
  const mongoCheckEnum = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  }

  res.send({
    app: 'ok',
    mongo: mongoCheckEnum[mongoose.connection.readyState]
  });
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);

  console.log(err)

  if (req.is('application/json')) {
    res.send({ error: req.app.get('env') === 'development' ? err : 'An error ocurred. Please check the application logs'});
  } else {
    res.render('error', {
      message: err.message,
      error: req.app.get('env') === 'development' ? err : {}
    });
  }
});

module.exports = app;
