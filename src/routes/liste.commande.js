var express = require('express');
var router = express.Router();
const controllerCommande = require('../controllers/liste.commande.controller');

const auth = require('../auth/auth')



router.get('/magasin-jour', auth, controllerCommande.getListeCommandeJourMagasin)
router.get('/magasin-jour-statut', auth, controllerCommande.getListeCommandeJourMagasinparStatut)
router.get('/magasin-jour-statut-date', auth, controllerCommande.getListeCommandeFiltrstatutDate)
router.get('/magasin-commande', auth, controllerCommande.getListeCommandeLast)
router.get('/magasin-commande-non-recup', auth, controllerCommande.getListeCommandeNonRecup)


router.get('/users-jour', auth, controllerCommande.getListeCommandeUserJour)
router.get('/users-statut', auth, controllerCommande.getListeCommandeUsers)

router.get('/detail-commande', auth, controllerCommande.detailcommandes)


router.get('/nombre-etudiant-magasin', auth, controllerCommande.NbEtuMag)
router.get('/nombre-commande-magasin', auth, controllerCommande.NbCommande)
router.get('/nombre-commande-non-recup-magasin', auth, controllerCommande.NbCommandeNonRecup)
router.get('/nombre-produit-magasin', auth, controllerCommande.NbProducommande)

router.get('/nombre-commande-Encours-jour', auth, controllerCommande.NbCommandeEncours)
router.get('/nombre-commande-magasin-jour', auth, controllerCommande.NbCommandeDay)
router.get('/nombre-produit-magasin-jour', auth, controllerCommande.NbProducommanDay)
router.get('/nombre-commande-non-recup-jour', auth, controllerCommande.NbCommandeNonRecupday)

router.get('/nombre-commande-non-recup-mag', auth, controllerCommande.getListeCommandeNonRecupMAg)

//commande admin 
router.get('/liste-commande-magasin', auth, controllerCommande.getListeCommandeLast)
//getListeCommandeLastUser
router.get('/liste-commande-magasin-users', auth, controllerCommande.getListeCommandeLastUser)

router.get('/nombre-etudiant', auth, controllerCommande.nbreEtudiantAll)
router.get('/nombre-etudiant-statut', auth, controllerCommande.nbreEtudiantEnAttent)

router.get('/nombre-commande', auth, controllerCommande.NombreCommandeAdmin)
router.get('/nombre-produit', auth, controllerCommande.NombreProdAdmin)
router.get('/nombre-commande-nonrecup', auth, controllerCommande.ListeCommandeNonRecup)

//ListeCommandeNonRecup
router.get('/graph-dernier-mois', auth, controllerCommande.ListeCommandeGraph)

router.get('/nombre_commande_user', auth, controllerCommande.getnbreComDayByUSer)

//users commande

router.get('/liste-commande', auth, controllerCommande.getListeCommandeLastUser)
router.get('/liste-commande-non-recup', auth, controllerCommande.getListeCommandeNonRecup)

module.exports = router;