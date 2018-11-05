const ensureLoggedIn = require(`${CV_ROOT}/controllers/concerns/ensureLoggedIn`);
const CV = require(`${APP_ROOT}/lib/models/cv`);

async function Update(req, res) {
  const cv = { sections } = req.body;

  try {
    console.log('hi')
    const updatedCv = await CV.update(req.params.id, cv);
    req.flash('notice', 'CV updated successfully.')
    res.redirect('/cv');
  } catch(error) {
    req.flash('error', 'Error updating CV.')
    res.redirect(`/cv/edit/${cv._id}`)
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
  Update
];
