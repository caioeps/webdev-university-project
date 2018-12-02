const authenticateUser = require(`${API_ROOT}/controllers/concerns/authenticateUser`);
const CV = require(`${APP_ROOT}/lib/models/cv`);

async function Destroy(req, res) {
  try {
    if (await CV.destroy(req.params.id)) {
      res.sendStatus(200);
    } else {
      res.sendStatus(422);
    }
  } catch(error) {
    next(error);
  }
};

module.exports = [
  authenticateUser,
  Destroy
]
