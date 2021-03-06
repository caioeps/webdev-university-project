const ensureLoggedIn = require(`${CV_ROOT}/controllers/concerns/ensureLoggedIn`);
const CV = require(`${APP_ROOT}/lib/models/cv`);

async function Destroy(req, res) {
  try {
    if (await CV.destroy(req.params.id)) {
      req.flash('notice', 'CV deleted successfully.');
    } else {
      req.flash('error', 'Couldn\'t delee CV. Please, try again.');
    }

    res.redirect('/cv');
  } catch(error) {
    next(error);
  }
};

module.exports = [
  ensureLoggedIn,
  Destroy
]
