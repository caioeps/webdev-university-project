function ensureLoggedOut(action) {
  return [
    (req, res, next) => {
      if (res.locals.isLoggedIn()) {
        const backUrl = req.header('Referer') || '/cv'
        res.redirect(backUrl);
      } else {
        next();
      }
    },
    action
  ]
}

module.exports = ensureLoggedOut;
