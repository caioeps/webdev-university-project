const uuid = require('uuid/v4')
const path = require('path');

class Person {
  constructor(attrs = {}) {
    this.attributes = { ...attrs };
  }

  /**
   * @api public
   */
  getAttribute(name) {
    return this.attributes[name];
  }

  /**
   * @api public
   */
  setAttribute(name, value) {
    this.attributes[name] = value;
  }

  /**
   * @api public
   */
  generateId() {
    this.setAttribute('id', uuid());
  }

  /*
   * @api public
   */
  getAttributes() {
    return this.attributes;
  }
}

module.exports = Person;
