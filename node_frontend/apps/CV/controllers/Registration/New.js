module.exports = (req, res) => res.render('Registration/New', {
  form: {
    name: '',
    errors: {}
  }
});
