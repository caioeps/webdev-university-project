const { body, check, validationResult } = require('express-validator/check');

const Person = require(`${APP_ROOT}/lib/entities/person`);
const PeopleRepository = require(`${APP_ROOT}/lib/repositories/people`);

const RegistrationController = {
  New: (req, res, next) => {
    console.log('oi')
    res.render('Registration/New');
  },
  Create: [
    check('email', 'Invalid email').isEmail(),
    check('password').isLength({ min: 8 }).custom((req, { req }) => {
      if(value !== req.body.passwordConfirmation) {
        throw new Error("Passwords don't match");
      } else {
        return value;
      }
    }),
    (req, res, next) => {
      const errors = validationResult(req);
      const { email, name, password, passwordConfirmation } = req.params;
      const person = new Person({ email, name, password });
    }
  ]
}

module.exports = RegistrationController;
