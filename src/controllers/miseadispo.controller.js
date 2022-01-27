/**
 * Produits mise a disposition 
 */
const express = require("express");
const router = express.Router();
const { Produit } = require("../db/sequelize");
const { MiseADispo } = require("../db/sequelize");
const { StatusDispo } = require("../db/sequelize");
const { success, error } = require("../utils/helper.js");
const { Recup, listeProduitMAg, FiltrelisteProduitMAgDonne, listeProduitMAgDonne,
     listeProduitDonne, DetailProduitMAg,listeCategorieDuJour ,CategoriesListeProduits} = require("../db/requete");
const MisADispos = require("../services/MisADispo.services");
const { statutCommande } = require("../db/sequelize");

exports.CreateMise_A_Dispo = async(req, res) => {
    // Aucune information à traiter

    if (!req.body.libelle ||
        !req.body.description ||
        !req.body.quantiteInit ||
        !req.body.MagasinId ||
        !req.body.userId ||
        !req.body.ProduitId
    ) {
        return res.status(400).json({
            message: "Erreur. Veuillez remplir tous les champs obligatoires ",
        });
    }

    const Dispo = {
        libelle: req.body.libelle,
        description: req.body.description,
        quantiteInit: req.body.quantiteInit,
        quantiteActuel: req.body.quantiteInit,
        statusdisposId: "",
        date: new Date().toISOString().slice(0, 10),
        magasinId: parseInt(req.body.MagasinId),
        produitId: parseInt(req.body.ProduitId),
        imageProduit: "",
        familleProduit: "",
    };
    userId = parseInt(req.body.userId)
        //Recup(userId, "miseadispos", "POST").then(resultat => {
        //if (resultat[0].res > 0) {
    Produit.findAll({
            where: {
                id: req.body.ProduitId,
            },
            include: ["famille"]
        })
        .then((produits) => {

            if (produits.length > 0) {
                StatusDispo.findAll({
                        where: { nom: "Disponible" },
                    })
                    .then((respo) => {
                        // console.log(respo)
                        if (respo.length > 0) {
                            let id = respo[0]["id"];
                            Dispo.statusdisposId = id;
                            Dispo.imageProduit = produits[0]["image"]
                            Dispo.familleProduit = produits[0]["famille"]["nom"]

                            MiseADispo.create(Dispo)
                                .then((Data) => {
                                    const message = `Le produit a bien été ajouté dans la liste.`;

                                    res.json({ statut: true, Data, message });
                                })
                                .catch((error) => {
                                    const message = `Le produit n'a pas pu être ajouté dans la liste. Réessayez dans quelques instants.`;
                                    res
                                        .status(500)
                                        .json({ statut: false, message, error: error });
                                });
                        } else {
                            const message = `Le produit que vous souhaitez ajouter n'existe pas. Veuillez vérifier le PLU.`;
                            res.status(500).json({ statut: false, message, produits });
                        }
                    })
                    .catch((err) => {
                        const message = `Le produit n'a pas pu être ajouté car une erreur a été déclenchée.1`;
                        res.status(500).json({ statut: false, message, err });
                    });
            } else {
                const message = `Le produit que vous souhaitez ajouter n'existe pas. Veuillez vérifier le PLU.`;
                res.status(500).json({ statut: false, message, produits });
            }
        })
        .catch((err) => {
            const message = `Le produit n'a pas pu être ajouté car une erreur a été déclenchée.`;
            res.status(500).json({ statut: false, message, err });
        });

    /* } else {
         let resul = { statut: false, "message": "Action non autorisée." }
         return res.status(500).json({ resul });
      }
     }).catch(error => {
         return res.status(403).json({ statut: false, message: "champs manquants dans votre requête ", verification: 'Champs verification manquant', error });
     })*/
};

