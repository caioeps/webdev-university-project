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

const loginSchema = Joi.object().options({ abortEarly: false }).keys({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

const validateSchema = (data, schema) => {
  return new Promise((resolve, reject) => {
    Joi.validate(data, schema, (error, data) => resolve({ error, data }));
  });
};

/*
 * @api public
 * @return Promise<{user,error}>
 */
async function register(user) {
  const { error } = await validateSchema(user, registrationSchema);

  if (error) {
    return { error: enhancedValidationError(error) };
  }

  const userWithPassword = await withHashedPassword(user, user.password);
  const createdUser = await insert(userWithPassword);
  return { user: createdUser };
}

/*
 * @api public
 * @return Promise<{user,error}>
 */
async function login({ email, password }) {
  const { error } = await validateSchema({ email, password }, loginSchema);

  if (error) {
    return { error: enhancedValidationError(error) };
  }

  const loginError = {
    error: {
      base: 'Email or password not valid'
    }
  }

  const user = findByEmail(email);

  if (user) {
    const passwordMatch = await bcrypt.compare(password, user.hashedPassword);

    console.log(passwordMatch)

    if (!passwordMatch) {
      return loginError;
    }

    return { user };
  } else {
    return loginError;
  }
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
function findByEmail(email) {
  return getCollection().findOne({ email });
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
  login,
  insert,
};

module.exports = User;
