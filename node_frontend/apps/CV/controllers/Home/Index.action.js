module.exports = (req, res, next) => {
  res.render('Home/Index', {
    title: 'My App!'
  });
}
