var express = require('express');
var router = express.Router();
const controllerCommande = require('../controllers/commande.controller');

const auth = require('../auth/auth')

// add function create delete update and testing

router.post('/creation_first', auth, controllerCommande.create_Commande);
router.post('/ligne_commande', auth, controllerCommande.create_Lignecommande);
router.post('/update', auth, controllerCommande.update_Commande);
//delete_commande
router.post('/deleteCommande', auth, controllerCommande.delete_commande);

router.get('/statut_commande', auth, controllerCommande.status_commande)
router.get('/info_commande', auth, controllerCommande.info_commande)


//getnbreComDayByUSer
module.exports = router;