const jwt = require('jsonwebtoken');
const uuidv4 = 'uuid/v4';

const ensureLoggedOut = require(`${CV_ROOT}/controllers/concerns/ensureLoggedOut`);

const User = require(`${APP_ROOT}/lib/models/user`);

async function Create(req, res, next) {
  const { email, password } = req.body;

  try {
    const { user, error } = await User.login({ email, password });

    if (user) {
      const uuid = uuidv4();
      const apiKey = jwt.sign({ email, uuid }, process.env.JWT_SECRET)
      res.send({ meta: { apiKey } });
    } else {
      res.status(422).send({
        message: 'Wrong email or password'
      })
    }
  } catch (error) {
    next(error);
  }
}

module.exports = ensureLoggedOut(Create);
