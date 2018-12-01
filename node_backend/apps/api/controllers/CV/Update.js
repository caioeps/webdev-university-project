const authenticateUser = require(`${API_ROOT}/controllers/concerns/authenticateUser`);
const CV = require(`${APP_ROOT}/lib/models/cv`);

async function Update(req, res, next) {
  const params = { sections } = req.body;

  let cv;

  try {
    cv = await CV.findById(req.params.id)
    const updatedCv = await CV.update(cv, params);
    req.flash('notice', 'CV updated successfully.')
    res.redirect('/cv');
  } catch(error) {
    next(error);
  }
};

function normalizeSections(req, _res, next) {
  const sections = req.body['sections[]']
  req.body.sections = Array.isArray(sections) ? sections : [sections]
  delete req.body['sections[]']
  next();
}

module.exports = [
  authenticateUser,
  normalizeSections,
  Update
];
