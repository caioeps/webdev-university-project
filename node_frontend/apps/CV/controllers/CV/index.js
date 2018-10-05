'use strict';

const path = require('path');

const PeopleRepository = require(`${APP_ROOT}/lib/repositories/people`);
const Person = require(`${APP_ROOT}/lib/entities/person`);

const multer = require('multer');

const storage = multer.diskStorage({
  destination: path.resolve(APP_ROOT, 'tmp'),
  filename: (req, file, cb) => {
    cb(null, `person.photo.${Date.now()}`);
  }
});

const CVController = {
  Index: (_req, res) => {
    const peopleRepository = new PeopleRepository()
    const people = peopleRepository.getAll().reverse();
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
  Create: (req, res, next) => {
    const upload = multer({ storage }).single('photo');

    const permittedParams = ({ name, age, skills }) => ({ name, age, skills });

    upload(req, res, async (err) => {
      const person = new Person(permittedParams(req.body));
      const peopleRepository = new PeopleRepository();

      if(err instanceof multer.MulterError) {
        return next(err);
      }

      try {
        const persistedPerson = await peopleRepository.insert(person);

        const photoUrl =
          await peopleRepository.uploadPhoto(persistedPerson, req.file)
      } catch(error) {
        return next(error);
      }

      res.redirect('/cv');
    });
  },
  Delete: (req, res) => {
    const { id } = req.params;
    new PeopleRepository().delete(id);
    res.redirect('/cv');
  },
};

module.exports = CVController;
