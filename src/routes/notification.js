var express = require('express');
const nodemailer = require("nodemailer");
const path = require('path');
var router = express.Router();
const controllerNotification = require('../controllers/notif.controller');
const userController = require('../controllers/users.controller');
const auth = require('../auth/auth')
const { notification } = require('../models/notification.model');
const { abonnements } =  require("../db/sequelize");
const { EnvoiMailValidationCompte, EnvoiMailCompteModifie, EnvoiMailCreationCommande } = require("../services/mail.services");
const SERVER_KEY = "AAAAS4GAsXg:APA91bFsgAqJkToQVbSaKS5gA7i1yDDLCfneyfgBXCIeQr7D0qG3UOhF6SvPjhoGFnWrTFlF0QOFqvyPOcwxH67Yz3Hi0i-Rb3ESwYKIo2lfUOm6A30HHy_pqlgJ6Ui9uA-YpPkVu5k9"; 
// const SERVER_KEY = "AAAABibVGyE:APA91bGMmxm1TCZhACITMfb1Cc1cOcZLmS8tJDM3YGEer8P22lpRwIS4PbyNmllXz5ji6eV1DxzKk5OUPCi2rnyEM4zB4eTuETPkjD8wCOvWRFMevGrW19JPbBtHu4eUDATDCZQsM7Yl"; 
const FCM = require("fcm-node");
const notif = require("../services/notif.services");

// const client = require('twilio')('AC3946280a985a8f75096e6d4ec1ebe74e', 'eb14cc72c160e1021e1adccf80dff02e');

var octopush = require('octopush');
const {
    resultatSMS
} = require("../db/requete.admin");

//listeTelUse
const hbs = require('nodemailer-handlebars');

//const pas= require("../../utils/");

//router.get('/users', controllerNotification.getnotificationById);

//router.get('/', controllerNotification.getAllnotification);

//router.post('/creates', controllerNotification.addcreatNotif)

router.post('/testMail', async function(req, res, next) {
    EnvoiMailValidationCompte("Jean Dupont");
    return res.json({ "statut": true, message: "Test de mail" });
});

router.post('/testMail/creationCde', async function(req, res, next) {
    // let lstMail = userController.listeMailsAdmin();
    // console.log(lstMail);
    // EnvoiMailCreationCommande(lstMail,"dev@boucheries-andre.fr","CDE 01-02-0554211", "17:00 - 18:00");
    return res.json({ "statut": true, message: "Test de mail" });
});

router.post('/update', async function(req, res, next) {
    // const statut = req.body.statut;
    // const idUser = req.body.userId;

    // /*  let user = new notification({
    //      userId: idUser,
    //      sub:abonnement,
    //      idMag:idMag,
    //      statut:statut
    //  }) */

    // await notification.updateOne({
    //     userId: idUser
    // }, {
    //     statut: statut
    // });
    // if (!notification) {
    //     return res.status(400).send('utilisateur ne peut pas être créé !')
    // }
    // return res.json({ "statut": true, Data: notification });
    return res.json({ "statut": true, message: "ne plus utiliser" });
});


// ********************************
// Envoyer une notification
// ********************************

router.post('/send', async function(req, res, next) {

    // if (!req.body.userId || !req.body.titre || !req.body.info) {
    //     return res.status(400).json({ message: 'Erreur. Merci de remplir tous les champs obligatoires ' })
    // }
    // titre = req.body.titre
    // test = req.body.info
    // console.log(titre)
    // const payload = JSON.stringify({
    //     notification: {
    //         title: titre,
    //         body: test,
    //         icon: 'https://files.axelib.io/apps/6lQwueo/0_1625647153.png',
    //         vibrate: [100, 50, 100],
    //         data: {
    //             url: 'https://medium.com/@arjenbrandenburgh/angulars-pwa-swpush-and-swupdate-15a7e5c154ac'
    //         }
    //     }
    // });


    // //  const userID = req.query.id;
    // const notif = await notification.find({ userId: req.body.userId });
    // if (!notif) {
    //     res.status(500).json({ "statut": false, message: `l'utilisateur avec l'ID donné n'a pas été trouvé.` })
    // }

    // notif.forEach(element => {
    //     //console.log(element.sub)
    //     webPush.setVapidDetails('mailto:titi@toto.com', publicKey, privateKey);
    //     webPush.sendNotification(element.sub, payload);
    //     let message = "Notification envoyée à l'utilisateur :";
    //     return res.json({ "statut": true, message: message });
    // });
    return res.json({ "statut": true, message: "ne plus utiliser" });
});


