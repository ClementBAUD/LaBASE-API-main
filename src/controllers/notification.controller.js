const { notification } = require('../models/notification.model');
const express = require("express");
/// securise l'appel recup
exports.getAllnotification = async(req, res) => {
    const userList = await notification.find();

    if (!userList) {
        res.status(500).json({ success: false })
    }
    res.send(userList);
}

exports.getnotificationById = async(req, res) => {
    const user = await notification.find({ idUser: req.body.id });
    if (!user) {
        res.status(500).json({ message: `l'utilisateur avec l'ID donné n'a pas été trouvé.` })
    }
    res.status(200).send(user);
}

exports.addcreatNotif = async(req, res) => {
    if (!req.body ) {
        return res.status(400).json({ message: 'Erreur. Merci de remplir tous les champs obligatoires ' })
    }
    const objBody = req.body;
    const idUser = objBody.id;
    const abonnement = objBody.subscription;

    let user = new notifications({
        idUser: idUser,
        endpoint:abonnement.endpoint,
        keys:abonnement.keys,
        userAgent: abonnement.userAgent,
        deviceId: abonnement.deviceId
    })

    user = await user.save();

    if (!user){
        return res.status(400).send('utilisateur ne peut pas être créé !')

    }
    return res.json({ "statut": true, Data:user });
}

exports.deletecreatNotif = (req, res) => {
    User.findByIdAndRemove(req.query.id).then(user => {
        if (user) {
            return res.status(200).json({ success: true, message: 'la notification utilisateur est supprimé !' })
        } else {
            return res.status(404).json({ success: false, message: "utilisateur non trouvé !" })
        }
    }).catch(err => {
        return res.status(500).json({ success: false, error: err })
    })
}