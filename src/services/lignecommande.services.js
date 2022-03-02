const express = require("express");
const { ligneCommande } = require("../db/sequelize");
const { QuantiteProduit } = require("../db/requete");
const commandeService = require("../services/commande.services");


module.exports = {
    getAllLigneCommande,
    updatligneCommande,
    createligneCommand,
    getligneCommand,
    deleteligneCommand,
    verifTableau_NumCommande,
    verifQuantCommande
};

async function getAllLigneCommande() {
    return await ligneCommande.findAll();
}


async function updatligneCommande(id, params) {
    const commande = await getligneCommand(id);

    // copy params to magasin and save
    Object.assign(commande, params);
    await commande.save();

    return omitHash(commande.get());
}


async function createligneCommand(params) {
    // copy params to magasin and save
   
    Object.assign(ligneCommande, params);
    await ligneCommande.save();
   
    return omitHash(ligneCommande.get());
}



async function deleteligneCommand(id) {
    const commande = await getligneCommand(id);
    await commande.destroy();
}

// helper functions

async function getligneCommand(id) {
    const commande = await ligneCommande.findByPk(id);
    if (!commande) throw 'magasin not found';
    return commande;
}



function omitHash(commande) {
    const { hash, ...commandeWithoutHash } = commande;
    return commandeWithoutHash;
}


//fonction verification ligne commande
function verifTableau_NumCommande (req, res,next)  {
let Tableo = new Array()
Tableo = req.body.tab
let NumCommande = parseInt(req.body.NumCommande)//On Recupère le num commande
////////////////////////////////////////////////
if(Tableo == undefined || NumCommande == undefined) {
    res.status(400).json({
        message: "Probleme tableau ou commande."
    }); 
}else{
    if (Tableo.length == 0 || isNaN(NumCommande)) { //
        return res.status(400).json({
            message: "Erreur. Veuillez remplir tous les champs obligatoires tableau ",
        });
    }else {
        next();
        return;
    }}    
}



async function verifQuantCommande (req, res,next)  {
 let Tableo = new Array()
 Tableo = req.body.tab
 //console.log("Tab",Tableo)
 let NumCommande = parseInt(req.body.NumCommande)//On Recupère le num commande
 let bPretAEnregistrer = true;//Initialisation du booléen
 let i = 0;
/////////////////////////////////////////////////////
 while (i < Tableo.length) {
    let element = Tableo[i]
    ///////////////////////////////////////////////////
    const tabligneCommandes = {
        quantite: element.Quantite,//Permet de recuperer la quanttite du produit
        miseadispoId: element.id_prodDispo, //Permet de recuperer l'id du produit
        commandeId: NumCommande, //permet de recuperer le num commande
    };
    ///////////////////////////////////////////////////
    let nomProd = element.libelle
    let IdProdPanier = element.id_prodDispo
    let quantActuel

    await QuantiteProduit(IdProdPanier).then(element => {
    quantActuel = element[0].quantiteProd

    if (tabligneCommandes.quantite <= quantActuel) {// La quantité est bonne
        //bPretAEnregistrer = true
    }else { //Quantité pas bonne
        if (tabligneCommandes.quantite > quantActuel) {//On verfie quel produit est en quantité faible
            bPretAEnregistrer = false;//On passe le booléen à false pour éviter la suite de l'execution
            commandeService.deleteCommand(tabligneCommandes.commandeId)//Supression commande
            .then((error) => {
                const message = `Le produit  ${nomProd} n'a pas pu être ajouté à votre panier.
                Quantité maximale atteinte pour cet article.
                `;// On affiche le message pour l'utilisaeur
                res.status(500).json({ statut: false, message, error: error });
                /*
                res.toastr.error(
                    `La quantitée du produit ${nomProd} demandée est supérieure à la quantitée restante`
                );*/


            })
            /*
            .catch((error) => {
                const message = "La commande n'a pas pu être supprimé.";
                res.status(500).json({ statut: false, message, error: error });
            });    */
        }
    }

})

    i++; //On incrémente pour parcourir le tableau
 }
//Partie pour bloquer ou next la method
if(bPretAEnregistrer == undefined || Tableo == undefined) {
    res.status(400).json({
        message: "Il y a un probleme avec la taille du tableau ou le numéro de commande."
    }); 
    }else if (bPretAEnregistrer == false) {
        //on bloque
    }
    else {
    next();
    return;        
    }
}

