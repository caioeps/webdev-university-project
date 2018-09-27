'use strict';

const PeopleRepository = require(`${APP_ROOT}/lib/repositories/people`);
const Person = require(`${APP_ROOT}/lib/entities/person`);

const CVController = {
  Index: (req, res, next) => {
    const peopleRepository = new PeopleRepository()
    const people = peopleRepository.getAll()
    res.render('CV/Index', { people });
  },
  Show: (req, res, next) => {
    const peopleRepository = new PeopleRepository()
    const person = peopleRepository.find(req.params.id);
    res.render('CV/Show', { person  });
  },
  New: (req, res, next) => {
    res.render('CV/New');
  },
  Create: (req, res, next) => {
    const { name, age, skills } = req.body;
    const person = new Person({ name, age, skills });
    new PeopleRepository().insert(person);
    res.redirect('/cv');
  }
};

module.exports = CVController;