// ********************************
// Envoyer une notification
// ********************************

router.post('/sendUser', async function(req, res, next) {
    //userId
    // if (!req.body.userId || !req.body.titre || !req.body.info) {
    //     return res.status(400).json({ message: 'Erreur. Merci de remplir tous les champs obligatoires ' })
    // }
    // titre = req.body.titre
    // test = req.body.info
    // url = req.body.link
    // console.log(url)
    // const payload = JSON.stringify({
    //     notification: {
    //         title: titre,
    //         body: test,
    //         icon: 'https://files.axelib.io/apps/6lQwueo/0_1625648206.png',
    //         vibrate: [100, 50, 100],
    //         data: {
    //             url: url
    //         }
    //     }
    // });


    // //  const userID = req.query.id;
    // const notif = await notification.find({ userId: req.body.userId });
    // if (!notif) {
    //     res.status(500).json({ "statut": false, message: `l'utilisateur avec l'ID donné n'a pas été trouvé.` })
    // }
    // //console.log(notif.sub)
    // //return res.json({ "statut": true, message:"message" });

    // notif.forEach(element => {
    //     //console.log(element.sub)
    //     webPush.setVapidDetails('mailto:titi@toto.com', publicKey, privateKey);
    //     webPush.sendNotification(element.sub, payload);
    //     let message = "Notification envoyée à l'utilisateur :";
    //     return res.json({ "statut": true, message: message });
    // });
    return res.json({ "statut": true, message: "ne plus utiliser" });
});
// ********************************
// Envoyer notification aux users d'un magasin
// ********************************

router.post('/sendAll', async function(req, res, next) {


    // if (!req.body.idMag || !req.body.titre || !req.body.info) {
    //     return res.status(400).json({ message: 'Erreur. Merci de remplir tous les champs obligatoires ' })
    // }
    // titre = req.body.titre
    // test = req.body.info
    // url = req.body.link
    // statut = req.body.statut
    // url = req.body.link
    // console.log(url)

    // const payload = JSON.stringify({
    //     notification: {
    //         title: titre,
    //         body: test,
    //         icon: 'https://files.axelib.io/apps/6lQwueo/0_1625647153.png',
    //         vibrate: [100, 50, 100],
    //         data: {
    //             url: url
    //         }
    //     }
    // });


    // //  const userID = req.query.id;
    // const notif = await notification.find({ statut: statut, idMag: req.body.idMag });
    // if (!notif) {
    //     res.status(500).json({ "statut": false, message: `l'utilisateur avec l'ID donné n'a pas été trouvé.` })
    // }
    // if (notif.length > 0) {
    //     notif.forEach(element => {
    //         //
    //         webPush.setVapidDetails('mailto:titi@toto.com', publicKey, privateKey);
    //         webPush.sendNotification(element.sub, payload);
    //         let message = "Notification envoyée à l'utilisateur :";
    //         return res.json({ "statut": true, message: message });
    //     });
    // } else {
    //     let message = "aucun utilisateur n'a reçu la notification";
    //     return res.json({ "statut": true, message: message });
    // }
    return res.json({ "statut": true, message: "ne plus utiliser" });
});


/**
 * MYSQL
 */

