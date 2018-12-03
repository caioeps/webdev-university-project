const path = require('path');
const uuid = require('uuid/v4');
const fs = require('fs');
const mkdirp = require('mkdirp');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const { Types: { ObjectId } } = mongoose;

const db = require(`${APP_ROOT}/db`);

const CVSchema = new Schema({
  sections: {
    type: [
        new Schema({
            title: {required: true, type: String},
            content: {required: true, type: String}
        })
    ],
    required: true,
  },
  status: {
    type: String,
    default: 'active',
    enum: ['active', 'blocked']
  },
  user: {
    type: ObjectId,
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
    static getAll() {
        return new Promise((resolve, reject) => {
            CV.find({}, (err, cvs) => {
                err ? reject(err) : resolve(cvs)
            }).populate('user');
        });
    }

  /**
   * @api private
   * @returns Promise<cv>
   */
  static getAllFromUser(user) {
    return new Promise((resolve, reject) => {
      CV.find({ user }, (err, cvs) => {
        err ? reject(err) : resolve(cvs)
      }).populate('user');
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
    return new Promise((resolve, reject) => {
      cv.set(params);
      cv.save((error, updatedCv) => {
        error ? reject(error) : resolve(updatedCv);
      });
    });
  }

  /**
   * @api public
   */
  static destroy(cvId) {
    return new Promise((resolve, reject) => {
      CV.deleteOne({ _id: new ObjectId(cvId) }, (error) => {
        error ? resolve(false) : resolve(true);
      });
    });
  }
}

CVSchema.loadClass(CVModel)
const CV = mongoose.model('CV', CVSchema);

module.exports = CV;
