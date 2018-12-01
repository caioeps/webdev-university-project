const User = require(`${PATHS.MODELS}/user`);
const userSerializer = require(`${PATHS.SERIALIZERS}/userSerializer`);

async function Create(req, res, next) {
  const { email, name, password, passwordConfirmation } = req.body;
  const userAttrs = { email, name, password, passwordConfirmation };

  try {
    const { user, error } = await User.register(userAttrs);

    if (error) {
      res.status(422).send(error);
    } else {
      res.send(userSerializer.serialize(user))
    }
  } catch(error) {
    next(error);
  }
};

module.exports = Create;

