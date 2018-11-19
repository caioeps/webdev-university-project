function New(req, res) {
  res.render('Session/New', {
    form: {
      errors: {}
    }
  });
}

module.exports = [New];
