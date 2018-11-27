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
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true
  }
});

class CVModel {
  /**
   * @api private
   * @returns Promise<cv>
   */
  static getAllFromUser(user) {
    return new Promise((resolve, reject) => {
      CV.find({ userId: user._id }, (err, cvs) => {
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
  static insert(cv, { user = {} } = {}) {
    return new Promise((resolve, reject) => {
      CV.insert(filterAttributes({ ...cv, userId: user._id }), (err, createdCv) => {
        err ? reject(err) : resolve(createdCv)
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

CVSchema.index({ userId: 1 });
CVSchema.loadClass(CVModel)

const CV = mongoose.model('CV', CVSchema);

module.exports = CV;
