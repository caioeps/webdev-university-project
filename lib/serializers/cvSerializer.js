const JSONAPISerializer = require('jsonapi-serializer').Serializer;

const CVSerializer = new JSONAPISerializer('cv', {
  attributes: [
    'sections',
    'user',
    'status'
  ],
});

module.exports = CVSerializer;
