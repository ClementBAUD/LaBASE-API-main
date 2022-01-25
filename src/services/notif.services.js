const express = require("express");
const { abonnements } = require("../db/sequelize");
const octopush = require('octopush');
const { resultatSMS } = require("../db/requete.admin");

// Pour les SMS
const user_login="communication@boucheries-andre.fr";
const api_key="W2KAlinCNIkftZSq5saTchum3ewLbO41";
const msgText=". Envoie STOP au XXXXX";
const msgOuverture="Vous pouvez dès maintemant réserver vos produits sur votre magasin La B.A.S.E. Envoyer STOP au XXXXX";
const msgRappel="Attention, vous avez une commande à récupérer dans votre magasin La B.A.S.E. Envoyer STOP au XXXXX";

module.exports = {
    updateabonnements,
    deleteAbonnements,
    getAbonnements,
    EnvoiSMS
};

function EnvoiSMS(res, numTel, typeMsg) {
    var sms = new octopush.SMS(user_login,api_key);
    var txt = msgText;
    // console.log("typeMsg :"+typeMsg);
    // console.log("txt (1):"+txt);
    if (typeMsg=="ouverture") { txt = msgOuverture; }
    if (typeMsg=="Rappel") { txt = msgRappel; }
    // Si ce n'est ni une ouverture, ni un rappel, alors on met le texte donné en paramètre suivi du message stop
    if (txt==msgText && typeMsg!="") { txt = typeMsg + msgText; }
    // console.log("txt (2):"+txt);
    sms.set_sms_text(txt);
    sms.set_sms_recipients([numTel], );
    sms.set_sms_type(octopush.constants.sms_low_cost);
    sms.set_sms_sender('La B.A.S.E.');
    sms.set_sms_request_id(sms.uniqid());
    
    sms.send(function(e, r){
        if(e) {
            console.log('Error:', r);
            return res.json({ "statut": false,data: r });

        } else {
            // console.log('Success:', JSON.stringify(r));
            return res.json({ "statut": true, data: r });

        }
    });
}


async function updateabonnements(id, params) {
    const pars = await getAbonnements(id);
     // copy params to magasin and save
     Object.assign(pars, params);
     await pars.save();
 
     return omitHash(pars.get());
}


async function getAbonnements(id) {
    
    const pars = await abonnements.findByPk(id);
    if (!pars) throw "abonnement n'existe pas";
    return pars;
}

async function deleteAbonnements(id) {
    const pars = await getAbonnements(id);
    await pars.destroy();
}

function omitHash(pars) {
    const { hash, ...ParamWithoutHash } = pars;
    return ParamWithoutHash;
}