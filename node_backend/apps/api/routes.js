'use strict';

const { Router } = require('express');
const router = Router();

// Controllers
const CVController = require('./controllers/CV');
const SessionController = require('./controllers/Session');
const RegistrationController = require('./controllers/Registration');

// Root
router.post('/registration', RegistrationController.Create);

router.post('/session', SessionController.Create)
router.delete('/session', SessionController.Destroy);

router.get('/cvs/:id', CVController.Show);
router.delete('/cvs/:id', CVController.Destroy);
router.put('/cvs/:id', CVController.Update);

router.get('/cvs/', CVController.Index);
router.post('/cvs/', CVController.Create);

module.exports = router;
