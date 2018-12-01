const User = require(`${APP_ROOT}/lib/models/user`);

async function ensureLoggedIn(req, res, next) {
  const jwtToken = req.header('X-Api-Token');
  const { email, token } = jwt.verify(jwtToken, process.env.JWT_SECRET);

  if (res.locals.isLoggedIn()) {
    try {
      req.currentUser = await User.find({ email, token });
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
