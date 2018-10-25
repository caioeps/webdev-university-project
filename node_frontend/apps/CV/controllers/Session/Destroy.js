const ensureLoggedIn = require(`${CV_ROOT}/controllers/concerns/ensureLoggedIn`);

async function Destroy(req, res) {
  req.session.userId = null;
  req.session.save();
  res.flash('notice', 'Successfully logged out.');
  res.redirect('/cv');
}

module.exports = [
  Destroy
];
