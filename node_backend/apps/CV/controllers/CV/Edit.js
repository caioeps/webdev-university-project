const ensureLoggedIn = require(`${CV_ROOT}/controllers/concerns/ensureLoggedIn`);
const CV = require(`${APP_ROOT}/lib/models/cv`);
const User = require(`${APP_ROOT}/lib/models/user`);

async function Edit(req, res) {
  const { id } = req.params;
  const cv = await CV.find(id)
  const user = await User.find(cv.userId)
  res.render('CV/Edit', { cv, user });
}

module.exports = [
  ensureLoggedIn,
  Edit,
]

