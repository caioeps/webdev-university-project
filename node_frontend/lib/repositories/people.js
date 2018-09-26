const path = require('path');
const database = require(path.resolve(APP_ROOT, 'db'));

const peopleCollection = database.addCollection('people');

class PeopleRepository {
  constructor(collection = peopleCollection) {
    this.collection = collection
  }

  insert(person) {
    this.collection.insert(person);
  }
}

module.exports = PeopleRepository;
