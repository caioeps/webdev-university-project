async function New(req, res) {
  const { email, password } = req.params;

  res.render('Session/New', {
    form: {
      errors: {}
    }
  });
}

module.exports = [New];
