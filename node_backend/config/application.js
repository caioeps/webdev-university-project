const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');

module.exports = (app) => {
  // view engine setup
  // Logging
  app.use(logger('dev'));

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Cookies
  app.use(cookieParser());

  app.use(express.static(path.join(APP_ROOT, 'public')));

  return app;
}
