const path = require('path');
const uuid = require('uuid/v4');
const fs = require('fs');
const mkdirp = require('mkdirp');

const database = require(path.resolve(APP_ROOT, 'db'));

const uploads = {
  photo: {
    destination: (cv) => path.resolve(APP_ROOT, 'public', 'uploads', 'cvs', 'photo', cv.id),
    filename: (file) => `${Date.now()}.${file.originalname}`,
    publicPath: (destination) => '/' + path.relative(APP_ROOT, destination)
  }
};

const COLLECTION_NAME = 'cvs';

/**
 * @api public
 */
function getAll() {
  return getCollection().data;
}

/**
 * @api public
 */
function find(id) {
  return getCollection().findOne({ id });
}

/**
 * @api public
 * @param {object} cv
 */
async function insert(cv) {
  const cvWithId = withId(cv);
  return getCollection().insert(filterAttributes(cvWithId));
}

/**
 * @api public
 */
async function update(cv) {
  return getCollection().update(filterAttributes(cv));
}

/**
 * @api public
 */
function destroy(id) {
  return getCollection().removeWhere({ id });
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
function filterAttributes({ id, photoUrl, skills, name }) {
  return { id, photoUrl, skills, name };
}

const CV = {
  getAll,
  find,
  insert,
  update,
  destroy,
  uploadPhoto,
}

module.exports = CV;
