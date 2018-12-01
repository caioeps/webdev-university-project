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

router.get('/:id', CVController.Show);
router.delete('/:id', CVController.Destroy);
router.put('/:id', CVController.Update);

router.get('/', CVController.Index);
router.post('/', CVController.Create);

module.exports = router;
