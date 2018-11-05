const path = require('path');
const uuid = require('uuid/v4');
const fs = require('fs');
const mkdirp = require('mkdirp');

const db = require(`${APP_ROOT}/db`);

/**
 * @api private
 * @returns Promise<cv>
 */
function getAllFromUser(user) {
  return new Promise((resolve, reject) => {
    db.cvs.find({ userId: user._id }, (err, cvs) => {
      err ? reject(err) : resolve(cvs)
    })
  });
}

/**
 * @api private
 * @returns Promise<cv>
 */
function find(id) {
  return new Promise((resolve, reject) => {
    db.cvs.findOne({ _id: id }, (err, cv) => {
      err ? reject(err) : resolve(cv)
    })
  });
}

/**
 * @api public
 * @param {object} cv
 * @returns Promise<Object> The CV.
 */
function insert(cv, { user = {} } = {}) {
  return new Promise((resolve, reject) => {
    db.cvs.insert(filterAttributes({ ...cv, userId: user._id }), (err, createdCv) => {
      err ? reject(err) : resolve(createdCv)
    });
  });
}

/**
 * @api public
 * @param {object} cv
 * @returns Promise<Object> The CV.
 */
async function update(id, attrs) {
  const options = { returnUpdatedDocs: true };

  return new Promise((resolve, reject) => {
    db.cvs.update({ _id: id }, attrs, options, (err, numAffected, cvs) => {
      err ? reject(err) : resolve(cvs[0])
    });
  });
  return getCollection().update(filterAttributes(cv));
}

/**
 * @api public
 */
function destroy(id) {
  return new Promise((resolve, reject) => {
    db.cvs.remove({ _id: id }, (err, numAffected) => {
      err ? reject(err) : resolve(numAffected)
    });
  });
}

/**
 * @api public
 */
function uploadPhoto(cv, photo) {
  const { destination, filename, publicPath } = uploads.photo;
  const newLocation = path.join(destination(cv), filename(photo));

  if(!fs.existsSync(destination(cv))) {
    mkdirp.sync(destination(cv));
  }

  return new Promise((resolve, reject) => {
    fs.rename(photo.path, newLocation, (err) => {
      if(err) {
        reject(err);
      } else {
        cv.photoUrl = publicPath(newLocation);
        CV.update(cv);
        resolve(newLocation);
      }
    });
  });
}

/**
 * @api private
 */
function getCollection() {
  return database.getCollection(COLLECTION_NAME) || database.addCollection(COLLECTION_NAME);
}

/**
 * @api private
 */
function withId(cv) {
  return { ...cv, id: uuid() };
}

/**
 * @api private
 */
function filterAttributes({ id, sections, userId }) {
  return { id, sections, userId };
}

const CV = {
  getAllFromUser,
  find,
  insert,
  update,
  destroy,
  uploadPhoto,
}

module.exports = CV;
