'use strict';

const Person = require(`${APP_ROOT}/lib/entities/person`);

const CVController = {
  Index: (req, res, next) => {
    res.render('CV/Index');
  },
  Show: (req, res, next) => {
    res.render('CV/Show', {
      name: 'Caio'
    });
  },
  New: (req, res, next) => {
    res.render('CV/New');
  },
};

module.exports = CVController;
