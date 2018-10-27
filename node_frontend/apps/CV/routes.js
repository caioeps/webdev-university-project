'use strict';

const { Router } = require('express');
const router = Router();

// Controllers
const CVController = require('./controllers/CV');
const SessionController = require('./controllers/Session');
const RegistrationController = require('./controllers/Registration');

// Root
router.get('/registration/new', RegistrationController.New);
router.post('/registration', RegistrationController.Create);

router.get('/session/new', SessionController.New);
router.post('/session', SessionController.Create)
router.delete('/session', SessionController.Destroy);

router.get('/new', CVController.New);
router.get('/:id', CVController.Show);
router.delete('/:id', CVController.Delete);

router.get('/', CVController.Index);
router.post('/', CVController.Create);

module.exports = router;
