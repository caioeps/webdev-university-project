const authenticateUser = require(`${API_ROOT}/controllers/concerns/authenticateUser`);
const CV = require(`${APP_ROOT}/lib/models/cv`);
const User = require(`${APP_ROOT}/lib/models/user`);

async function Show(req, res) {
  const { id } = req.params;
  const cv = await CV.findById(id).populate('user');
  res.render('CV/Edit', { cv, user: cv.user });
}

module.exports = [
  authenticateUser,
  Show,
]
