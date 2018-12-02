const JSONAPISerializer = require('jsonapi-serializer').Serializer;

const CVSerializer = new JSONAPISerializer('cv', {
  attributes: [
    'sections',
  ]
});

module.exports = CVSerializer;
