const Joi = require('joi')
const uuid = require('uuid/v4');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const db = require(`${APP_ROOT}/db`);

const emailValidator = Joi.extend((joi) => ({
  base: Joi.string().email().required(),
  name: 'email',
  language: {
    unique: '!!{{value}} is already in use.'
  },
  rules: [
    {
      name: 'unique',
      async validate(params, value, state, options) {
        if (await findByEmail(value)) {
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
 * @param {Object} user An object compliant with the registrationSchema.
 * @return Promise<{user, error}>
 */
async function register(user) {
  const { error } = await validateSchema(user, registrationSchema);

  if (error) {
    return { error: enhancedValidationError(error) };
  }

  const userWithPassword = await withHashedPassword(user);
  const createdUser = await insert(userWithPassword);
  return { user: createdUser };
}

/*
 * @api public
 * @param {String} email
 * @param {String} password
 * @return Promise<{user, error}>
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

  const user = await findByEmail(email);

  if (user) {
    const passwordMatch = await bcrypt.compare(password, user.hashedPassword);

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
 * @param {String} email
 * @returns Promise<user>
*/
function insert(user) {
  return new Promise((resolve, reject) => {
    db.users.insert(filterAttributes(user), (err, createdUser) => {
      err ? reject(err) : resolve(createdUser)
    });
  });
}

/**
 * @api private
 * @param {String} email
 * @returns Promise<user>
 */
function findByEmail(email) {
  return new Promise((resolve, reject) => {
    db.users.findOne({ email }, (err, user) => {
      err ? reject(err) : resolve(user)
    })
  })
}

/**
 * @api private
 * @param {String} id
 * @returns Promise<user>
 */
function find(id) {
  return new Promise((resolve, reject) => {
    db.users.findOne({ _id: id }, (err, user) => {
      err ? reject(err) : resolve(user)
    })
  })
}

/**
 * @api private
 * @returns {Object} The user with hash password by bcrypt and without password.
 */
async function withHashedPassword({ password, ...user }) {
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
 * @param {Object} error - The error from Joi lib.
 * @returns {Object} A better formatted error so it can be used by the frontend.
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
  find
};

module.exports = User;
