const ensureLoggedIn = require(`${CV_ROOT}/controllers/concerns/ensureLoggedIn`);

async function Destroy(req, res) {
  delete req.session.userId;
  req.session.save();
  req.flash('notice', 'Successfully logged out.');
  res.redirect('/cv');
}

module.exports = Destroy;
