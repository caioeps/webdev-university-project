const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');

module.exports = (app) => {
  // view engine setup
  // Logging
  app.use(logger('dev'));

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use(methodOverride((req, res) => {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      const method = req.body._method
      delete req.body._method
      return method
    }
  }));

  // Cookies
  app.use(cookieParser());

  app.use('/public', express.static(path.join(APP_ROOT, 'public')));

  return app;
}
