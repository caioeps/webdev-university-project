const User = require(`${APP_ROOT}/lib/models/user`);

async function Create(req, res) {
  const { email, name, password, passwordConfirmation } = req.body;
  const userAttrs = { email, name, password, passwordConfirmation };

  const { user, error } = await User.register(userAttrs);

  if (error) {
    req.flash('alert', 'There are some validation errors.');
    res.render('Registration/New', {
      form: {
        email,
        name,
        errors: error
      }
    });
  } else {
    req.session.userId = user.id;
    req.session.save()
    req.flash('notice', 'Registered successfully!');
    res.redirect('/cv');
  }
};

module.exports = [Create];

