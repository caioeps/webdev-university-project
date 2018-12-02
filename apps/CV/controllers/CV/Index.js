const ensureLoggedIn = require(`${CV_ROOT}/controllers/concerns/ensureLoggedIn`);
const User = require(`${APP_ROOT}/lib/models/user`);
const CV = require(`${APP_ROOT}/lib/models/cv`);

async function Index(req, res, next) {
  const cvs = await CV.getAllFromUser(req.currentUser);
  res.render('CV/Index', { cvs });
};

module.exports = [
  ensureLoggedIn,
  Index
];
