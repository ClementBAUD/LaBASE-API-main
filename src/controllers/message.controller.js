/*
 * Gestion des magasins avec la creation modification et suppresion 
 */
const express = require("express");
const router = express.Router();
const { message } = require("../db/sequelize");
const MessageService = require('../services/message.services');
const { Profil } = require("../db/sequelize");

/**
 * creation d'un message
 * 
 */
exports.Messagecreate = async(req, res) => {
    // Aucune information à traiter
    if (!req.body.idMage || !req.body.idUser || !req.body.message) {
        return res.status(400).json({ message: 'Erreur. Merci de remplir tous les champs obligatoires ' })
    }

    const userData = {
        iduser: req.body.idUser,
        idmag: req.body.idMage,
        message: req.body.message,
        nomuser:req.body.nomuser,
        nomMagasin:req.body.nomMagasin,
        statut:"attente"
    }

                 message.create(userData)
                    .then(Data => {
                        const message = `Le message a bien été crée.`;
                        //  user.setPassword(null);

                        // creation de son status par defaut 
                        res.json({ "statut": true, Data, message: message });
                    })
                    .catch(error => {

                        const message = `Un problème a été détecté lors de la création du Magasin. Réessayez dans quelques instants.`
                        res.status(500).json({ statut: "false", message, error: error })
                    })
       
}

exports.MessageUpdate = async(req, res) => {
    if (!req.body.id ) {
        return res.status(400).json({ message: 'Erreur. Merci de remplir tous les champs obligatoires ' })
    }

    const userData = {
        iduser: req.body.idUser,
        idmag: req.body.idMage,
        message: req.body.message,
        nomuser:req.body.nomuser,
        nomMagasin:req.body.nomMagasin,
        statut:req.body.statut
    }

    MessageService.updateMessage(req.body.id, userData)
        .then(user => {

            const message = 'Le message a bien été modifié.';

            res.json({ statut: true, message, data: userData })
        })
        .catch(error => {
            const message = `Le message n'a pas pu être modifié. Réessayez dans quelques instants.`
            res.status(500).json({ statut: false, message, data: error })
        })

   
}

exports.MessageDelete = async(req, res) => {
    if (!req.body.id) {
        return res.status(400).json({ message: 'Erreur. Merci de remplir tous les champs obligatoires ' })
    }
    id = req.body.id


            //le magasin a été supprimé
            MessageService.delete(id)
                .then(user => {

                    const message = `le message a été supprimé.`;

                    res.json({ statut: true, message, data: user })
                })
                .catch(error => {
                    const message = `Le message n'a pas pu être supprimé. Réessayez dans quelques instants.`
                    res.status(500).json({ statut: false, message, data: error })
                })

       
}

exports.MessageAll = async(req, res) => {

    MessageService.getAllMessage().then(magasin => {

        const message = `Tous les message.`;
        res.json({ statut: true, message, data: magasin })
    }).catch(error => {
        const message = `Aucun message n'a pu être récupéré . Réessayez dans quelques instants.`
        res.status(500).json({ statut: false, message, data: error })
    })


}

exports.getMessage = async(req, res) => {
    if (!req.query.id) {
        return res.status(400).json({ message: 'Erreur. Merci de remplir tous les champs obligatoires ' })
    }
    MessageService.getMessage(idMag).then(user => {
           
            const message = 'Le Magasin a bien été retrouvé.';

            res.json({ statut: true, message, data: idMag })
        })
        .catch(error => {
            const message = `Le Magasin n'a pas pu être retrouvé. Réessayez dans quelques instants.`
            res.status(500).json({ statut: false, message, data: error })
        })
}

exports.getMessageUser = async(req, res) => {
    if (!req.query.iduser) {
        return res.status(400).json({ message: 'Erreur. Merci de remplir tous les champs obligatoires ' })
    }

    message.findOne({
        where: { iduser: req.query.iduser },
        attributes: {
            exclude: ["createdAt", "updatedAt"],
        },
    })
    .then((resultat) => {
        const message = `Le message a été retrouvé avec succès`;
        //  console.log(user);
        
        return res.json({ statut: true, data: resultat, token });
    })
    .catch(error => {
        const message = `Le Message n'a pas pu être retrouvé. Réessayez dans quelques instants.`
        res.status(500).json({ statut: false, message, data: error })
    })

    MessageService.getMessage(idMag).then(user => {
           
            const message = 'Le Magasin a bien été retrouvé.';

            res.json({ statut: true, message, data: idMag })
        })
        .catch(error => {
            const message = `Le Magasin n'a pas pu être retrouvé. Réessayez dans quelques instants.`
            res.status(500).json({ statut: false, message, data: error })
        })
}

