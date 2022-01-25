var express = require('express');
var router = express.Router();
const controller = require('../controllers/statutcommande.controller');
const auth = require('../auth/auth')

router.get('/', auth, controller.getStatutcommande);

//router.post('/', controllerNotification.addcreatNotif)

module.exports = router;