const User = require(`${APP_ROOT}/lib/models/user`);

async function Create(req, res) {
  const { email, name, password, passwordConfirmation } = req.body;
  const user = { email, name, password, passwordConfirmation };

  const { user: createdUser, error } = await User.register(user);

  if (createdUser) {
    req.session.userId = createdUser.id;
    req.session.save()
    req.flash('notice', 'Registered successfully!');
    res.redirect('/cv');
  } else {
    req.flash('alert', 'There are some validation errors.');
    res.render('Registration/New', {
      form: {
        email,
        name,
        errors: error
      }
    });
  }
};

module.exports = [Create];

