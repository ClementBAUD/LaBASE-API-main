var express = require('express');
var router = express.Router();
const controllerCommande = require('../controllers/commande.controller');
const serviceLigneCommande = require('../services/lignecommande.services')

const auth = require('../auth/auth');
const { ligneCommande } = require('../db/sequelize');

// add function create delete update and testing

router.post('/creation_first', auth, controllerCommande.create_Commande);

router.post('/Tab_ligne_commande', [auth,serviceLigneCommande.verifTableau_NumCommande,serviceLigneCommande.verifQuantCommande], controllerCommande.create_TabLignecommande);
router.post('/update', auth, controllerCommande.update_Commande);
//delete_commande
router.post('/deleteCommande', auth, controllerCommande.delete_commande);
router.get('/statut_commande', auth, controllerCommande.status_commande)
router.get('/info_commande', auth, controllerCommande.info_commande)


//getnbreComDayByUSer
module.exports = router;