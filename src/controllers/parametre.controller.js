const express = require("express");
const { parametre } = require("../db/sequelize");
const parametreService = require("../services/paramatre.services");

/**
 * méthode de création des params
 */

exports.create_parmas = async (req, res) => {
    if (!req.body.nom || !req.body.nombre) {
        return res.status(400).json({
            message: "Erreur. Veuillez remplir tous les champs obligatoires ",
        });
    }

    const dataP = {
        nom: req.body.nom,
        nombre: req.body.nombre,
    };

    parametre
        .create(dataP)
        .then((Datas) => {
            const message = "Votre paramètre a été crée.";
            res.json({ statut: true, Data: Datas, message });
        })
        .catch((error) => {
            const message =
                "un problème a été détecté lors de la création de votre paramètre. Réessayez dans quelques instants Svp";
            res.status(500).json({ statut: false, message, error: error });
        });
};

/**
 * modifier
 */
exports.update_parmas = async (req, res) => {
    //|| !req.body.userId
    if (!req.body.id || !req.body.nombre) {
        return res.status(400).json({
            message: "Erreur. Merci de remplir tous les champs obligatoires ",
        });
    }
    id = parseInt(req.body.id);
    const dataP = {
        nombre: req.body.nombre,
    };

    parametreService
        .updateParametre(id, dataP)
        .then((Datas) => {
            const message = "Le paramètre de la commande à été modifié .";
            res.json({ statut: true, Data: Datas, message });
        })
        .catch((error) => {
            const message = "Le paramètre n'a pas pu être modifié.";
            res.status(500).json({ statut: false, message, error: error });
        });
};

exports.liste_parmas = async (req, res) => {
    if (req.query.id) {
        parametre
            .findAll({
                where: { id: req.query.id },
                attributes: { exclude: ["createdAt", "updatedAt"] },
            })
            .then((respos) => {
                if (!respos) {
                    const message = `Oups! un problème a été détecté.`;
                    return res.status(404).json({ statut: false, message });
                }
                return res.json({ statut: true, data: respos });
            })
            .catch((error) => {
                const message = ` L'utilisateur n'a pas pu être ajouté car une erreur a été déclenchée`;
                res.json({ statut: false, message, error });
            });
    } else {
        parametre
            .findAll({ attributes: { exclude: ["createdAt", "updatedAt"] } })
            .then((respos) => {
                if (!respos) {
                    const message = `Oups! un problème a été détecté.`;
                    return res.status(404).json({ statut: false, message });
                }
                return res.json({ statut: true, data: respos });
            })
            .catch((error) => {
                const message = ` L'utilisateur n'a pas pu être ajouté car une erreur a été déclenchée`;
                res.json({ statut: false, message, error });
            });
    }
};
