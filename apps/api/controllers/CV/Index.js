const authenticateUser = require(`${API_ROOT}/controllers/concerns/authenticateUser`);
const CV = require(`${APP_ROOT}/lib/models/cv`);
const cvSerializer = require(`${PATHS.SERIALIZERS}/cvSerializer`);

async function Index(req, res, next) {
  let cvs = [];

  if(req.currentUser && req.currentUser.role === 'admin'){
      cvs = await CV.getAll();
  } else {
      cvs = await CV.getAllFromUser(req.currentUser);
  }

  res.send(cvSerializer.serialize(cvs));
}

module.exports = [
  authenticateUser,
  Index
];
