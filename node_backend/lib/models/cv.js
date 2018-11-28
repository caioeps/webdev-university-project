const path = require('path');
const uuid = require('uuid/v4');
const fs = require('fs');
const mkdirp = require('mkdirp');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const db = require(`${APP_ROOT}/db`);

const CVSchema = new Schema({
  sections: {
    type: [String],
    required: true,
    validate : {
      validator : (array) => array.every(v => typeof v === 'string')
    }
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true,
    ref: 'User'
  }
});

CVSchema.index({ userId: 1 });

class CVModel {
  /**
   * @api private
   * @returns Promise<cv>
   */
  static getAllFromUser(user) {
    return new Promise((resolve, reject) => {
      CV.find({ user }, (err, cvs) => {
        err ? reject(err) : resolve(cvs)
      })
    });
  }

  /**
   * @api private
   * @returns Promise<cv>
   */
  static find(id) {
    return new Promise((resolve, reject) => {
      CV.findOne({ _id: id }, (err, cv) => {
        err ? reject(err) : resolve(cv)
      })
    });
  }

  /**
   * @api public
   * @param {object} cv
   * @returns Promise<Object> The CV.
   */
  static insert(attrs, { user }) {
    const cv = new CV(attrs);
    cv.user = user;

    return new Promise((resolve, reject) => {
      cv.save(cvError => {
        if (cvError) resolve({ error: cvError });

        user.cvs.push(cv);

        user.save(userError => {
          resolve({ error: userError, cv });
        });
      });
    });
  }

  /**
   * @api public
   * @param {object} cv
   * @param {object} params
   * @returns Promise<Object> The CV.
   */
  static async update(cv, params) {
    const options = { returnUpdatedDocs: true };

    return new Promise((resolve, reject) => {
      CV.update({ _id: cv._id }, filterAttributes({ ...cv, ...params }), options, (err, numAffected, cvs) => {
        err ? reject(err) : resolve(cvs[0]);
      });
    });
  }

  /**
   * @api public
   */
  static destroy(id) {
    return new Promise((resolve, reject) => {
      CV.remove({ _id: id }, (err, numAffected) => {
        err ? reject(err) : resolve(numAffected)
      });
    });
  }
}

CVSchema.loadClass(CVModel)
const CV = mongoose.model('CV', CVSchema);

module.exports = CV;
