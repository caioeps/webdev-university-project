'use strict';

const { Router } = require('express');
const router = Router();

// Controllers
const CVController = require('./controllers/CV');
const SessionController = require('./controllers/Session');
const RegistrationController = require('./controllers/Registration');

// Root
router.get('/', CVController.Index);
router.post('/', CVController.Create);

router.get('/registration/new', RegistrationController.New);
router.get('/session/new', SessionController.New);

router.get('/new', CVController.New);
router.get('/:id', CVController.Show);
router.delete('/:id', CVController.Delete);

module.exports = router;
