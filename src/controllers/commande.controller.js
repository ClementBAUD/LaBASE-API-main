/**
 * Gestion des commandes
 * creation modofication
 * affichage des commandes par rapport au status
 */
const express = require("express");
const crypto = require("crypto");
const router = express.Router();
const { User } = require("../db/sequelize");
const { MiseADispo } = require("../db/sequelize");
const { statutCommande } = require("../db/sequelize");
const { commande, user } = require("../db/sequelize");
const { ligneCommande } = require("../db/sequelize");
const { Recup } = require("../db/requete");
const commandeService = require("../services/commande.services");
const ligneCommandeService = require("../services/lignecommande.services");
const MisADispo = require("../services/MisADispo.services");
const { EnvoiMailCreationCommande } = require("../services/mail.services");
const { table } = require("console");

/**
 * méthode de création des commandes
 */

// pour creation de la commande 
exports.create_Commande = async (req, res) => {
    if (!req.body.heureRecuperation || !req.body.userId) {
        return res.status(400).json({
            message: "Erreur. Veuillez remplir tous les champs obligatoires creation commande ",
        });
    }
    let codeG = crypto.randomBytes(2).toString("hex");
    // TODO : créer un n° de commande "Magasin(2)-ID(8)"
    let code = "LABASE-" + codeG;

    statutCommande.findAll({
        where: { nom: "En cours" },
        attributes: { exclude: ["createdAt", "updatedAt"] },
    })
        .then((respos) => {
            if (!respos) {
                const message = `Oups! un problème a été détecté.`;
                return res.status(404).json({ statut: false, message });
            }
            const dataCom = {
                statutcommandeId: respos[0].id,
                userId: parseInt(req.body.userId),
                NumCom: code,
                heureRecuperation: req.body.heureRecuperation,
            };
            commande.create(dataCom)
                .then((Datas) => {
                    const message = "Votre commande a été crée.";
                    // Recherche de l'utilisateur
                    // user.findOne() ???
                    // user.findByPk(Datas.userId).then(result => {
                    //     // console.log("UserMagasin:"+result.magasinId);
                    EnvoiMailCreationCommande(Datas.userId, code, dataCom.heureRecuperation);
                    // })

                    res.json({ statut: true, Data: Datas, message });
                })
                .catch((error) => {
                    const message =
                        "un problème a été détecté lors de la création de votre commande. Réessayez dans quelques instants Svp";
                    res.status(500).json({ statut: false, message, error: error });
                });

        })
        .catch((error) => {
            const message = `La commande n'a pas pu être créé car une erreur une a été déclenchée`;
            res.json({ statut: false, message, error });
        });
};



exports.create_TabLignecommande = async (req, res) => {
    let Tableo = new Array()
    Tableo = req.body.tab
    let NumCommande = parseInt(req.body.NumCommande)//On Recupère le num commande
    let bPretAEnregistrer = true;//Initialisation du booléen
    const Dispo = {
        quantiteActuel: 0, //Initialise a 0
    };
///////////////////////////////////////////////////
//Vérification Taille des données non vide et présence d'un numéro de commande.
    if (Tableo.length == 0 || isNaN(NumCommande)) { //
        return res.status(400).json({
            message: "Erreur. Veuillez remplir tous les champs obligatoires tableau ",
        });
    } 
    ///////////////////////////////////////////////////
    else {
        let i = 0;
        while (i < Tableo.length && bPretAEnregistrer) {
            let element = Tableo[i]
            ///////////////////////////////////////////////////
            const tabligneCommandes = {
                quantite: element.Quantite,//Permet de recuperer la quanttite du produit
                miseadispoId: element.id_prodDispo, //Permet de recuperer l'id du produit
                commandeId: NumCommande, //permet de recuperer le num commande
            };
            ///////////////////////////////////////////////////
            let id = parseInt(tabligneCommandes.miseadispoId)
            ///////////////////////////////////////////////////
            let qt = element.quantiteActuel
            // Vérification si QteACommander <= Stock Dispo
            if (tabligneCommandes.quantite <= qt) {// La quantité est bonne
                //bPretAEnregistrer = true;
            } else { //Quantité pas bonne
                if (tabligneCommandes.quantite > qt) {//On verfie quel produit est en quantité faible
                    bPretAEnregistrer = false;//On passe le booléen à false pour éviter la suite de l'execution
                    const message = `La quantitée du produit ${element.libelle} demandée est supérieure à la quantitée restante`;// On affiche le message pour l'utilisaeur
                    await commandeService.deleteCommand(tabligneCommandes.commandeId)//Supression commande
                        .then(async (Datas) => {
                            await res.status(500).json({ statut: false, message });
                        })
                        .catch((error) => {
                            const message = "la commande n'a pas pu être supprimé.";
                            res.status(500).json({ statut: false, message, error: error });
                        });
                }
            }
            i++; //On incrémente pour parcourir le tableau
        }
    }
///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////
    if (bPretAEnregistrer) {
        Tableo.forEach(async element => {
            const ligneCommandes = {
                quantite: element.Quantite,
                miseadispoId: element.id_prodDispo,
                commandeId: NumCommande,
            };
            let idProduit = element.id_prodDispo;
            await MisADispo.getProduitDispo(idProduit)
                .then(async(data) => {
                    let quantActuel = data.quantiteActuel; 
                    let quantPris = ligneCommandes.quantite;
                    let quantApresCommande = quantActuel - quantPris;
                    let paramsQuant = {quantiteActuel:quantApresCommande}
                    await MisADispo.updateProduitDispo(idProduit, paramsQuant)
                        .then(async(datamisea) => {
                            ligneCommande
                                .create(ligneCommandes)
                                .then((Data) => {
                                    const message = "Votre commande a été transmise.";
                                    res.json({ statut: true, message });
                                })
                                .catch((error) => {
                                    const message = "La ligne de commande n'a pas pu être créée.";
                                });
                        })
                        .catch((error) => {
                            const message = "Impossible d'enregistrer la commande car le stock n'a pas pu être mis à jour.";
                            res.status(500).json({ statut: false, message, error });
                        });
                })
                .catch((error) => {
                    const message = "Impossible d'enregistrer la commande car le stock n'a pas pu être récupérée.";
                    res.status(500).json({ statut: false, message, error });
                });
        })
    } 
}

