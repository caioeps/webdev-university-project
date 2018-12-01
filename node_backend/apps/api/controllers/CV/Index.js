const authenticateUser = require(`${API_ROOT}/controllers/concerns/authenticateUser`);
const User = require(`${APP_ROOT}/lib/models/user`);
const CV = require(`${APP_ROOT}/lib/models/cv`);

async function Index(req, res, next) {
  const cvs = await CV.getAllFromUser(req.currentUser);
  res.render('CV/Index', { cvs });
};

module.exports = [
  authenticateUser,
  Index
];