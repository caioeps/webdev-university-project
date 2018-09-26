'use strict';

const { Router } = require('express');
const router = Router();

// Controllers
const CVController = require('./controllers/CV');

// Root
router.get('/', CVController.Index)
router.get('/cv/:id', CVController.Show)
router.get('/cv/new', CVController.New)

module.exports = router;
