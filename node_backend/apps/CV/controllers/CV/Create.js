const ensureLoggedIn = require(`${CV_ROOT}/controllers/concerns/ensureLoggedIn`);
const CV = require(`${APP_ROOT}/lib/models/cv`);

async function Create(req, res, next) {
  const cvAttrs = { sections } = req.body;

  try {
    const { error, cv } = await CV.insert(cvAttrs, { user: req.currentUser });

    if (error) {
      next(error)
    } else {
      res.redirect('/cv');
    }
  } catch(error) {
    return next(error);
  }
};

function normalizeSections(req, _res, next) {
  const sections = req.body['sections[]']
  req.body.sections = Array.isArray(sections) ? sections : [sections]
  delete req.body['sections[]']
  next();
}

module.exports = [
  ensureLoggedIn,
  normalizeSections,
  Create
];
