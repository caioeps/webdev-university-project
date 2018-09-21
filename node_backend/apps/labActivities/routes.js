'use strict';

const { Router } = require('express');
const router = Router();

// Controllers
const HomeController = require('./controllers/Home');

// Root
router.get('/', (_req, res, _next) => {
  res.redirect('labActivities/home');
});

router.get('/home', HomeController.Index);

module.exports = router;
