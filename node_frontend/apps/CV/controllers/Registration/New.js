module.exports = function(req, res) {
  res.render('Registration/New', {
    form: {
      name: '',
      errors: {}
    }
  });
}