exports.update_Commande = async (req, res) => {
    //|| !req.body.userId
    if (!req.body.id || !req.body.statutcommandeId) {
        return res.status(400).json({
            message: "Erreur. Merci de remplir tous les champs obligatoires ",
        });
    }
    id = parseInt(req.body.id);
    userId = parseInt(req.body.userId);
    const dataCom = {
        statutcommandeId: req.body.statutcommandeId,
    };
    /*     Recup(userId, "commande", "PUT")
            .then((resultat) => {
                if (resultat[0].res > 0) { */
    commandeService
        .updatecommandes(id, dataCom)
        .then((Datas) => {
            const message = "Le statut de la commande à été modifié .";
            res.json({ statut: true, Data: Datas, message });
        })
        .catch((error) => {
            const message = "Le statut de la commande n'a pas pu être modifié.";
            res.status(500).json({ statut: false, message, error: error });
        });
    /* } else {
                let resul = { statut: false, message: "Action non autorisée." };
                return res.status(500).json({ resul });
            }
        })
        .catch((error) => {
            return res
                .status(403)
                .json({
                    statut: false,
                    message: "champs manquants dans votre requête ",
                    verification: "Champs verification manquant",
                    error,
                });
        }); */
};

exports.delete_commande = async (req, res) => {
    if (!req.body.idcommande) {
        return res.status(400).json({
            message: "Erreur. Merci de remplir tous les champs obligatoires ",
        });
    }
    let id = parseInt(req.body.idcommande);
    commandeService.deleteCommand(id)
        .then((Datas) => {
            const message = "la commande  à été supprimé .";
            res.json({ statut: true, Data: Datas, message });
        })
        .catch((error) => {
            const message = "la commande n'a pas pu être supprimé.";
            res.status(500).json({ statut: false, message, error: error });
        });


}

exports.info_commande = async (req, res) => {
    if (!req.query.idcommade) {
        return res.status(400).json({
            message: "Erreur. Merci de remplir tous les champs obligatoires ",
        });
    }
    let id = parseInt(req.query.idcommade);
    commande.findAll({
        where: { id: id },
        exclude: ["createdAt", "updatedAt", "user.certi_scolarite", "user.password", "user.certi_scolarite", "user.statutcomptId", "user.profilId", "user.createdAt", "user.updatedAt"],
        include: ["user", "statutcommande"],
    })
        .then((respos) => {
            // console.log(respos)
            if (!respos) {
                const message = `Oups! un problème a été détecté.`;
                return res.status(404).json({ statut: false, message });
            }
            const message = "La commande récupéré .";
            return res.json({ statut: true, Data: respos, message });
        })
        .catch((error) => {
            const message = `La commande n'a pas pu être récupéré car une erreur une a été déclenchée`;
            res.json({ statut: false, message, error });
        });


}
/**
 *  liste des differents statuts  de commande 
 */
exports.status_commande = async (req, res) => {
    statutCommande.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
    }).then((Datas) => {
        const message = "La liste de toute les statut commande.";
        res.json({ statut: true, Data: Datas, message });
    }).catch((error) => {
        const message = "aucune liste.";
        res.status(500).json({ statut: false, message, error: error });
    });
}