exports.MiseADispoUpdate = async(req, res) => {
    if (!req.body.libelle ||
        !req.body.description ||
        !req.body.quantite ||
        !req.body.MagasinId ||
        !req.body.ProduitId ||
        !req.body.userId ||
        !req.body.statusDispoId ||
        !req.body.id
    ) {
        return res.status(400).json({
            message: "Erreur. Veuillez remplir tous les champs obligatoires ",
        });
    }

    const Dispo = {
        libelle: req.body.libelle,
        description: req.body.description,
        //  quantiteInit: req.body.quantiteInit,
        quantiteActuel: req.body.quantite,
        // statusDispoId:req.body.statusDispoId,
        //   MagasinId:parseInt(req.body.MagasinId) ,
        //  ProduitId : parseInt(req.body.ProduitId) ,
    };
    const Dispo1 = {
        statusDispoId: "",
    };
    let ids = req.body.id;
    let id = parseInt(ids);
    userId = req.body.userId;

    /*      Recup(userId, "miseadispos", "PUT").then(resultat => {
           console.log("yes")
           if (resultat[0].res > 0) { */

    MisADispos.getProduitDispo(id)
        .then((data) => {
            //res.json({ statut: true, data });
            console.log(data.dataValues.quantiteActuel);
            if (data.dataValues) {
                let qt = data.dataValues.quantiteActuel;

                if (qt > 0) {
                    //modification
                    if (qt >= parseInt(Dispo.quantiteActuel)) {
                        let qti = parseInt(qt) - parseInt(Dispo.quantiteActuel);
                        Dispo.quantiteActuel = qti;
                        MisADispos.updateProduitDispo(id, Dispo)
                            .then((data) => {
                                const message = "Le Produit a bien été modifié.";

                                res.json({ statut: true, message, datas: data });
                            })
                            .catch((error) => {
                                const message = `Le Produit n'a pas pu être modifié. Réessayez dans quelques instants.`;
                                res.status(500).json({ statut: false, message, error });
                            });
                    } else {
                        const message = "La quantité demandée est supérieure à la quantite restante.";
                        res.json({ statut: true, message });
                    }
                } else {
                    Dispo1.statusDispoId = 2;
                    MisADispos.updateProduitDispo(id, Dispo1)
                        .then((data) => {
                            const message = "Le Produit n'est plus disponible. Veuillez changer de produit.";
                            res.json({ statut: true, message });
                        })
                        .catch((error) => {
                            const message = `Le Produit n'a pas pu être modifié. Réessayez dans quelques instants.`;
                            res.status(500).json({ statut: false, message, error });
                        });
                }
            } else {
                const message = "Le Produit n'a pas été modifié.";
                res.json({ statut: false, message });
            }

            // res.json({ statut: true, message, datas: data })
        })
        .catch((error) => {
            const message = `Réessayez dans quelques instants.`;
            res.status(500).json({ statut: false, message, error });
        });


    /*   } else {
              let resul = { statut: false, "message": "Action non autorisée." }
              return res.status(500).json({ resul });
          }
      }).catch(error => {
          return res.status(403).json({ statut: false, message: "champs manquants dans votre requête ", verification: 'Champs verification manquant', error });
      }) */


};

exports.DispoUpdate = async(req, res) => {
    if (!req.body.libelle ||
        !req.body.description ||
        !req.body.quantite ||
        !req.body.id
    ) {
        return res.status(400).json({
            message: "Erreur. Veuillez remplir tous les champs obligatoires ",
        });
    }

    const Dispo = {
        libelle: req.body.libelle,
        description: req.body.description,
        //  quantiteInit: req.body.quantiteInit,
        quantiteActuel: req.body.quantite,
        quantiteInit: req.body.quantite,
        // statusDispoId:req.body.statusDispoId,
        //   MagasinId:parseInt(req.body.MagasinId) ,
        //  ProduitId : parseInt(req.body.ProduitId) ,
    };

    let ids = req.body.id;
    let id = parseInt(ids);
    userId = req.body.userId;

    /*      Recup(userId, "miseadispos", "PUT").then(resultat => {
           console.log("yes")
           if (resultat[0].res > 0) { */

    MisADispos.getProduitDispo(id)
        .then((data) => {
            //res.json({ statut: true, data });
            console.log(data.dataValues.quantiteActuel);
            MisADispos.updateProduitDispo(id, Dispo)
                .then((data) => {
                    const message = "Le Produit a bien été modifié.";

                    res.json({ statut: true, message, datas: data });
                })
                .catch((error) => {
                    const message = `Le Produit n'a pas pu être modifié. Réessayez dans quelques instants.`;
                    res.status(500).json({ statut: false, message, error });
                });

            // res.json({ statut: true, message, datas: data })
        })
        .catch((error) => {
            const message = `Réessayez dans quelques instants.`;
            res.status(500).json({ statut: false, message, error });
        });


    /*   } else {
              let resul = { statut: false, "message": "Action non autorisée." }
              return res.status(500).json({ resul });
          }
      }).catch(error => {
          return res.status(403).json({ statut: false, message: "champs manquants dans votre requête ", verification: 'Champs verification manquant', error });
      }) */


};
// delete produit mise a dispo 
exports.MiseADispoDelete = async(req, res) => {
    if (!req.body.id || !req.body.userId) {
        return res
            .status(400)
            .json({
                message: "Erreur. Veuillez remplir tous les champs obligatoires ",
            });
    }

    idMise = req.body.id;

    //iduser = req.body.userId;
    /*     Recup(iduser, "miseadispos", "DELETE").then(resultat => {
           if (resultat[0].res > 0) { */

    MisADispos.deleteMise_ADispo(idMise)
        .then((produits) => {
            const message = `le produit a bien été suprimé.`;

            res.json({ statut: true, message, data: produits });
        })
        .catch((error) => {
            const message = `le produit n'a pas pu être suprimé. Réessayez dans quelques instants.`;
            res.status(500).json({ statut: false, message, data: error });
        });
    /*  } else {
        let resul = { statut: false, "message": "Action non autorisée." }
        return res.status(500).json({ resul });
    }
    }).catch(error => {
    return res.status(403).json({ statut: false, message: "champs manquants dans votre requête ", verification: 'Champs verification manquant', error });
    }) */
};

