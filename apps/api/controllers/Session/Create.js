const jwt = require('jsonwebtoken');
const uuidv4 = require('uuid/v4');

const User = require(`${APP_ROOT}/lib/models/user`);
const userSerializer = require(`${PATHS.SERIALIZERS}/userSerializer`);

async function Create(req, res, next) {
  const { email, password } = req.body;

  try {
    const { user, error } = await User.login({ email, password });

    if (user) {
      const token = uuidv4();

      user.setToken(token);
      await user.save();
      const apiKey = await jwt.sign({ email, token }, process.env.JWT_SECRET)
      res.set('X-Api-Key', apiKey);
      res.send(userSerializer.serialize(user));
    } else {
      res.status(422).send({
        error
      })
    }
  } catch (error) {
    next(error);
  }
}

module.exports = Create;
