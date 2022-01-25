var express = require('express');
var router = express.Router();
const controllerMagasin = require('./../controllers/magasin.controller');
const auth = require('../auth/auth');
const { route } = require('./produits');

// add function create delete update and testing

router.post('/listmagasin', controllerMagasin.MagasinAll);
//router.post('/magasin',auth ,controllerMagasin.MagasinAll);


router.get('/detail',auth, controllerMagasin.getMagasin);

router.post('/creation', auth, controllerMagasin.Magasincreate);

router.put('/update',auth, controllerMagasin.MagasinUpdate);

router.delete('/supprimer',auth, controllerMagasin.MagasinDelete);

router.get('/users',auth, controllerMagasin.getUserMagasin);

router.get('/magasin-users',auth, controllerMagasin.getMagasinUser);

router.put('/magasin-online',auth, controllerMagasin.Magasinonline);

//Magasinonline
module.exports = router;