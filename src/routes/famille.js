//Famille.controller
var express = require('express');
var router = express.Router();
const controllerfamille = require('../controllers/famille.controller');

const auth = require('../auth/auth')

// add function create delete update and testing

router.post('/creation',auth, controllerfamille.Famillecreate);
router.get('/',auth, controllerfamille.getListeFamille);
router.get('/client',auth,controllerfamille.getListeFamilleClient)


module.exports = router;