const path = require('path');
const uuid = require('uuid/v4');
const fs = require('fs');
const mkdirp = require('mkdirp');

const database = require(path.resolve(APP_ROOT, 'db'));

const Person = require(`${APP_ROOT}/lib/entities/person`);

const uploads = {
  photo: {
    destination: (person) => path.resolve(APP_ROOT, 'public', 'uploads', 'people', 'photo', person.getAttribute('id')),
    filename: (file) => `${Date.now()}.${file.originalname}`,
    publicPath: (destination) => '/' + path.relative(APP_ROOT, destination)
  }
};

class PeopleRepository {
  constructor() {
    this.collectionName = 'people';
  }

  getAll() {
    return this.getCollection().data.map((person) => new Person(person));
  }

  find(id) {
    const res = this.getCollection().findOne({ id });
    return new Person(res);
  }

  /**
   * @param {Person} person
   */
  async insert(person) {
    person.generateId();
    const res = this.getCollection().insert(person.getAttributes());
    console.log('INSERT', res)
    return new Person(res);
  }

  async update(person) {
    this.getCollection().update(person.getAttributes());
  }

  delete(id) {
    return this.getCollection().removeWhere({ id });
  }

  /**
   * @api public
   */
  uploadPhoto(person, photo) {
    const { destination, filename, publicPath } = uploads.photo;
    const newLocation = path.join(destination(person), filename(photo));

    if(!fs.existsSync(destination(person))) {
      mkdirp.sync(destination(person));
    }

    return new Promise((resolve, reject) => {
      fs.rename(photo.path, newLocation, (err) => {
        if(err) {
          reject(err);
        } else {
          person.setAttribute('photoUrl', publicPath(newLocation));
          const repo = new PeopleRepository();
          repo.update(person);
          resolve(newLocation);
        }
      });
    });
  }

  /**
   * @api private
   */
  getCollection() {
    return database.getCollection(this.collectionName) || database.addCollection(this.collectionName);
  }
}

module.exports = PeopleRepository;
