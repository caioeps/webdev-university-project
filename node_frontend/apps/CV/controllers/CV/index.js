'use strict';

const path = require('path');

const CV = require(`${APP_ROOT}/lib/models/cv`);

const multer = require('multer');

const storage = multer.diskStorage({
  destination: path.resolve(APP_ROOT, 'tmp'),
  filename: (req, file, cb) => {
    cb(null, `cv.photo.${Date.now()}`);
  }
});

const CVController = {
  Index: (_req, res) => {
    const cvs = CV.getAll().reverse();
    res.render('CV/Index', { cvs });
  },
  Show: (req, res) => {
    const cv = CV.find(req.params.id);
    res.render('CV/Show', { cv });
  },
  New: (_req, res) => {
    res.render('CV/New');
  },
  Create: (req, res, next) => {
    const upload = multer({ storage }).single('photo');

    const permittedParams = ({ name, age, skills }) => ({ name, age, skills });

    upload(req, res, async (err) => {
      const cv = permittedParams(req.body);

      if(err instanceof multer.MulterError) {
        return next(err);
      }

      try {
        const persistedCv = await CV.insert(cv);
        const photoUrl = await CV.uploadPhoto(persistedCv, req.file)
      } catch(error) {
        return next(error);
      }

      res.redirect('/cv');
    });
  },
  Delete: (req, res) => {
    CV.destroy(re.params.id);
    res.redirect('/cv');
  },
};

module.exports = CVController;
