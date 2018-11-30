const Joi = require('joi')
const uuid = require('uuid/v4');
const bcrypt = require('bcrypt');

const mongoose = require('mongoose');
const { Schema } = mongoose;

const saltRounds = 10;

const db = require(`${APP_ROOT}/db`);

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
  },
  hashedPassword: {
    type: String,
    required: true
  },
  cvs: [{
    type: Schema.Types.ObjectId,
    ref: 'CV'
  }],
  token: String
});

UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ email: 1, token: 1 });

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
        if (await User.findByEmail(value)) {
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

class UserModel {
  /*
   * @api public
   * @param {Object} user
   * @return Promise<{user, error}>
   */
  static async register(attrs) {
    const { error: joiError } = await validateSchema(attrs, registrationSchema);

    if (joiError) {
      return { error: decorateJoiError(joiError) };
    }

    const { user, error: mongooseError } = await User.insert(attrs);
    return { user, error: decorateMongooseError(mongooseError) };
  }

  /*
   * @api public
   * @param {String} email
   * @param {String} password
   * @return Promise<{user, error}>
   */
  static async login({ email, password }) {
    const { error } = await validateSchema({ email, password }, loginSchema);

    if (error) {
      return { error: decorateJoiError(error) };
    }

    const loginError = {
      error: {
        base: 'Email or password not valid'
      }
    }

    const user = await User.findByEmail(email);

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
  static insert(attrs) {
    let user = new User(attrs);

    return new Promise((resolve, reject) => {
      user.save(error => {
        resolve({ error, user });
      });
    })
  }

  /**
   * @api private
   * @param {String} email
   * @returns Promise<user>
   */
  static findByEmail(email) {
    return new Promise((resolve, reject) => {
      User.findOne({ email }, (err, user) => {
        err ? reject(err) : resolve(user)
      })
    });
  }

  get password() {
    return this.password_;
  }

  set password(value) {
    this.password_ = value;
  }

  get passwordConfirmation() {
    return this.passwordConfirmation_;
  }

  set passwordConfirmation(value) {
    this.passwordConfirmation_ = value;
  }
}

/**
 * @api private
 * @param {Object} error - The error from Joi lib.
 * @returns {Object} A better formatted error so it can be used by the frontend.
 */
function decorateJoiError(error) {
  if (!error) return error;

  return error.details.reduce((errors, { context: { key }, message }) => {
    errors[key] = message;
    return errors;
  }, {});
}

function decorateMongooseError(error) {
  if (!error) return {};

  return Object.keys(error.errors).reduce((errors, key) => {
    errors[key] = errors.errors[key].message;
    return errors;
  }, {});
}

/**
 * Plugin to add hashed password.
 * @api private
 */
async function withHashedPassword(schema) {
  schema.pre('validate', async function(next) {
    if (this.password && this.passwordConfirmation) {
      this.hashedPassword = await bcrypt.hash(this.password, saltRounds);
    }

    next();
  });
}

UserSchema.plugin(withHashedPassword);
UserSchema.loadClass(UserModel)

const User = mongoose.model('User', UserSchema);

module.exports = User;
