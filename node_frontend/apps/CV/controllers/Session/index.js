const { body, check, validationResult } = require('express-validator/check');

const SessionController = {
  New: (req, res, next) => {
    res.render('Session/New');
  },
}

module.exports = SessionController;