router.post('/notification-user',async function(req, res, next) {
    // console.log("Passage 1");
    // console.log(req.body.userId);
    // console.log(req.body.titre);
    if (!req.body.userId  || !req.body.titre  || !req.body.corps  ) {
        return res.status(400).json({
            message: "Erreur. Merci de remplir tous les champs obligatoires ",
        });
    }

    // console.log("Chargements des abonnements");
    const project = await abonnements.findAndCountAll({ where: { userId: req.body.userId } });
    if (!project) {
        res.json({ "statut": false, message: `l'utilisateur avec l'ID donné n'a pas été trouvé.` })
    }

    // console.log(project['rows']);
    project['rows'].forEach(element => {
        console.log("notif:" + element.notif);
        if (element.notif == 'Notification Mail') {
            let fcm = new FCM(SERVER_KEY)
            let message = {
                "to": element.sub,
                "notification": {
                    "sound": "default",
                    "icon": 'https://labase-ba.fr/assets/96x96.png',
                    "body": req.body.corps,
                    "title": req.body.titre,
                    "content_available": true,
                    "priority": "high",
                    "click_action": "home"
                }
            }
            console.log("Envoi Notif vers:"+element.sub);
            fcm.send(message, (err, response) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ "statut": false, message: `la notification n'a pas été transmise`, err })
                } else {
                    // console.log(response);
                    return;
                    // return res.json({ statut: true, data: response });
                }
            })
        }
        if (element.notif == 'SMS') {
            console.log("Envoi SMS vers:"+element.tel);
            console.log(req.body.corps);
            notif.EnvoiSMS(res, element.tel,req.body.corps);
            // client.messages.create({
            //     body: 'req.body.corps',
            //     to: '+33788933380',
            //     from: '+12345678901'
            // }).then(message => console.log(message))
            //     // here you can implement your fallback code
            //     .catch(error => console.log(error))
        }
    });
})

router.post('/notification-all',auth,async function(req, res, next) {
    
    // console.log("Passage dans notification-all");

    if (!req.body.idMag  || !req.body.statut || !req.body.titre  || !req.body.corps  ) {
        return res.status(400).json({
            message: "Erreur. Merci de remplir tous les champs obligatoires ",
        });
    }

    const project = await abonnements.findAndCountAll({ where: { statut:  req.body.statut, idMag: req.body.idMag, notif:'Notification Mail'   } });
    if (project['count']==0) {
        return res.json({ "statut": false, message: `l'utilisateur avec l'ID donné n'a pas été trouvé.` })
    }

   //
   try {
    let fcm = new FCM(SERVER_KEY)

    project['rows'].forEach(element => {
        
         let message={
             "to":element.sub,
              "notification" : {
               "sound" : "default",
               "icon": 'https://labase-ba.fr/assets/96x96.png',
               "body" : req.body.corps,
               "title" : req.body.titre ,
               "content_available" : true,
               "priority" : "high",
               "click_action":"home"
              }
             }
        //  console.log(element.sub);
         fcm.send(message,(err,resultat)=>{
             if (err) {
                 next(err);
             } else {
                // console.log(resultat);
                return;
                // return res.end(resultat);
                //  return res.json({ "statut": true, message: `notif ok` });
             }
         })

         return res.json({ "statut": true, message: `notif ok` });
     }); 
   } catch (error) {
    next(error);
   }
   
})


router.post('/notification-verif',auth,controllerNotification.verifierNotif)

router.post('/notificationCreate',auth,controllerNotification.createNotif)

router.post('/notification-update',controllerNotification.updateNotif)

router.post('/notification-delete',auth,controllerNotification.deleteAbonnement)

// ********************************
// Envoyer un mail
// ********************************

router.post('/mail', async function(req, res, next) {
    //userId
    if (!req.body.message || !req.body.receiverEmail) {

        return res.status(400).json({ message: 'Erreur. Merci de remplir tous les champs obligatoires ' })
    }

    /**
     * changement de methode 
     */


    // Envoi d'un mail à l'étudiant
    let resultMail = EnvoiMailCompteModifie(req.body.receiverEmail, req.body.message);
    const message = resultMail ? "Validation de l'inscription. " : "Echec de l'envoi de mail.";
    let resARenvoyer = resultMail ? true : false;
    return res.json({ statut: resARenvoyer, data: userresult, message: message });
});


