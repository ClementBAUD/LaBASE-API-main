var express = require('express');
var router = express.Router();
const parametreController = require('../controllers/parametre.controller');

const auth = require('../auth/auth')

// add function create delete update and testing

router.post('/creation',auth, parametreController.create_parmas);
router.post('/update',auth, parametreController.update_parmas);
router.get('/liste', parametreController.liste_parmas);


module.exports = router;