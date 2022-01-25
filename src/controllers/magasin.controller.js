/*
 * Gestion des magasins avec la creation modification et suppresion 
 */
const express = require("express");
const router = express.Router();
const { Magasin } = require("../db/sequelize");
const { User } = require("../db/sequelize");
const jwt = require('jsonwebtoken');
const { Statutcompt } = require("../db/sequelize");
const { success, error } = require("../utils/helper.js");
const { ValidationError, UniqueConstraintError } = require('sequelize');
const { Op } = require('sequelize');
const { Recup, listeUserMAg } = require("../db/requete");
const MagasinUser = require('../services/magasin.services');
const { Profil } = require("../db/sequelize");

/**
 * creation d'un magasin
 * 
 */
exports.Magasincreate = async(req, res) => {
    // Aucune information à traiter
    if (!req.body.nom || !req.body.tel || !req.body.adresse || !req.body.heureouverture || !req.body.heurefermeture || !req.body.email) {
        return res.status(400).json({ message: 'Erreur. Merci de remplir tous les champs obligatoires ' })
    }

    let ouverture = 0
    const userData = {
        nom: req.body.nom,
        adresse: req.body.adresse,
        tel: req.body.tel,
        HeureOuverture: req.body.heureouverture,
        Ouvert: ouverture,
        email: req.body.email,
        HeureFermeture: req.body.heurefermeture,
        userId: req.body.id,
        description:req.body.description
    }
    let userId = parseInt(req.body.id);
    /*     Recup(userId, "magasins", "POST").then(resultat => {
            if (resultat[0].res > 0) { */
    Magasin.findOne({
            where: {
                email: req.body.email
            }
        })
        .then(user => {
            if (!user) {
                // console.log(user)
                Magasin.create(userData)
                    .then(Data => {
                        const message = `Le Magasin ${req.body.nom} a bien été crée.`;
                        //  user.setPassword(null);

                        // creation de son status par defaut 
                        res.json({ "statut": true, Data, message: message });
                    })
                    .catch(error => {

                        const message = `Un problème a été détecté lors de la création du Magasin. Réessayez dans quelques instants.`
                        res.status(500).json({ statut: "false", message, error: error })
                    })

            } else {

                const message = `Le Magasin n'a pas pu être ajouté. Parce qu'il y a eu une violation de contrainte .`
                res.status(500).json({ "statut": "false", message })
            }
        })
        .catch(err => {
            const message = `Le Magasin n'a pas pu être ajouté car une erreur a été déclenchée.`
            res.status(500).json({ "statut": "false", message, err })
        })

    /* } else {
            let resul = { statut: false, message: "Action non autorisée." }
            return res.status(500).json({ resul });
        }
    }).catch(error => {
        return res.status(403).json({ statut: false, message: "champs manquants dans votre requête ", verification: 'Champs verification manquant', error });
    }) */

}

exports.Magasinonline = async(req, res) => {
    if (!req.body.id || !req.body.ouvert) {
        return res.status(400).json({ message: 'Erreur. Merci de remplir tous les champs obligatoires ' })
    }

    userId = req.body.idUSer;
    const userData = {
        id: req.body.id,
        Ouvert: req.body.ouvert,
    }

    // let userId=parseInt(userId);
    /*   Recup(userId, "	magasins", "PUT").then(resultat => {
          if (resultat[0].res > 0) { */
    MagasinUser.updatemagasin(req.body.id, userData)
        .then(user => {

            const message = 'Le statut Magasin a bien été modifié.';

            res.json({ statut: true, message, data: user })
        })
        .catch(error => {
            const message = `Le Magasin n'a pas pu être modifié. Réessayez dans quelques instants.`
            res.status(500).json({ statut: false, message, data: error })
        })

    /*   } else {
            let resul = { statut: false, "message": "Action non autorisée." }
            return res.status(500).json({ resul });
        }
    }).catch(error => {
        return res.status(403).json({ statut: false, message: "champs manquants dans votre requête ", verification: 'Champs verification manquant', error });
    }) */
}

exports.MagasinUpdate = async(req, res) => {
    if (!req.body.id || !req.body.nom || !req.body.tel || !req.body.adresse || !req.body.heureouverture || !req.body.heurefermeture) {
        return res.status(400).json({ message: 'Erreur. Merci de remplir tous les champs obligatoires ' })
    }

    userId = req.body.idUSer;
    const userData = {
        id: req.body.id,
        nom: req.body.nom,
        adresse: req.body.adresse,
        tel: req.body.tel,
        HeureOuverture: req.body.heureouverture,
        email: req.body.email,
        HeureFermeture: req.body.heurefermeture,
        userId: userId,
        description:req.body.description

    }

    //  let userId=parseInt(userId);
    /*   Recup(userId, "	magasins", "PUT").then(resultat => {
          if (resultat[0].res > 0) { */
    MagasinUser.updatemagasin(req.body.id, userData)
        .then(user => {

            const message = 'Le Magasin a bien été modifié.';

            res.json({ statut: true, message, data: userData })
        })
        .catch(error => {
            const message = `Le Magasin n'a pas pu être modifié. Réessayez dans quelques instants.`
            res.status(500).json({ statut: false, message, data: error })
        })

    /*   } else {
            let resul = { statut: false, "message": "Action non autorisée." }
            return res.status(500).json({ resul });
        }
    }).catch(error => {
        return res.status(403).json({ statut: false, message: "champs manquants dans votre requête ", verification: 'Champs verification manquant', error });
    }) */
}


