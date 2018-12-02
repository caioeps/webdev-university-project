const path = require('path');

const CVController = {
  Index:   require('./Index'),
  Show:    require('./Show'),
  Create:  require('./Create'),
  Update:  require('./Update'),
  Destroy: require('./Destroy'),
};

module.exports = CVController;
