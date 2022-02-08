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
                    console.log("Datas.id:" + Datas.id);
                    console.log("Datas.userId:" + Datas.userId);
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





/*

exports.create_TabLignecommande2 = async (req, res) => {
    //console.log(req.body)
    let Tableo = new Array()
    Tableo = req.body.tab
    console.log("print tab")
    console.log(Tableo)
    let NumCommande = parseInt(req.body.NumCommande)
    console.log("Numéro Commande")
    console.log(NumCommande)
    console.log("taille tableau")
    console.log(Tableo.length)

    if (Tableo.length == 0 || isNaN(NumCommande)) { //
        return res.status(400).json({
            message: "Erreur. Veuillez remplir tous les champs obligatoires tableau ",
        });
    } else {
        console.log("Tableau okay")

        Tableo.forEach(async element => {
            ///////////////////////////////////////////////////
            const tabligneCommandes = {
                quantite: element.Quantite,
                miseadispoId: element.id_prodDispo,
                commandeId: NumCommande,
            };
            ///////////////////////////////////////////////////
            console.log("tab élément")
            console.log(tabligneCommandes)
            ///////////////////////////////////////////////////
            const Dispo = {
                quantiteActuel: 0, //Initialise a 0
            };
            //////////////////////////////////////////////////////
            let id = parseInt(tabligneCommandes.miseadispoId)
            ///////////////////////////////////////////////////
            console.log("id")
            console.log(id)
            ///////////////////////////////////////////////////
            console.log("MisADispo")
            console.log("////////")
            ///////////////////////////////////////////////////


            //process.on('unhandledRejection', (reason, p) => {
            //  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
            // application specific logging, throwing an error, or other logic here


            MisADispo.getProduitDispo(id)
                .then(async (data) => {
                    let qt = data.quantiteActuel; //data.dataValues.quantiteActuel;
                    console.log("quantité actuel du produit")
                    console.log(qt)
                    console.log("quantité commandé")
                    console.log(tabligneCommandes.quantite)
                    ///////////////////////////////////////////////////
                    if (qt >= parseInt(tabligneCommandes.quantite)) {
                        let qti = parseInt(qt) - parseInt(tabligneCommandes.quantite);
                        console.log("quantité actuel du produit apres la commande", qti)
                        Dispo.quantiteActuel = qti;
                        console.log(id, Dispo.quantiteActuel)
                        console.log(Dispo)
                        ///////////////////////////////////////////////////                            
                        await MisADispo.updateProduitDispo(id, Dispo)
                            .then(async (datamisea) => {
                                await ligneCommande
                                    .create(tabligneCommandes)
                                    .then((Data) => {
                                        const message = "Votre commande a été transmise.";
                                        res.json({ statut: true, message });
                                    })
                                    .catch((error) => {
                                        const message = `un problème est survenu lors de la création de votre commande.`;
                                        res
                                            .status(500)
                                            .json({ statut: false, message, error: error });
                                    });
                            })
                            .catch((error) => {
                                const message = `problème pendant le processus de modification des quantité. Réessayez dans quelques instants svp.`;
                                res.status(500).json({ statut: false, message, error });
                            });
                    } else {
                        console.log(`La quantitée du produit ${data.dataValues.libelle} demandée est supérieure à la quantitée restante`)
                        const message = `La quantitée du produit ${data.dataValues.libelle} demandée est supérieure à la quantitée restante`;
                        await commandeService.deleteCommand(tabligneCommandes.commandeId)
                            .then(async (Datas) => {
                                await res.status(500).json({ statut: false, message });
                            })
                            .catch((error) => {
                                const message = "la commande n'a pas pu être supprimé.";
                                res.status(500).json({ statut: false, message, error: error });
                            });
                    }
                })
                .catch((error) => {
                    const message = `problème pendant le processus de commande. Réessayez dans quelques instants svp.`;
                    res.status(500).json({ statut: false, message, error });
                });
            //.then(Promise.resolve());
        })

    }
};

/*

// gestion des commandes avec les produits 
exports.create_Lignecommande = async (req, res) => {
    if (!req.body.quantite || !req.body.MiseADispoId || !req.body.commandeId) {
        return res.status(400).json({
            message: "Erreur. Veuillez remplir tous les champs obligatoires old ",
        });
    }


//////////////////////////////////////////////////////
    const ligneCommandes = {
        quantite: req.body.quantite,
        miseadispoId: req.body.MiseADispoId,
        commandeId: req.body.commandeId,
    };

    const tabligneCommandes = {
        tab: req.body.tab
    };


//////////////////////////////////////////////////////
    const Dispo = {
        quantiteActuel: 0, //Initialise a 0
    };
//////////////////////////////////////////////////////
    let id = parseInt(req.body.MiseADispoId)
//////////////////////////////////////////////////////
    MisADispo.getProduitDispo(id)
        .then((data) => {
            let qt = data.dataValues.quantiteActuel;
            console.log("quantité actuel du produit",qt)
                    if (qt >= parseInt(tabligneCommandes.quantite)) {
                        let qti = parseInt(qt) - parseInt(tabligneCommandes.quantite);
                        console.log("quantité actuel du produit apres la commande", qti)
                        if (qti <= 0) {
                            console.log("quantité actuelle est inferieure à zero")
                        }
                Dispo.quantiteActuel = qti;
                MisADispo.updateProduitDispo(id, Dispo)
                    .then((datamisea) => {
                        // console.log(datamisea)
                        ligneCommande
                            .create(ligneCommandes)
                            .then((Data) => {
                                const message = "Votre commande a été transmise.";
                                res.json({ statut: true, message });
                                //console.info("qt : " +qt)
                                //console.info("qti : "+ qti)
                            })
                            .catch((error) => {
                            const message = `un problème est survenu lors de la création de votre commande.`;
                            res
                                .status(500)
                                .json({ statut: false, message, error: error });
                        });

                })
                .catch((error) => {
                    const message = `problème pendant le processus de modification des quantité. Réessayez dans quelques instants svp.`;
                    res.status(500).json({ statut: false, message, error });
                })
                    //zone probleme
              }
              
    else {
      const message =`La quantité du produit ${data.dataValues.libelle} demandée est supérieure à la quantité restante`;
        commandeService.deleteCommand(tabligneCommandes.commandeId)
          .then((Datas) => {
            res.status(400).json({ statut: false, message });
          })
          .catch((error) => {
            const message = "la commande n'a pas pu être supprimé.";
            res.status(500).json({ statut: false, message, error: error });
          });
    }
        })
        .catch((error) => {
            const message = `problème pendant le processus de commande. Réessayez dans quelques instants svp.`;
            res.status(500).json({ statut: false, message, error });
        });
};
*/



