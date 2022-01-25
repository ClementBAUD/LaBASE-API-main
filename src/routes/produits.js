var express = require('express');
var router = express.Router();
const controllerProduit = require('./../controllers/produit.controller');
const auth = require('../auth/auth');

// add function create delete update and testing



router.post('/creation',auth, controllerProduit.Createproduits);
router.post('/updateImage',auth, controllerProduit.UploadproduitsImage);
// upload d'un produits
router.post('/updateproduit',auth, controllerProduit.Uploadproduits);

// mais permet aussi la recherche avec plu 
router.get('/all',auth,controllerProduit.getListeproduits)

// get produit plu 
router.get('/produit',auth,controllerProduit.getProduitPLu)



/*router.post('/delete', controller.MiseADispoDelete); */
//MiseADispoDelete

module.exports = router;