const { body, check, validationResult } = require('express-validator/check');

const SessionController = {
  New:     require('./New'),
  Create:  require('./Create'),
  Destroy: require('./Destroy'),
}

module.exports = SessionController;