// getIbyproduit
exports.getIbyproduit = async(req, res) => {
    if (!req.query.id) {
        return res
            .status(400)
            .json({
                message: "Erreur. Veuillez remplir tous les champs obligatoires ",
            });
    }
    quant= req.query.quantiteActuel
    id = req.query.id
    let idproduit = parseInt(id)
    let quantProduit = parseInt(quant)
    DetailProduitMAg(idproduit).then(resultat => {
        if (resultat.length > 0) {
            console.log(resultat.length);
            const message = `produit dispo du jour.` + resultat.length + " " + idproduit + " " + quantProduit;

            res.json({ statut: true, message, data: resultat });
        } else {
            let resul = { statut: true, "message": "aucun produit dispo .", resultat }
            return res.json({ resul });
        }
    }).catch(error => {
        return res.status(403).json({ statut: false, message: "Un probleme est survenu. Réessayez dans quelques instants." });
    })

};
// liste des produits dispo le jour 
exports.ListeproduiDay = async(req, res) => {
    if (!req.query.idmagasin) {
        return res
            .status(400)
            .json({
                message: "Erreur. Veuillez remplir tous les champs obligatoires ",
            });
    }
    let idmagasin = parseInt(req.query.idmagasin)
    listeProduitMAg(idmagasin).then(resultat => {
        // console.log(resultat);
        if (resultat.length > 0) {
            const message = `les produits dispo du jour.`;

            res.json({ statut: true, message, data: resultat });
        } else {
            return res.json({ statut: true, message: "aucune produit dispo .", data:resultat });
        }
    }).catch(error => {
        return res.status(403).json({ statut: false, message: "Un probleme est survenu. Réessayez dans quelques instants." });
    })

}

// liste de produit dispo sur une periode 
exports.ListeproduitFiltre = async(req, res) => {
    if (!req.body.idmagasin || !req.body.datefiltreDebut || !req.body.datefiltreFin) {
        return res
            .status(400)
            .json({
                message: "Erreur. Veuillez remplir tous les champs obligatoires ",
            });
    }
    FiltrelisteProduitMAgDonne(req.body.idmagasin, req.body.datefiltreDebut, req.body.datefiltreFin).then(resultat => {
        // console.log(resultat);
        if (resultat.length > 0) {
            const message = `les produits dispo du jour.`;

            res.json({ statut: true, message, data: resultat });
        } else {
            let resul = { statut: true, "message": "aucune produit dispo .", data:resultat }
            return res.json({ resul });
        }
    }).catch(error => {
        return res.status(403).json({ statut: false, message: "Un probleme est survenu. Réessayez dans quelques instants." });
    })
}

