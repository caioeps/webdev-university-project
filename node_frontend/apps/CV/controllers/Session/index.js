const { body, check, validationResult } = require('express-validator/check');

const Person = require(`${APP_ROOT}/lib/entities/person`);
const PeopleRepository = require(`${APP_ROOT}/lib/repositories/people`);

const SessionController = {
  New: (req, res, next) => {
    res.render('Session/New');
  },
}

module.exports = SessionController;
