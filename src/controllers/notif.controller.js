const { abonnements } = require("../db/sequelize");
const express = require("express");
const AbonnementService = require("../services/notif.services");
const { User } = require("../db/sequelize");


exports.getAllnotifications = async (req, res) => {
    abonnements.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
    })
        .then((respo) => {
            if (!respo) {
                const message = `Oups!un problème a été détecté.`;
                return res.status(404).json({ statut: false, message });
            }

            res.json({ statut: true, data: respo });

        })
        .catch((error) => {
            const message = `Une erreur a été déclenchée`;
            res.json({ statut: false, message, error });
        });
};


exports.getnotificationById = async (req, res) => {
    //|| !req.body.userId
    if (!req.body.userId) {
        return res.status(400).json({
            message: "Erreur. Merci de remplir tous les champs obligatoires ",
        });
    }
    abonnements.findAll({
        where: { userId: req.query.userId },
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
            const message = `une erreur a été déclenchée`;
            res.json({ statut: false, message, error });
        });
};

// Vérifier 
exports.verifierNotif = async (req, res) => {
    if (!req.body.userId || !req.body.idmag || !req.body.device || !req.body.notif) {
        return res.status(400).json({
            message: "Erreur. Veuillez remplir tous les champs obligatoires ",
        });
    }

    // Récupérer l'utilisateur
    let util = await User.findOne({
        where: {
            id: req.body.userId,
        },
        include: ["statutcompt", "profil"]
    });

    const userId = req.body.userId;
    const idmag = req.body.idmag;
    const statut = util.statutcompt.nom;
    const sub = req.body.sub;
    const device = req.body.device;
    const notif = req.body.notif;
    const tel = req.body.tel;

    let data = {
        userId: userId,
        idmag: idmag,
        statut: statut,
        sub: sub,
        device: device,
        notif: notif,
        tel: tel
    }

    if (sub == "") {
        project = await abonnements.findAndCountAll({ where: { userId: userId, device: "Safari" } });
    }
    else {
        project = await abonnements.findAndCountAll({ where: { sub: sub } });
    }
    if (project.count == 0) {
        // message = 'Notifications inactives'
        message = '';
        // console.log("Nb Abos:"+project.count);
        res.json({ statut: true, NbAbos: project.count, message: message });
    } else {
        message = '';
        // console.log("Nb Abos:"+project.count);
        res.json({ statut: true, NbAbos: project.count, message: message });
    }
};

// create 
exports.createNotif = async (req, res) => {


    if (!req.body.userId || !req.body.idmag || !req.body.device || !req.body.notif) {
        return res.status(400).json({
            message: "Erreur. Veuillez remplir tous les champs obligatoires ",
        });
    }

    // Récupérer le statut en cours de l'utilisateur pour créer un abonnement avec le bon statut
    let util = await User.findOne({
        where: {
            id: req.body.userId,
        },
        include: ["statutcompt", "profil"]
    });

    const userId = req.body.userId;
    const idmag = req.body.idmag;
    const statut = util.statutcompt.nom;
    const sub = req.body.sub;
    const device = req.body.device;
    const notif = req.body.notif;
    const tel = req.body.tel;

    tel
    let data = {
        userId: userId,
        idmag: idmag,
        statut: statut,
        sub: sub,
        device: device,
        notif: notif,
        tel: tel
    }

    if (sub == "") {
        project = await abonnements.findAndCountAll({ where: { userId: userId, device: "Safari" } })
    }
    else {
        project = await abonnements.findAndCountAll({ where: { sub: sub } })
    }
    if (project.count == 0) {
        abonnements.create(data)
            .then((Datas) => {
                const message = "Notifications activées";
                res.json({ statut: true, Data: Datas, message });
                console.log(project)
            })
            .catch((error) => {
                const message =
                    "un problème a été détecté lors de la création de votre abonnement. Réessayez dans quelques instants Svp";
                res.status(500).json({ statut: false, message, error: error });
            }); 

    } else {
        message = 'Notifications déjà activées'
        //res.json({ statut: true, Data: [], message: message });
        if ( message = 'Notifications déjà activées') {
            message = 'Notifications Desactivées';
            
        }
        res.json({ statut: true, Data: [], message: message });
        console.log(project)
    }




};
// update 
exports.updateNotif = async (req, res) => {
    //|| !req.body.userId
    if (!req.body.userId || !req.body.statut) {
        return res.status(400).json({
            message: "Erreur. Merci de remplir tous les champs obligatoires ",
        });
    }
    let dataP = {
        statut: req.body.statut
    }
    project = await abonnements.findAndCountAll({ where: { userId: req.body.userId } })
    console.log(project)
    // console.log(project)
    if (project.count != 0) {
        console.log(project)
        project['rows'].forEach(element => {
            AbonnementService.updateabonnements(element.id, dataP)
                .then((Datas) => {
                    const message = "Mofication validée";
                    res.json({ statut: true, Data: Datas, message });
                })
                .catch((error) => {
                    const message = "Aucune modification n'a été apportée";
                    res.status(500).json({ statut: false, message, error: error });
                });
        });
        console.log(project)
    }
    else {
        const message = `Aucune modification n'a été effectué car l'utilisateur n'a pas activé les notifications`;
        return res.json({ statut: true, Data: [], message });

    }
};

exports.deleteAbonnement = async (req, res) => {
    if (!req.body.userId) {
        return res.status(400).json({ message: 'Erreur. Merci de remplir tous les champs obligatoires ' })
    }

    abonnements.findAll({
        where: { userId: req.body.userId },
        attributes: { exclude: ["createdAt", "updatedAt"] },
    })
        .then((respos) => {
            if (!respos) {
                const message = `Oups! un problème a été détecté.`;
                return res.status(404).json({ statut: false, message });
            }

            AbonnementService.deleteAbonnements(respos[0].id)
                .then(user => {

                    const message = "Notifications désactivées";

                    res.json({ statut: true, message, data: user })
                })
                .catch(error => {
                    const message = `Le message n'a pas pu être supprimé. Réessayez dans quelques instants.`
                    res.status(500).json({ statut: false, message, data: error })
                })
        })
        .catch((error) => {
            const message = `une erreur a été déclenchée`;
            res.json({ statut: false, message, error });
        });

}
