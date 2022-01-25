var express = require('express');
var router = express.Router();
const controller = require('../controllers/statutcompte.controller');
const auth = require('../auth/auth')

router.get('/',auth, controller.getStatutcompte);

//router.post('/', controllerNotification.addcreatNotif)

module.exports = router;