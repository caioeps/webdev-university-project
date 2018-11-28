const ensureLoggedIn = require(`${CV_ROOT}/controllers/concerns/ensureLoggedIn`);
const CV = require(`${APP_ROOT}/lib/models/cv`);

async function Index(req, res, next) {
  try {
    console.log(req.currentUser)
    console.log(typeof req.currentUser)
    await req.currentUser.populate('cvs').execPopulate();
    const cvs = req.currentUser.cvs;
    console.log(req.currentUser)
    console.log(cvs)
    res.render('CV/Index', { cvs: cvs.reverse() });
  } catch (error) {
    next(error);
  }
};

module.exports = [
  ensureLoggedIn,
  Index
]
