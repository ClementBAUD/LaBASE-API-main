var express = require('express');
var router = express.Router();
const controllermiseadispo = require('./../controllers/miseadispo.controller');
const controllerProduit = require('./../controllers/produit.controller');
const auth = require('../auth/auth');

// add function create delete update and testing



router.post('/creation',auth, controllermiseadispo.CreateMise_A_Dispo);
router.post('/update-commande',auth, controllermiseadispo.MiseADispoUpdate);
router.post('/update',auth, controllermiseadispo.DispoUpdate);

router.post('/delete',auth, controllermiseadispo.MiseADispoDelete);
//MiseADispoDelete

// liste produit dispo du jour 
router.get('/day',auth, controllermiseadispo.ListeproduiDay);

//detail produit dispo du jour
router.get('/detail',auth, controllermiseadispo.getIbyproduit);

// liste produit par magasin sur une periode donnée 
router.get('/produit_periode',auth, controllermiseadispo.ListeproduitFiltre);

// liste des produits par mag 
router.get('/produit_magasin',auth, controllermiseadispo.listeProduitAllMag);

//liste des produits de tous les mag 
router.get('/all_produit',auth, controllermiseadispo.listeProduitAll);

router.get('/all-dispo',auth, controllerProduit.listeProduitMAgDay)

//liste des produits dispo et leurs categories 
//listeProduitCategories
router.get('/all-categories',auth, controllermiseadispo.listeProduitCategories)
router.get('/categories-produits',auth, controllermiseadispo.CategorieslisteProduit)

router.get('/detail-produits',auth, controllermiseadispo.DetailProduits)
module.exports = router;