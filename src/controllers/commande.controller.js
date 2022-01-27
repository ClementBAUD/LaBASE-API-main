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

/**
 * méthode de création des commandes
 */

// pour creation de la commande 
exports.create_Commande = async (req, res) => {
    if (!req.body.heureRecuperation || !req.body.userId) {
        return res.status(400).json({
            message: "Erreur. Veuillez remplir tous les champs obligatoires ",
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
                     console.log("Datas.id:"+Datas.id);
                     console.log("Datas.userId:"+Datas.userId);
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

// gestion des commandes avec les produits 
exports.create_Lignecommande = async (req, res) => {
    if (!req.body.quantite || !req.body.MiseADispoId || !req.body.commandeId) {
        return res.status(400).json({
            message: "Erreur. Veuillez remplir tous les champs obligatoires ",
        });
    }
    const ligneCommandes = {
        quantite: req.body.quantite,
        miseadispoId: req.body.MiseADispoId,
        commandeId: req.body.commandeId,
    };
    const Dispo = {
        quantiteActuel: 0,
    };
    let id = parseInt(req.body.MiseADispoId)
    MisADispo.getProduitDispo(id)
        .then((data) => {
            let qt = data.dataValues.quantiteActuel;
            console.log(qt)
                if (qt > 0) { 
                    const message = `un problème est survenu lors de la création de votre commande.`;
                }
               else {
                //if (qt > parseInt(ligneCommandes.quantite)) {
            let qti = parseInt(qt) - parseInt(ligneCommandes.quantite);
            console.info(qt)
            console.info(qti)
//controle ici

            Dispo.quantiteActuel = qti;
            MisADispo.updateProduitDispo(id, Dispo)
                .then((datamisea) => {
                    // console.log(datamisea)
                    ligneCommande
                        .create(ligneCommandes)
                        .then((Data) => {
                            const message = "Votre commande a été transmise.";
                            res.json({ statut: true, message });
                            console.info(qt)
                            console.info(qti)
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
              /*
      else {
        console.info(qt)
        console.info(qti)
      const message =`La quantité du produit ${data.dataValues.libelle} demandée est supérieure à la quantité restante`;

        commandeService.deleteCommand(ligneCommandes.commandeId)
          .then((Datas) => {
            res.status(500).json({ statut: false, message });
          })
          .catch((error) => {
            const message = "la commande n'a pas pu être supprimé.";
            res.status(500).json({ statut: false, message, error: error });
          });

    }
/*
    }else {
        const message =`Le produit ${data.dataValues.libelle}  demandé n'est plus disponible`;

        commandeService.deleteCommand(ligneCommandes.commandeId)
        .then((Datas) => {
          res.status(500).json({ statut: false, message });
        }) 
        .catch((error) => {
          const message = "la commande n'a pas pu être supprimé.";
          res.status(500).json({ statut: false, message, error: error });
        });
       
      }*/

        })
        .catch((error) => {
            const message = `problème pendant le processus de commande. Réessayez dans quelques instants svp.`;
            res.status(500).json({ statut: false, message, error });
        });


};

/**
 * modifier
 */
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
    if (!req.body.idcommade) {
        return res.status(400).json({
            message: "Erreur. Merci de remplir tous les champs obligatoires ",
        });
    }
    let id = parseInt(req.body.idcommade);
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