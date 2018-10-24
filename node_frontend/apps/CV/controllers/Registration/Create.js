const { body, check, validationResult } = require('express-validator/check');

const User = require(`${APP_ROOT}/lib/models/user`);

module.exports = async function(req, res) {
  const { email, name, password, passwordConfirmation } = req.body;
  const user = { email, name, password, passwordConfirmation };

  const { user: createdUser, errors } = await User.register(user);

  console.log(errors)

  if (createdUser) {
  } else {
    return res.render('Registration/New', {
      form: {
        email,
        name,
        errors
      }
    });
  }
};

