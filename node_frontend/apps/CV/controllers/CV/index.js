const path = require('path');

const CV = require(`${APP_ROOT}/lib/models/cv`);

const CVController = {
  Index:   require('./Index'),
  Show:    require('./Show'),
  New:     require('./New'),
  Create:  require('./Create'),
  Edit:    require('./Edit'),
  Update:  require('./Update'),
  Destroy: require('./Destroy'),
};

module.exports = CVController;