exports.MagasinDelete = async(req, res) => {
    if (!req.body.id, !req.body.idUSer) {
        return res.status(400).json({ message: 'Erreur. Merci de remplir tous les champs obligatoires ' })
    }
    userId = req.body.idUSer;
    id = req.body.id

    Recup(userId, "magasins", "DELETE").then(resultat => {
        if (resultat[0].res > 0) {
            //le magasin a été supprimé
            MagasinUser.delete(id)
                .then(user => {

                    const message = `le magasin a été supprimé.`;

                    res.json({ statut: true, message, data: user })
                })
                .catch(error => {
                    const message = `Le magasin n'a pas pu être supprimé. Réessayez dans quelques instants.`
                    res.status(500).json({ statut: false, message, data: error })
                })

        } else {
            let resul = { statut: false, "message": "Action non autorisée." }
            return res.status(500).json({ resul });

        }
    }).catch(error => {

        return res.status(403).json({ statut: false, message: "champs manquants dans votre requête ", verification: 'Champs verification manquant', error });

    })
}

exports.MagasinAll = async(req, res) => {
    if (!req.body.magasin){
        return res.status(400).json({ message: 'Erreur. Merci de remplir tous les champs obligatoires ' })
    }
    Magasin.findAndCountAll({
        attributes: {
            exclude: ["password", "statutcomptId", "profilId"],
        },
        include: [{
            model: User,
            attributes: [ 'nom' ]
          }]
    }).then(magasin => {
        const message = `Tous les magasins.`;
        res.json({ statut: true, message, data: magasin })
    }).catch(error => {
        const message = `Aucun magasin n'a pu être récupéré . Réessayez dans quelques instants.`
        res.status(500).json({ statut: false, message, data: error })
    })


}


exports.getMagasin = async(req, res) => {
    if (!req.query.id) {
        return res.status(400).json({ message: 'Erreur. Merci de remplir tous les champs obligatoires ' })
    }
    const idMag = parseInt(req.query.id)
    MagasinUser.getMagasin(idMag).then(user => {
            const userData = {
                id: user.id,
                email: user.email,
                prenom: user.prenom,
                nom: user.nom,
                statut: user.StatutcomptId
            }
            const message = 'Le Magasin a bien été retrouvé.';

            res.json({ statut: true, message, data: user })
        })
        .catch(error => {
            const message = `Le Magasin n'a pas pu être retrouvé. Réessayez dans quelques instants.`
            res.status(500).json({ statut: false, message, data: error })
        })
}

// get User Magasin
exports.getUserMagasin = async(req, res) => {
    if (!req.query.idmagasin) {
        return res.status(400).json({ message: 'Erreur. Merci de remplir tous les champs obligatoires ' })
    }
    /*   Recup(userId, "magasins", "GET").then(resultat => {
          if (resultat[0].res > 0) { */
    Profil.findAll({
            where: { nom: "Etudiant" },
            attributes: { exclude: ["createdAt", "updatedAt"] },
        }).then((respos) => {

            listeUserMAg(req.query.idmagasin, respos[0].id)
                .then(resultat => {
                    res.json({ statut: true, resultat });
                })
                .catch((error) => {
                    res.status(500).json({ statut: false, error });
                });

        })
        .catch((error) => {
            res.status(500).json({ statut: false, error });
        });
    /* } else {
        let resul = { statut: false, message: "Action non autorisée." }
        return res.status(500).json({ resul });
    }
    }).catch(error => {
    return res.status(403).json({ statut: false, message: "champs manquants dans votre requête ", verification: 'Champs verification manquant', error });
    }) */

}

// recuperation d'un magasin par un users 

exports.getMagasinUser = async(req, res) => {
    // console.log(req.query.iduser)
    if (!req.query.iduser) {
        return res.status(400).json({ message: 'Erreur. Merci de remplir tous les champs obligatoires ' })
    }
    /*   Recup(userId, "magasins", "GET").then(resultat => {
          if (resultat[0].res > 0) { */

    iduser = parseInt(req.query.iduser)
    Magasin.findAll({
            where: { userId: iduser },
            attributes: { exclude: ["createdAt", "updatedAt"] },
        }).then((respos) => {
            res.json({ statut: true, resultat: respos });
        })
        .catch((error) => {
            res.status(500).json({ statut: false, error, message: "pas de magasin" });
        });
    /* } else {
        let resul = { statut: false, message: "Action non autorisée." }
        return res.status(500).json({ resul });
    }
    }).catch(error => {
    return res.status(403).json({ statut: false, message: "champs manquants dans votre requête ", verification: 'Champs verification manquant', error });
    }) */

}

// magasin rattacher a un user