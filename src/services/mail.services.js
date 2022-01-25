const express = require("express");
const nodemailer = require("nodemailer");
const { User, UserMagasin, Magasin } = require("../db/sequelize");

const mailAdmin = "la-base@boucheries-andre.fr";

function templateMail(title, content) { return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inscription</title>
    <style>
    body{
        font-family: 'Roboto Condensed', sans-serif;
    }

    .wrapper {
        display: grid;
        grid-template-columns: 1fr;
        grid-gap: 10px;
        max-width: 100% !important;
    }

    .item {
        max-width: 500px;
        align-self: center;
        justify-self: center;
        border: 0px;
        border-spacing: 0;
    }
    </style>
</head>
<body>
    <div class="wrapper">
        <table class="item">
        <tr>
            <td style="background-color: black; text-align: center;"><img src="https://labase-ba.fr/assets/128logo.png"></td>
            <td style="background-color: black; text-align: center; color: white;"><h1>${title}</h1></td>
        </tr>
        <tr>
            <td colspan="2" style="text-align: justify;"><p>${content}</p><br></td>
        </tr>
        <tr>
            <td colspan="2" style="text-align: left; background-color: black; color: white; font-style: italic;">La B.A.S.E<br><span style="padding-left: 40px;">Une initiative Boucheries André</span></td>
        </tr>
    </table>
</div>
</body>
</html>`;
}

// Pour un mail de validation de compte
const sujetValidationCompte = "[LaBASE] Validation de compte"
const corpsValidationCompte = "Bonjour, un nouvel utilisateur s'est inscrit sur l'application La B.A.S.E. Une action de votre part est requise pour la validation du compte de %1."
const corpsHTMLValidationCompte = `Bonjour,<br>
Un nouvel utilisateur s'est inscrit sur l'application La B.A.S.E.<br>
Une <u>action de votre part</u> est requise pour la validation du compte de %1.`;
function EnvoiMailValidationCompte(compte) {
    let corps = corpsValidationCompte.replace("%1", compte);
    let corpsHTML = templateMail("Validation requise",corpsHTMLValidationCompte.replace("%1", compte));
    return EnvoiMail(mailAdmin, sujetValidationCompte, corps, corpsHTML);
}

// Pour un mail de création de commande
const sujetCreationCommande = "[LaBASE] Nouvelle commande %2"
const corpsCreationCommande = "Bonjour, une nouvelle commande a été passée sur l'application La B.A.S.E.."
const corpsHTMLCreationCommande = `Bonjour,<br>
Une nouvelle commande a été passée sur l'application La B.A.S.E..<br>
Une <u>action de votre part</u> est requise pour la préparation et la validation de la commande.`;
function EnvoiMailCreationCommande(userID, numCommande, creneau) {
    UserMagasin.findOne({ where: {UserId: userID} }).then(result => {
        let magID = result.MagasinId;
        Magasin.findOne({ where: {id: magID} }).then(result => {
            let mailMag = result.email;
            let titre = "Nouvelle Commande<br>Pour %3".replace("%3", creneau);
            let corps = corpsCreationCommande;
            let corpsHTML = templateMail(titre,corpsHTMLCreationCommande);
            let sujet = sujetCreationCommande.replace("%2", numCommande);
            return EnvoiMail(mailMag, sujet, corps, corpsHTML);
            });
      });
}

// Pour un mail de modification de compte
const sujetCompteModifie = "[LaBASE] %1";
const corpsCompteModifie = "Bonjour, %1.";
function EnvoiMailCompteModifie(destinataire, info) {
    let message;
    let title;
    switch (info) {
        case "valider":
            title = "Compte validé";
            message = "Votre compte a été validé et vous pouvez maintenant bénéficier des services.";
            break;
        case "attente":
            title = "Compte en attente";
            message = "Votre compte n'a pas pu être validé contactez-nous pour plus d'informations ";
            break;
        case "suspendu":
            title = "Compte suspendu";
            message = "Votre compte a été temporairement suspendu, contactez-nous pour plus d'informations.";
            break;
        case "renouvellement":
            title = "Compte à renouveler";
            message = "Votre compte est arrivé à expiration, vous devez renouveler votre certificat de scolarité.";
            break;
                    
        default:
            title = "Compte modifié"
            message = "Oups...";
            break;
    }
    let corps = corpsCompteModifie.replace("%1", message);
    let corpsHTML = templateMail(title,message);
    let sujet = sujetCompteModifie.replace("%1", title);
    return EnvoiMail(destinataire, sujet, corps, corpsHTML);
}

async function EnvoiMail(destinataire, sujet, corps, corpsHTML ) {
    // console.log("mail début");
    // let transporter = nodemailer.createTransport({
    //     host: 'smtp.gmail.com',
    //     service: 'gmail',
    //     secure: false,
    //     auth: {
    //         user: 'labase.etudiant@gmail.com',
    //         pass: 'zicsnonotrwcjmlt',
    //     },
    // });
    let transporter = nodemailer.createTransport({
        host: 'mail.apiba.fr',
        service: 'SMTP',
        secure: true,
        auth: {
            user: 'la-base@apiba.fr',
            pass: '&gA7k7Ura9#i',
        },
    });
    // console.log("mail milieu");
    let info = await transporter.sendMail({
        from: 'la-base@boucheries-andre.fr',
        to: destinataire,
        subject: sujet,
        text: corps,
        html: corpsHTML
    });
    let result = info.response.includes("2.0.0 OK ");
    // console.log("mail fin");
    // console.log(result)
    return result;
}

module.exports = {
    EnvoiMailValidationCompte,
    EnvoiMailCompteModifie,
    EnvoiMailCreationCommande
};