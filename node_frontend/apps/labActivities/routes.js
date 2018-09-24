'use strict';

const { Router } = require('express');
const router = Router();

// Controllers
const HomeController = require('./controllers/Home');
const CVController = require('./controllers/CV');

// Root
router.get('/', (_req, res, _next) => {
  res.redirect('labActivities/home');
});

router.get('/home', HomeController.Index);

router.get('/cv/:id', CVController.Show)

module.exports = router;
