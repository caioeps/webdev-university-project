const mongoose = require('mongoose');
const { Schema } = mongoose;

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
  role: {
      type: String,
      default: 'user',
      enum: ['admin', 'user']
  },
  hashedPassword: {
    type: String,
    required: true
  },
  cvs: [{
    type: Schema.Types.ObjectId,
    ref: 'CV'
  }],
  hashedToken: String
});

UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ email: 1, token: 1 });

module.exports = UserSchema;
