const Joi = require('joi')
const uuid = require('uuid/v4');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { Schema } = mongoose;

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

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    set: email => email.toLowerCase(),
    index: {
      unique: true,
      sparse: true
    }
  },
  hashedPassword: {
    type: String,
    required: true
  }
});

const promisify = (fn) => (args) => new Promise((resolve, reject) => {
  fn(args, (error, ...rest) => error ? reject(error) : resolve(...rest));
});

/*
 * @api public
 * @param {Object} user
 * @return Promise<{user, error}>
 */
UserSchema.statics.register = async function(user) {
  const { error } = await validateSchema(user, registrationSchema);

  if (error) {
    return { error: enhancedValidationError(error) };
  }

  const createdUser = await insert(userWithPassword);
  return { user: createdUser };
}

/*
 * @api public
 * @param {String} email
 * @param {String} password
 * @return Promise<{user, error}>
 */
UserSchema.statics.login = async function({ email, password }) {
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
 * @param {Object} user
 * @returns Promise<user>
*/
UserSchema.statics.insert = function(user) {
  return promisify(User.create)(user);
}

/**
 * @api private
 * @param {String} email
 * @returns Promise<user>
 */
UserSchema.statics.findByEmail = function(email) {
  return promisify(this.findOne)({ email });
  //return new Promise((resolve, reject) => {
    //db.users.findOne({ email }, (err, user) => {
      //err ? reject(err) : resolve(user)
    //})
  //});
}

/**
 * @api private
 * @param {String} id
 * @returns Promise<user>
 */
UserSchema.statics.findById = function(id) {
  return promisify(this.constructor().findById)(id);
  //return new Promise((resolve, reject) => {
    //this.findOne({ _id: id }, (err, user) => {
      //err ? reject(err) : resolve(user)
    //})
  //});
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

/**
 * Plugin to add hashed password.
 * @api private
 */
async function withHashedPassword(schema) {
  schema.pre('save', async (next) => {
    this.hashedPassword = await bcrypt.hash(this.password, saltRounds);
    next();
  });
}

UserSchema.plugin(withHashedPassword);

const User = mongoose.model('User', UserSchema);

module.exports = User;
