const { body, check, validationResult } = require('express-validator/check');

const SessionController = {
  Create:  require('./Create'),
  Destroy: require('./Destroy'),
}

module.exports = SessionController;
