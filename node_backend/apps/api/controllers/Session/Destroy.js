const authenticateUser = require(`${API_ROOT}/controllers/concerns/authenticateUser`);

async function Destroy(req, res, next) {
  const { currentUser } = req;

  currentUser.expireToken();

  try {
    await user.save();
    res.send({ message: 'Logged out' });
  } catch(error) {
    next(error);
  }
}

module.exports = [
  authenticateUser,
  Destroy
];
