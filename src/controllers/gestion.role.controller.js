/**
 * Gestion des roles et attributions des differentes roles
 * utilisateurs
 * il manque les methodes put et delete
 */
const express = require("express");
const router = express.Router();
const { User } = require("../db/sequelize");
const { Profil } = require("../db/sequelize");
const { Role } = require("../db/sequelize");
const { profil_role } = require("../db/sequelize");
const { UserProfil } = require("../db/sequelize");
//const { sequelize } = require("../db/sequelize");
const { Recup } = require("../db/requete");



const { success, error } = require("../utils/helper.js");
const { ValidationError, UniqueConstraintError } = require('sequelize')
const { Op } = require('sequelize')

/**
 * attribution  de role a chaque profile 
 * exemple Admin => "nom de table"
 */
exports.profileRole = (req, res) => {

    // Aucune information à traiter
    if (!req.body.profilId || !req.body.roleId || !req.body.userid) {
        return res.status(400).json({ message: 'Erreur. Merci de remplir tous les champs obligatoires ' })
    }
    const userData = {
        profilId: req.body.profilId,
        roleId: req.body.roleId,
    }

    userId = parseInt(req.body.userid);
    Recup(userId, "	profil_roles", "POST")
        .then((resultat) => {
            profil_role.create(userData)
                .then(profilrole => {
                    const message = `un role profil a bien été crée.`;
                    res.json(success(profilrole));
                })
                .catch(error => {

                    const message = `Le profil n'a pas pu être ajouté. Réessayez dans quelques instants.`
                    res.status(500).json({ message, error })
                })
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
        });

};

/**
 * attribution  de role a un user 
 */
exports.userRole = (req, res) => {

    // Aucune information à traiter
    if (!req.body.userId || !req.body.profilId) {
        return res.status(400).json({ message: 'Erreur. Merci de remplir tous les champs obligatoires ' })
    }
    //

    // verification d'users 
    const userData = {
        userId: req.body.userId,
        profilId: req.body.profilId,
    }
    userId = parseInt(req.body.userId);
    Recup(userId, "	profil_roles", "POST")
        .then((resultat) => {
            UserProfil.create(userData)
                .then(profile => {
                    const message = `un role profil a bien été crée.`;
                    res.json(success(profile));
                })
                .catch(error => {

                    const message = `Le  role n'a pas pu être ajouté. Réessayez dans quelques instants.`
                    res.status(500).json({ message, error })
                })
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
        });

};

exports.getVerfication = async (req, res) => {

    if (!req.body.userId) {
        return res.status(400).json({ message: 'Erreur. Merci de remplir tous les champs obligatoires ' })
    }
    // verification marche bien 
    const resv = Recup(req.body.userId).then(resultat => {

        if (resultat[0].res > 0) {
            let resul = { "statut": true, "message": resultat[0].res }
            res.send(resul)
        } else {
            let resul = { "statut": false, "message": "Action non autorisée." }
            return res.status(403).json({ resul });

        }

    })




};