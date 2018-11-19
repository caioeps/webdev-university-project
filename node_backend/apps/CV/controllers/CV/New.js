const ensureLoggedIn = require(`${CV_ROOT}/controllers/concerns/ensureLoggedIn`);

const New = (req, res) => res.render('CV/New');

module.exports = [
  ensureLoggedIn,
  New,
]

