const authenticateUser = require(`${API_ROOT}/controllers/concerns/authenticateUser`);
const CV = require(`${APP_ROOT}/lib/models/cv`);
const cvSerializer = require(`${PATHS.SERIALIZERS}/cvSerializer`);

async function Create(req, res, next) {
  const cvAttrs = { sections } = req.body;

  try {
    console.log(req.body)
    const { error, cv } = await CV.insert(cvAttrs, { user: req.currentUser });

    if (error) {
      res.status(422).send(error);
    } else {
      res.status(201).send(cvSerializer.serialize(cv));
    }
  } catch(error) {
    return next(error);
  }
};

module.exports = [
  authenticateUser,
  Create
];
