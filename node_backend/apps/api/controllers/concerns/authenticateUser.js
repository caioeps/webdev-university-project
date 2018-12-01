const jwt = require('jsonwebtoken');

const User = require(`${APP_ROOT}/lib/models/user`);

async function authenticateUser(req, res, next) {
  const jwtToken = req.header('X-Api-Key');

  try {
    const { email, token } = await jwt.verify(jwtToken, process.env.JWT_SECRET);
    req.currentUser = await User.find({ email, token });
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = authenticateUser;
