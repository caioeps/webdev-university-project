module.exports = req => ({
  isLoggedIn: () => !!req.session.userId
});
