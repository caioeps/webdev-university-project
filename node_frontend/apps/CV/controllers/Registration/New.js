module.exports = (req, res) => res.render('Registration/new', {
  form: {
    name: '',
    errors: {}
  }
});
