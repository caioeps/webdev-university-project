const path = require('path');
const uuid = require('uuid/v4')

const database = require(path.resolve(APP_ROOT, 'db'));

const Person = require(`${APP_ROOT}/lib/entities/person`);

class PeopleRepository {
  constructor() {
    this.collectionName = 'people';
  }

  getAll() {
    return this.getCollection().data.map((person) => new Person(person));
  }

  find(id) {
    const res = this.getCollection().findOne({ id });
    console.log(res)
    return new Person(res);
  }

  insert(person) {
    const personWithId = { ...person, id: uuid() };
    const result = this.getCollection().insert(personWithId);
    database.saveDatabase();
    return result;
  }

  /**
   * @api private
   */
  getCollection() {
    return database.getCollection(this.collectionName) || database.addCollection(this.collectionName);
  }

  generateUuid() {
    return ([1e7] + -1e3 + -4e3 + -8e3 +-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
  }
}

module.exports = PeopleRepository;
