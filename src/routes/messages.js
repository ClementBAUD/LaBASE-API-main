var express = require('express');
var router = express.Router();
const controllerMessage = require('./../controllers/message.controller');
const auth = require('../auth/auth');

// add function create delete update and testing

router.get('/', controllerMessage.MessageAll);

router.get('/detail',auth, controllerMessage.getMessage);

router.post('/creation', auth, controllerMessage.Messagecreate);

router.put('/update',auth, controllerMessage.MessageUpdate);

router.delete('/supprimer',auth, controllerMessage.MessageDelete);

router.delete('/users',auth, controllerMessage.getMessageUser);


//Magasinonline
module.exports = router;