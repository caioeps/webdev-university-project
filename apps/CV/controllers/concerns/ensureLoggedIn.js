const User = require(`${APP_ROOT}/lib/models/user`);

async function ensureLoggedIn(req, res, next) {
  if (res.locals.isLoggedIn()) {
    try {
      req.currentUser = await User.findById(req.session.userId);
      next();
    } catch (error) {
      next(error);
    }
  } else {
    req.flash('notice', 'You need to sign in');
    res.redirect('/cv/session/new');
  }
}

module.exports = ensureLoggedIn;