// liste de  produit donnée depuis le debut par mag 
exports.listeProduitAllMag = async(req, res) => {
    if (!req.query.idmagasin) {
        return res
            .status(400)
            .json({
                message: "Erreur. Veuillez remplir tous les champs obligatoires ",
            });
    }
    //iduse
    let idmagasin = parseInt(req.query.idmagasin)
    listeProduitAll(idmagasin).then(resultat => {
        // console.log(resultat);
        if (resultat.length > 0) {
            const message = `les produit dispo du jour.`;

            res.json({ statut: true, message, data: resultat });
        } else {
            message = "aucune produit dispo ."
            return res.json({ statut: true, message, data: resultat });
        }
    }).catch(error => {
        return res.status(403).json({ statut: false, message: "Un probleme est survenu. Réessayez dans quelques instants." });
    })
}

// liste de  produit donnée depuis le debut  
exports.listeProduitAll = async(req, res) => {
    if (!req.query.idmagasin) {
        return res
            .status(400)
            .json({
                message: "Erreur. Veuillez remplir tous les champs obligatoires ",
            });
    }
    //iduser
    let idmagasin = parseInt(req.query.idmagasin)

    statutCommande.findOne({
        where: {
            nom: "Récupérée"
        }
    })
    .then(commande => {
        if (!commande) {
            const message = `un petit problème a été détecté .`
            res.status(500).json({ "statut": false, message })

        } else {
            // console.log()
            listeProduitDonne(idmagasin,commande.id).then(resultat => {
                if (resultat.length > 0) {
                    const message = `les produit dispo du jour.`;
        
                    res.json({ statut: true, message, data: resultat });
                } else {
                    message = "aucune produit dispo ."
                    return res.json({ statut: true, message, data: resultat });
                }
            }).catch(error => {
                return res.status(403).json({ statut: false, message: "Un probleme est survenu. Réessayez dans quelques instants." });
            })
           

        }
    }).catch(err => {
        const message = `La liste des commandes n'a pas pu être récupérée car une erreur a été déclenchée.`
        res.status(500).json({ "statut": false, message, err })
    })

 


}

//liste category produits 
exports.listeProduitCategories = async(req, res) => {
    if (!req.query.idmagasin) {
        return res
            .status(400)
            .json({
                message: "Erreur. Veuillez remplir tous les champs obligatoires ",
            });
    }
    //iduser
    let idmagasin = parseInt(req.query.idmagasin)
    listeCategorieDuJour(idmagasin).then(resultat => {
        if (resultat.length > 0) {
            const message = `les categories dispo du jour.`;

            res.json({ statut: true, message, data: resultat });
        } else {
            message = "aucune categories dispo ."
            return res.json({ statut: true, message, data: resultat });
        }
    }).catch(error => {
        return res.status(403).json({ statut: false, message: "Un probleme est survenu. Réessayez dans quelques instants." });
    })
}

//liste category produits 
exports.CategorieslisteProduit = async(req, res) => {

    if (!req.query.idmagasin ||!req.query.idfamille ) {
        return res
            .status(400)
            .json({
                message: "Erreur. Veuillez remplir tous les champs obligatoires ",
            });
    }
    //iduser
    let idmagasin = parseInt(req.query.idmagasin)
    let idfamille = parseInt(req.query.idfamille)
    CategoriesListeProduits(idmagasin,idfamille).then(resultat => {
        if (resultat.length > 0) {
            const message = `les produits dispo du jour.`;

            res.json({ statut: true, message, data: resultat });
        } else {
            message = "aucun produits dispo ."
            return res.json({ statut: true, message, data: resultat });
        }
    }).catch(error => {
        return res.status(403).json({ statut: false, message: "Un probleme est survenu. Réessayez dans quelques instants." });
    })
}

//liste category produits 
exports.DetailProduits = async(req, res) => {
    if (!req.query.idmagasin) {
        return res
            .status(400)
            .json({
                message: "Erreur. Veuillez remplir tous les champs obligatoires ",
            });
    }
    //iduser
    let idmagasin = parseInt(req.query.idmagasin)
    DetailProduitMAg(idmagasin).then(resultat => {
        if (resultat.length > 0) {
            const message = `produit disponible.`;

            res.json({ statut: true, message, data: resultat });
        } else {
            message = "aucun produit disponible ."
            return res.json({ statut: true, message, data: resultat });
        }
    }).catch(error => {
        return res.status(403).json({ statut: false, message: "Un probleme est survenu. Réessayez dans quelques instants." });
    })
}