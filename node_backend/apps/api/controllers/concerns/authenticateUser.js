const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require(`${APP_ROOT}/lib/models/user`);

async function authenticateUser(req, res, next) {
  try {
    const { email } = await jwt.verify(getApiToken(req), process.env.JWT_SECRET);
    const user = await User.findOne({ email });

    if (user) {
      req.currentUser = user;
      next();
    } else {
      renderUnauthenticated(req, res);
    }
  } catch (error) {
    next(error);
  }
}

const getApiToken = req => req.header('X-Api-Token');

function checkApiToken(req, res, next) {
  getApiToken(req) ? next() : renderUnauthenticated(req, res);
}

function renderUnauthenticated(req, res) {
  res.status(401).send({ message: "Authentication failed. Please, check if you're passing X-Api-Token in headers." });
}

module.exports = [
  checkApiToken,
  authenticateUser
];

