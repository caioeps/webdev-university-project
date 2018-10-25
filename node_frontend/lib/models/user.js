const path = require('path');
const Joi = require('joi')
const uuid = require('uuid/v4');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const database = require(path.resolve(APP_ROOT, 'db'));

const COLLECTION_NAME = 'users';

const emailValidator = Joi.extend((joi) => ({
  base: Joi.string().email().required(),
  name: 'email',
  language: {
    unique: '!!{{value}} is already in use.'
  },
  rules: [
    {
      name: 'unique',
      validate(params, value, state, options) {
        if (findByEmail(value)) {
          return this.createError('email.unique', { value }, state, options);
        }

        return value;
      }
    }
  ]
}));

const registrationSchema = Joi.object().options({ abortEarly: false }).keys({
  email: emailValidator.email().unique(),
  name: Joi.string().required(),
	password: Joi.string().min(8).required(),
	passwordConfirmation: Joi.any().valid(Joi.ref('password')).required().options({
		language: { any: { allowOnly: 'Password confirmation must match password' } }
	}).label('Password Confirmation'),
});

/*
 * @api public
 * @return Promise<object>
 */
function register(user) {
  return new Promise((resolve, reject) => {
    Joi.validate(user, registrationSchema, async (error) => {
      if (error) {
        resolve({ errors: enhancedValidationError(error) });
      } else {
        if (findByEmail(user.email)) {
          resolve({ errors })
        } else {
          const userWithPassword = await withHashedPassword(user, user.password);
          const createdUser = await insert(userWithPassword);
          resolve({ user: createdUser });
        }
      }
    })
  });
}

function findByEmail(email) {
  return getCollection().findOne({ email });
}

/*
 * @api public
 */
async function insert(user) {
  const userWithNewId = withId(user);
  const res = getCollection().insert(filterAttributes(userWithNewId));
  return userWithNewId;
}

/**
 * @api private
 */
function getCollection() {
  return database.getCollection(COLLECTION_NAME) ||
    database.addCollection(COLLECTION_NAME);
}

/**
 * @api private
 */
function withId(user) {
  return { ...user, id: uuid() }
}

/**
 * @api private
 */
async function withHashedPassword(user, password) {
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return { ...user, hashedPassword };
}

/**
 * @api private
 */
function filterAttributes({ id, email, name, hashedPassword }) {
  return { id, email, name, hashedPassword };
}

/**
 * @api private
 */
function enhancedValidationError(error) {
  return error.details.reduce((errors, { context: { key }, message }) => {
    errors[key] = message;
    return errors;
  }, {});
}

const User = {
  register,
  insert
};

module.exports = User;
