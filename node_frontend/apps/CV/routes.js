'use strict';

const { Router } = require('express');
const router = Router();

// Controllers
const CVController = require('./controllers/CV');

// Root
router.get('/', CVController.Index);
router.post('/', CVController.Create);
router.get('/new', CVController.New);
router.get('/:id', CVController.Show);
router.delete('/:id', CVController.Delete);

module.exports = router;
