class Person {
  constructor(attrs = {}) {
    this.name = attrs.name || '';
    this.age = attrs.age
    this.skills = attrs.skills;
    this.id = attrs.id;
  }
}

module.exports = Person;
