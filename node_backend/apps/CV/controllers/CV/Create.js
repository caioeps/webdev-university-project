const ensureLoggedIn = require(`${CV_ROOT}/controllers/concerns/ensureLoggedIn`);
const CV = require(`${APP_ROOT}/lib/models/cv`);

async function Create(req, res) {
  const cv = { sections } = req.body;

  try {
    const persistedCv = await CV.insert(cv, { user: req.currentUser });
  } catch(error) {
    return next(error);
  }

  res.redirect('/cv');
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
