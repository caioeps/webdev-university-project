const path       = require('path');
const express    = require('express');
const bodyParser = require('body-parser');
const session    = require('express-session');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'templates'));

app.use(session({
  secret: 'appSessionSecret'
}));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

app.use('/', require('./routes'));

app.locals = {
  getAssetUrl: require('./helpers/getAssetUrl'),
}

app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.isLoggedIn = !!req.session.userId;
  next();
});

module.exports = app;
