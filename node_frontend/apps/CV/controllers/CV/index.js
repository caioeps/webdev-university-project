'use strict';

const PeopleRepository = require(`${APP_ROOT}/lib/repositories/people`);
const Person = require(`${APP_ROOT}/lib/entities/person`);

const CVController = {
  Index: (_req, res) => {
    const peopleRepository = new PeopleRepository()
    const people = peopleRepository.getAll()
    res.render('CV/Index', { people });
  },
  Show: (req, res) => {
    const peopleRepository = new PeopleRepository()
    const person = peopleRepository.find(req.params.id);
    res.render('CV/Show', { person  });
  },
  New: (_req, res) => {
    res.render('CV/New');
  },
  Create: (req, res) => {
    const { name, age, skills } = req.body;
    const person = new Person({ name, age, skills });
    new PeopleRepository().insert(person);
    res.redirect('/cv');
  },
  Delete: (req, res) => {
    const { id } = req.params;
    new PeopleRepository().delete(id);
    res.redirect('/cv');
  }
};

module.exports = CVController;
