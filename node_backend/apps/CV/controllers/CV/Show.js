const ensureLoggedIn = require(`${CV_ROOT}/controllers/concerns/ensureLoggedIn`);
const CV = require(`${APP_ROOT}/lib/models/cv`);
const User = require(`${APP_ROOT}/lib/models/user`);

async function Show(req, res) {
  const cv = await CV.find(req.params.id);
  const user = await User.find(cv.userId);
  res.render('CV/Show', { cv, user });
}

module.exports = [
  ensureLoggedIn,
  Show,
]
