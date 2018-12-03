const JSONAPISerializer = require('jsonapi-serializer').Serializer;

const UserSerializer = new JSONAPISerializer('user', {
  attributes: [
    'name',
    'email',
    'role',
    'cvs'
  ]
});

module.exports = UserSerializer;
