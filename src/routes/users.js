var express = require('express');
var router = express.Router();
const controllerUser = require('./../controllers/users.controller');
const Gestioncontroller = require('./../controllers/gestion.role.controller');
const auth = require('../auth/auth')

//gestion.role.controller.js

//Attribution d'un rôle à un profil lambda

/* GET users listing. */
// by id 
router.get('/detail', controllerUser.getDetailUser);
// get by email
router.get('/', controllerUser.getUserbyEmail);
//al user  par mag 
router.get('/all', controllerUser.listeUserAll)

// all listeUserAll
router.get('/alluser', auth, controllerUser.listeUserAll)

router.post('/register', controllerUser.register);

router.post('/inscription', controllerUser.inscription);
// select magasin 
router.post('/selectMagasin', controllerUser.selectMagasin);

router.post('/login', controllerUser.login);
//create user
router.post('/registerUser', auth, controllerUser.registerUSer);

// update des users 
router.put('/updateusers', auth, controllerUser.updateUser);
// process de change password
router.put('/resetPassword', controllerUser.RestePassword);
router.put('/updatePassword', controllerUser.updateUserPassword);

// update certificat de scolarité 
router.put('/certificat', controllerUser.updateCertificat);

// update statut compte etudians 
router.put('/updateStatutComptes', auth, controllerUser.updateStatutComptes);
//delete
router.delete('/deleteUser', auth, controllerUser.deleteUser);

router.post('/profileRole', auth, Gestioncontroller.profileRole);
router.post('/UserRole', auth, Gestioncontroller.userRole);


router.post('/verification', Gestioncontroller.getVerfication);

// get all user  profile magasin 
//listeUserProfileMagasinAll
router.get('/listeUserProfileMagasinAll', auth, controllerUser.listeUserProfileMagasinAll)


//changeMag
router.post('/changeMagasin', controllerUser.changeMaga);

// users_statut_renouvelement 
router.post('/changeMagasin', controllerUser.changeMaga);

router.post('/changeStatutCompte', controllerUser.updateStatutCompteRenouvellement);

//new desactiver user
router.post('/deleteUser', controllerUser.deleteUser);

//dejaInscrit
router.post('/dejaInscrit', controllerUser.DejaInscrit)

module.exports = router;

