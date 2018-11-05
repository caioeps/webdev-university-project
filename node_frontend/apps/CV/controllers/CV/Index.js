const ensureLoggedIn = require(`${CV_ROOT}/controllers/concerns/ensureLoggedIn`);
const CV = require(`${APP_ROOT}/lib/models/cv`);

async function Index(req, res) {
  const cvs = await CV.getAllFromUser(req.currentUser)
  res.render('CV/Index', { cvs: cvs.reverse() });
};

module.exports = [
  ensureLoggedIn,
  Index
]
