function ensureLoggedIn(action) {
  return [
    (req, res, next) => {
      if (res.locals.isLoggedIn()) {
        next();
      } else {
        res.redirect('/cv');
      }
    },
    action
  ]
}
