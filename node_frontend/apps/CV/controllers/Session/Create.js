const ensureLoggedOut = require(`${CV_ROOT}/controllers/concerns/ensureLoggedOut`);

const User = require(`${APP_ROOT}/lib/models/user`);

async function Create(req, res) {
  const { email, password } = req.body;

  const { user, error } = await User.login({ email, password });

  if (user) {
    req.session.userId = user._id;
    req.session.save();
    req.flash('notice', 'Logged in successfully!');
    res.redirect('/cv');
  } else {
    req.flash('error', error.base || 'Error logging in');
    res.render('Session/New', {
      form: {
        email,
        errors: error
      }
    });
  }
}

module.exports = ensureLoggedOut(Create);