exports.create_TabLignecommande = async (req, res) => {
    //console.log(req.body)
    let Tableo = new Array()
    Tableo = req.body.tab
    console.log("print tab")
    console.log(Tableo)
    let NumCommande = parseInt(req.body.NumCommande)
    console.log("Numéro Commande")
    console.log(NumCommande)
    console.log("taille tableau")
    console.log(Tableo.length)
    let bPretAEnregistrer = true;
    const Dispo = {
        quantiteActuel: 1, //Initialise a 0
    };


    if (Tableo.length == 0 || isNaN(NumCommande)) { //
        return res.status(400).json({
            message: "Erreur. Veuillez remplir tous les champs obligatoires tableau ",
        });
    } else {
        console.log("Tableau okay")

       
        let i = 0;
       

        while (i < Tableo.length && bPretAEnregistrer) {
            let element = Tableo[i]
            //console.log(element)
            ///////////////////////////////////////////////////
            const tabligneCommandes = {
                quantite: element.Quantite,
                miseadispoId: element.id_prodDispo,
                commandeId: NumCommande,
            };
            ///////////////////////////////////////////////////
            console.log("tab élément")
            console.log(tabligneCommandes)
            ///////////////////////////////////////////////////
            


            //////////////////////////////////////////////////////
            let id = parseInt(tabligneCommandes.miseadispoId)
            ///////////////////////////////////////////////////
            console.log("id")
            console.log(id)
            ///////////////////////////////////////////////////
            console.log("MisADispo")
            console.log("////////")
            ///////////////////////////////////////////////////



            let qt = element.quantiteActuel
            //let qti = tabligneCommandes.quantite


            console.log("i")
            console.log(i)
            console.log("taille")
            console.log(Tableo.length)
            console.log("bool")
            console.log(bPretAEnregistrer)
            console.log("quantité pris")
            //console.log(qti)
            console.log("quantité dispo qt")
            console.log(qt)


            // Vérification si QteACommander <= Stock Dispo
            if (tabligneCommandes.quantite <= qt) {
                // La quantité est bonne
                console.log("Tout va bien, on continue");
            } else {
                if (tabligneCommandes.quantite > qt) {
                console.log("quantite")
                console.log(tabligneCommandes.quantite)
                // La quantité est trop élevée
                bPretAEnregistrer = false;
                //messErr = "Le produit " + element.libelle + " est en quantité trop élevée";
                const message =`La quantitée du produit ${element.libelle} demandée est supérieure à la quantitée restante`;
                await commandeService.deleteCommand(tabligneCommandes.commandeId)
                .then(async(Datas) => {
                await res.status(500).json({ statut: false, message });
                })
                .catch((error) => {
                 const message = "la commande n'a pas pu être supprimé.";
                res.status(500).json({ statut: false, message, error: error });
                });    
            }
        }
            i++;
        }    
    }





    if (bPretAEnregistrer) {
        Tableo.forEach(async element => {
            const ligneCommandes = {
                quantite: element.Quantite,
                miseadispoId: element.id_prodDispo,
                commandeId: NumCommande,
            };
        let idProduit =  element.id_prodDispo;
            console.log("id des produits")
            console.log(idProduit)
            await MisADispo.getProduitDispo(idProduit)
                .then(async(data) => {
                    let qt = data.quantiteActuel; //data.dataValues.quantiteActuel;
                    let qtPris = ligneCommandes.quantite;
                    console.log("///////////////////")
                    console.log("qt existe",qt)
                    console.log("qtpRIS",qtPris)
                    console.log("///////////////////")
                    console.log("quantité actuel du produit")
                    console.log(qt, qtPris)
                    let qti = qt - qtPris;
                    //console.log(qti)
                    console.log("quantité commandé")
                    ///////////////////////////////////////////////////
                    //qti = parseInt(qt) - parseInt(tabligneCommandes.quantite);
                    console.log("quantité actuel du produit apres la commande", qti)
                    //data.quantiteActuel = qti;
                    //console.log(id, Dispo.quantiteActuel)
                    //console.log(Dispo)
                    //console.log(element.Dispo)               
                    //console.log(data.Dispo)  
                    //console.log(element.data.Dispo)
                    //console.log("iiiiiiiiiiiiiiiiii") 
                    //console.log(ligneCommandes)  
                    //console.log("eeeeeeeeeeeeeeeee")  
                    Dispo.quantiteActuel = qti;
                    
                    console.log(Dispo, "1")
                    ///////////////////////////////////////////////////                            
                    await MisADispo.updateProduitDispo(idProduit, Dispo)
                        .then((datamisea) => {
                             ligneCommande
                                .create(ligneCommandes)
                                .then((Data) => {
                                    console.log("id pro",idProduit)
                                    console.log("quantité restante",qti);
                                    const message = "Votre commande a été transmise.";
                                    res.json({ statut: true, message });

                                })
                                .catch((error) => {
                                    const message = `un problème est survenu lors de la création de votre commande.`;
                                    res
                                        .status(500)
                                        .json({ statut: false, message, error: error });
                                });
                        })
                        .catch((error) => {
                            const message = `problème pendant le processus de modification des quantité. Réessayez dans quelques instants svp.`;
                            res.status(500).json({ statut: false, message, error });
                        });
                    //}
                })
                .catch((error) => {
                    const message = `problème pendant le processus de commande. Réessayez dans quelques instants svp.`;
                    res.status(500).json({ statut: false, message, error });
                });
        })
    }
    else {
        Tableo.forEach(element => {
        console.log(" booléen false.");
        commandeService.deleteCommand(element.commandeId)
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