router.post('/mail-all',auth,async function(req, res, next) {
    
    return res.json({ statut: true, data: [], message: "Ne plus utiliser" });
})

router.post('/sms', async function(req, res, next) {
    //userId
    if (!req.body.message || !req.body.receiverTel ) {
        return res.status(400).json({ message: 'Erreur. Merci de remplir tous les champs obligatoires ' })
    }

    notif.EnvoiSMS(res, req.body.receiverTel,req.body.message);
    
    // let user_login="communication@boucheries-andre.fr"
    // let api_key="W2KAlinCNIkftZSq5saTchum3ewLbO41"
    // let text="envoie STOP au STOP au XXXXX"
    // if (req.body.message=="ouverture") {
    //     text ="Vous pouvez dès maintenant réserver vos produits sur votre magasin La B.A.S.E. Envoyer STOP au XXXXX"
    // }
    // if (req.body.message=="Rappel") {
    //     text ='Attention, vous avez une commande à récupérer dans votre magasin La B.A.S.E. avant '+req.body.fermeture+'. Envoyer STOP au XXXXX'
    // }
    // var sms = new octopush.SMS(user_login,api_key);
    // sms.set_sms_text(text);
    // sms.set_sms_recipients([req.body.receiverTel], );
    // sms.set_sms_type(octopush.constants.sms_low_cost);
    // sms.set_sms_sender('La B.A.S.E.');
    // sms.set_sms_request_id(sms.uniqid());
    
    // sms.send(function(e, r){
    //     if(e) {
    //         console.log('Error:', r);
    //         return res.json({ "statut": false,data: r });

    //     } else {
    //         // console.log('Success:', JSON.stringify(r));
    //         return res.json({ "statut": true, data: r });

    //     }
    // });
    

});

/// 
router.post('/sms-all', async function(req, res, next) {


    if (!req.body.idMag  || !req.body.statut || !req.body.message   ) {
        return res.status(400).json({
            message: "Erreur. Merci de remplir tous les champs obligatoires ",
        });
    }

    const project = await abonnements.findAndCountAll({ where: { statut:  req.body.statut, idMag: req.body.idMag, notif:'SMS' } });

    if (project['count']==0) {
        let message ="Aucun sms n'a été transmis "
            return res.json({ "statut": true, message:message });
    }

    let user_login="communication@boucheries-andre.fr"
    let api_key="W2KAlinCNIkftZSq5saTchum3ewLbO41"
    let text="envoie STOP au XXXXX"

    if (req.body.message=="ouverture") {
        text ="Vous pouvez dès maintenant réserver vos produits sur votre magasin La B.A.S.E. labase-ba.fr. Envoyer STOP au XXXXX"
    }
    if (req.body.message=="Rappel") {
        text ='Attention, vous avez une commande à récupérer dans votre magasin La B.A.S.E. labase-ba.fr avant '+req.body.fermeture+'. Envoyer STOP au XXXXX'
    }

    if (project['count']>0) {

        project['rows'].forEach(element => {
            // console.log("KO 2");
            var sms = new octopush.SMS(user_login,api_key);
                sms.set_sms_text(text);
                sms.set_sms_recipients([element.tel], );
                sms.set_sms_type(octopush.constants.sms_low_cost);
                sms.set_sms_sender('La B.A.S.E.');
                sms.set_sms_request_id(sms.uniqid());
                
                sms.send(function(e, r){
                    if(e) {
                        // console.log('Error:', r);
                        let message ="Aucun sms n'a été transmis "
                        return res.json({ "statut": false,data: r ,message:message});
             
                    } else {
                        let message ="sms transmis "
    
                        // console.log('Success:', JSON.stringify(r));
                        return res.json({ "statut": true, data: r,message:message });
             
                    }
                });
        
        })  
    }

}); 

module.exports = router;