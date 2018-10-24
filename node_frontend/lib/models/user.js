const path = require('path');
const Joi = require('joi')
const uuid = require('uuid/v4');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const database = require(path.resolve(APP_ROOT, 'db'));

const COLLECTION_NAME = 'users';

const registrationSchema = Joi.object().options({ abortEarly: false }).keys({
	email: Joi.string().email().required().label('User Email'),
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
    Joi.validate(user, registrationSchema, (error) => {
      if (error) {
        resolve({ errors: enhancedValidationError(error) });
      } else {
        const userWithPassword = withHashedPassword(user, user.password);
        resolve({ errors: {}, user: insert(userWithPassword) });
      }
    })
  });
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
