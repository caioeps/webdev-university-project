const authenticateUser = require(`${API_ROOT}/controllers/concerns/authenticateUser`);
const CV = require(`${PATHS.MODELS}/cv`);
const cvSerializer = require(`${PATHS.SERIALIZERS}/cvSerializer`);

async function Update(req, res, next) {
  const params = { sections } = req.body;

  let cv;

  try {
    cv = await CV.findById(req.params.id)
    const updatedCv = await CV.update(cv, params);
    res.send(cvSerializer.serialize(cv));
  } catch (error) {
    next(error);
  }
};

module.exports = [
  authenticateUser,
  Update
];
