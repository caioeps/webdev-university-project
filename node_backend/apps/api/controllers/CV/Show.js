const authenticateUser = require(`${API_ROOT}/controllers/concerns/authenticateUser`);
const CV = require(`${APP_ROOT}/lib/models/cv`);
const User = require(`${APP_ROOT}/lib/models/user`);
const cvSerializer = require(`${PATHS.SERIALIZERS}/cvSerializer`);

async function Show(req, res) {
  const { id } = req.params;
  const cv = await CV.findById(id).populate('user');
  res.send(cvSerializer.serialize(cv));
}

module.exports = [
  authenticateUser,
  Show,
]
