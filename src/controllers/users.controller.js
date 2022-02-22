const express = require("express");
const router = express.Router();
const { User } = require("../db/sequelize");
const { Profil } = require("../db/sequelize");
const { UserMagasin } = require("../db/sequelize");
const { Magasin } = require("../db/sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const privateKey = require("../auth/private_key");
const { Statutcompt } = require("../db/sequelize");
const { success, error } = require("../utils/helper.js");
const { ValidationError, UniqueConstraintError } = require("sequelize");
const { Op } = require("sequelize");
const { Recup, listeUserMAg, listeUserAll, DetailUser, listeUserProfil, nbMagasinUser, listeUsersAdmin } = require("../db/requete");
const { EnvoiMailValidationCompte } = require("../services/mail.services");
const userService = require("../services/users.services");
const usersMagasins = require("../services/usersMagsins.services");

const routeUpload = require("../utils/upload.route");


// inscription

exports.register = (req, res) => {
    // Aucune information à traiter
    if (!req.body.email ||
        !req.body.password ||
        !req.body.nom
    ) {
        return res
            .status(400)
            .json({
                statut: false,
                message: "Erreur. Merci de remplir tous les champs obligatoires ",
            });
    }
    // recuperation des champs optionnel 

    let filess = req.files;
    if (filess) {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ statut: false, message: "Veuillez ajouter une image" });
        }
    } else {
        filess = null

    }
    let tel = "";

    if (req.body.tel) {
        tel = req.body.tel;
    } else {
        tel = null;
    }
    // prenom
    let prenom = "";
    if (req.body.prenom) {
        prenom = req.body.prenom;
    } else {
        prenom = null;
    }
    //adresse
    let adresse = ""
    if (req.body.adresse) {
        adresse = req.body.adresse;
    } else {
        adresse = null;
    }
    //adresse
    let idMagasin = ""
    if (req.body.idMagasin) {
        idMagasin = req.body.idMagasin;
    } else {
        idMagasin = null;
    }

    // verification des champs files optionnel 
    let sampleFile;
    let uploadPath;

    Statutcompt.findAll({
            where: { nom: "attente" },
            attributes: { exclude: ["createdAt", "updatedAt"] },
        })
        .then((respo) => {
            if (!respo) {
                const message = `Oups!un problème a été détecté.`;
                return res.status(404).json({ statut: false, message });
            }
            Profil.findAll({
                    where: { nom: "Etudiant" },
                    attributes: { exclude: ["createdAt", "updatedAt"] },
                })
                .then((respos) => {
                    if (!respos) {
                        const message = `Oups! un problème a été détecté.`;
                        return res.status(404).json({ statut: false, message });
                    }
                    let idProfile = respos[0].id;
                    sampleFile = req.files;
                    let id = respo[0].id;
                    const userData = {
                        email: req.body.email,
                        password: req.body.password,
                        prenom: prenom,
                        nom: req.body.nom,
                        adresse: adresse,
                        certi_scolarite: "",
                        statutcomptId: id,
                        tel: tel,
                        profilId: idProfile
                    };


                    if (idMagasin != null) {
                        idMagasins = parseInt(req.body.idMagasin)
                        Magasin.findAll({
                            where: { id: idMagasins },
                            attributes: { exclude: ["createdAt", "updatedAt"] },
                        }).then((reslats) => {
                            if (!reslats) {
                                const message = `Oups!un problème a été détecté.`;
                                const message1 = `Oups!auncun magasin n'est disponible.`;
                                return res.status(404).json({ statut: false, message, message1 });
                            } else {
                                idM = reslats[0].id;
                                if (filess) {

                                    User.findOne({
                                            where: {
                                                email: req.body.email,
                                            },
                                        })
                                        .then((user) => {
                                            if (!user) {
                                                bcrypt.hash(req.body.password, 10, (err, hash) => {
                                                    userData.password = hash;
                                                    const parts = sampleFile.files.name.split(".");
                                                    const extension = parts[parts.length - 1];

                                                    file = "images" + "-" + Date.now() + "." + extension;
                                                    // gestion des images
                                                    console.log(file,"____1")
                                                    uploadPath = "./public/images/certificats/" + file;
                                                    userData.certi_scolarite = routeUpload.routeUpload() + "images/certificats/" + file;

                                                    sampleFile.files.mv(uploadPath, function(err) {
                                                        if (err) {
                                                            //console.log(err);
                                                            const message =
                                                                "Une erreur s'est produite lors de l'ajout de l'image, veuillez réessayer dans quelques instants ";
                                                            return res
                                                                .status(500)
                                                                .json({ statut: false, message, err: err });
                                                        } else {
                                                            User.create(userData)
                                                                .then((user) => {
                                                                    const message = `L'utilisateur ${req.body.nom} a bien été crée.`;
                                                                    //  user.setPassword(null);
                                                                    const userData = {
                                                                        id: user.id,
                                                                        email: user.email,
                                                                        prenom: user.prenom,
                                                                        nom: user.nom,
                                                                        statut: user.StatutcomptId,
                                                                        ProfilId: user.ProfilId,
                                                                        idMagasin: idMagasins
                                                                    };
                                                                    // creation de son status par defaut
                                                                    dataUserMag = {
                                                                        userId: user.id,
                                                                        magasinId: idM
                                                                    }
                                                                    UserMagasin.create(dataUserMag).then((userresult) => {
                                                                            res.json({ statut: true, userData, message: message });
                                                                        })
                                                                        .catch((error) => {
                                                                            // déclanger un mail pour signaler cette anomalie
                                                                            const message = `L'utilisateur a été créé, mais il n'a pas été rattaché à un magasin. `;
                                                                            res.status(500).json({ statut: false, message, error });
                                                                        });


                                                                })
                                                                .catch((error) => {
                                                                    const message = `L' utilisateur n'a pas pu être ajouté. Réessayez dans quelques instants.`;
                                                                    res.status(500).json({ statut: false, message, error });
                                                                });
                                                        }
                                                    });



                                                });
                                            } else {

                                                const message = `Un compte existe déjà avec cette adresse e-mail .`;
                                                res.status(500).json({ statut: false, message, error });
                                            }
                                        })
                                        .catch((err) => {
                                            const message = `L'utilisateur n'a pas pu être ajouté car une erreur a été déclenchée.`;
                                            res.status(500).json({ statut: false, message, err });
                                        });
                                } else {
                                    User.findOne({
                                            where: {
                                                email: req.body.email,
                                            },
                                        })
                                        .then((user) => {
                                            if (!user) {
                                                bcrypt.hash(req.body.password, 10, (err, hash) => {
                                                    userData.password = hash;

                                                    User.create(userData)
                                                        .then((user) => {
                                                            const message = `L'utilisateur ${req.body.nom} a bien été crée.`;
                                                            //  user.setPassword(null);
                                                            const userData = {
                                                                id: user.id,
                                                                email: user.email,
                                                                prenom: user.prenom,
                                                                nom: user.nom,
                                                                statut: user.StatutcomptId,
                                                                ProfilId: user.ProfilId
                                                            };

                                                            dataUserMag = {
                                                                userId: user.id,
                                                                magasinId: idM
                                                            }

                                                            UserMagasin.create(dataUserMag)
                                                                .then((userresult) => {
                                                                    res.json({ statut: true, userData, message: message });
                                                                })
                                                                .catch((error) => {
                                                                    // déclanger un mail pour signaler cette anomalie
                                                                    const message = `L'utilisateur a été créé, mais il n'a pas été rattaché à un magasin. `;
                                                                    res.status(500).json({ statut: false, message, error });
                                                                });


                                                        })
                                                        .catch((error) => {
                                                            const message = `L' utilisateur n'a pas pu être ajouté. Réessayez dans quelques instants.`;
                                                            res.status(500).json({ statut: false, message, error });
                                                        });
                                                });
                                            } else {

                                                const message = `Un compte existe déjà avec cette adresse e-mail .`;
                                                res.status(500).json({ statut: false, message, error });
                                            }
                                        })
                                        .catch((err) => {
                                            const message = `L'utilisateur n'a pas pu être ajouté car une erreur a été déclenchée.`;
                                            res.status(500).json({ statut: false, message, err });
                                        });
                                }


                            }
                        }).catch((error) => {
                            const message = `Une erreur a été déclenchée car le Le magasin que vous avez sélectionné a un petit problème  `;
                            res.json({ statut: false, message, error: error });
                        });
                    } else {

                        User.findOne({
                                where: {
                                    email: req.body.email,
                                },
                            })
                            .then((user) => {
                                if (!user) {
                                    bcrypt.hash(req.body.password, 10, (err, hash) => {
                                        userData.password = hash;

                                        User.create(userData)
                                            .then((user) => {
                                                const message = `L'utilisateur ${req.body.nom} a bien été crée.`;
                                                //  user.setPassword(null);
                                                const userData = {
                                                    id: user.id,
                                                    email: user.email,
                                                    prenom: user.prenom,
                                                    nom: user.nom,
                                                    statut: user.StatutcomptId,
                                                    ProfilId: user.ProfilId
                                                };

                                                res.json({ statut: true, userData, message: message });

                                            })
                                            .catch((error) => {
                                                const message = `L' utilisateur n'a pas pu être ajouté. Réessayez dans quelques instants.`;
                                                res.status(500).json({ statut: false, message, error });
                                            });
                                    });
                                } else {

                                    const message = `Un compte existe déjà avec cette adresse e-mail .`;
                                    res.status(500).json({ statut: false, message, error });
                                }
                            })
                            .catch((err) => {
                                const message = `L'utilisateur n'a pas pu être ajouté car une erreur a été déclenchée.`;
                                res.status(500).json({ statut: false, message, err });
                            });

                    }
                })
                .catch((error) => {
                    const message = ` L'utilisateur n'a pas pu être ajouté car une erreur a été déclenchée`;
                    res.json({ statut: false, message, error });
                });


        })
        .catch((error) => {
            const message = ` L'utilisateur n'a pas pu être ajouté car une erreur a été déclenchée`;
            res.json({ statut: false, message, error });
        });
};

// inscription 

exports.inscription = (req, res) => {
    // Aucune information à traiter
    if (!req.body.email ||
        !req.body.password ||
        !req.body.nom
    ) {
        return res
            .status(400)
            .json({
                statut: false,
                message: "Erreur. Merci de remplir tous les champs obligatoires ",
            });
    }
    // recuperation des champs optionnel 

    let filess = req.files;
    if (filess) {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ statut: false, message: "Veuillez ajouter une image" });
        }
    } else {
        filess = null

    }
    let tel = "";

    if (req.body.tel) {
        tel = req.body.tel;
    } else {
        tel = null;
    }
    // prenom
    let prenom = "";
    if (req.body.prenom) {
        prenom = req.body.prenom;
    } else {
        prenom = null;
    }
    //adresse
    let adresse = ""
    if (req.body.adresse) {
        adresse = req.body.adresse;
    } else {
        adresse = null;
    }


    // verification des champs files optionnel 
    let sampleFile;
    let uploadPath;

    Statutcompt.findAll({
            where: { nom: "attente" },
            attributes: { exclude: ["createdAt", "updatedAt"] },
        })
        .then((respo) => {
            if (!respo) {
                const message = `Oups!un problème a été détecté.`;
                return res.status(404).json({ statut: false, message });
            }
            Profil.findAll({
                    where: { nom: "Etudiant" },
                    attributes: { exclude: ["createdAt", "updatedAt"] },
                })
                .then((respos) => {
                    if (!respos) {
                        const message = `Oups! un problème a été détecté.`;
                        return res.status(404).json({ statut: false, message });
                    }
                    let idProfile = respos[0].id;
                    sampleFile = req.files;
                    let id = respo[0].id;
                    const userData = {
                        email: req.body.email,
                        password: req.body.password,
                        prenom: prenom,
                        nom: req.body.nom,
                        adresse: adresse,
                        certi_scolarite: "",
                        statutcomptId: id,
                        tel: tel,
                        profilId: idProfile
                    };

                    if (filess) {

                        User.findOne({
                                where: {
                                    email: req.body.email,
                                },
                            })
                            .then((user) => {
                                if (!user) {
                                    bcrypt.hash(req.body.password, 10, (err, hash) => {
                                        userData.password = hash;
                                        const parts = sampleFile.files.name.split(".");
                                        const extension = parts[parts.length - 1];

                                        file = "images" + "-" + Date.now() + "." + extension;
                                        // gestion des images
                                        console.log(file,"____2")
                                        uploadPath = "./public/images/certificats/" + file;
                                        userData.certi_scolarite = routeUpload.routeUpload() + "images/certificats/" + file;

                                        sampleFile.files.mv(uploadPath, function(err) {
                                            if (err) {
                                                //console.log(err);
                                                const message =
                                                    "Une erreur s'est produite lors de l'ajout de l'image, veuillez réessayer dans quelques instants ";
                                                return res
                                                    .status(500)
                                                    .json({ statut: false, message, err: err });
                                            } else {
                                                User.create(userData)
                                                    .then((user) => {
                                                        const message = `L'utilisateur ${req.body.nom} a bien été crée.`;
                                                        //  user.setPassword(null);
                                                        const userData = {
                                                            id: user.id,
                                                            email: user.email,
                                                            prenom: user.prenom,
                                                            nom: user.nom,
                                                            statut: user.StatutcomptId,
                                                            ProfilId: user.ProfilId,
                                                        };

                                                        res.json({ statut: true, userData, message: message });


                                                    })
                                                    .catch((error) => {
                                                        const message = `L' utilisateur n'a pas pu être ajouté. Réessayez dans quelques instants.`;
                                                        res.status(500).json({ statut: false, message, error });
                                                    });
                                            }
                                        });



                                    });
                                } else {

                                    const message = `Un compte existe déjà avec cette adresse e-mail .`;
                                    res.status(500).json({ statut: false, message, error });
                                }
                            })
                            .catch((err) => {
                                const message = `L'utilisateur n'a pas pu être ajouté car une erreur a été déclenchée.`;
                                res.status(500).json({ statut: false, message, err });
                            });

                    } else {
                        const message = `merci d'ajouter une image.`;
                        res.status(500).json({ statut: false, message, err });
                    }

                })
                .catch((error) => {
                    const message = ` L'utilisateur n'a pas pu être ajouté car une erreur a été déclenchée`;
                    res.json({ statut: false, message, error });
                });


        })
        .catch((error) => {
            const message = ` L'utilisateur n'a pas pu être ajouté car une erreur a été déclenchée`;
            res.json({ statut: false, message, error });
        });
};

exports.selectMagasin = (req, res) => {

    if (!req.body.email || !req.body.magasinId) {
        return res.status(400).json({ statut: false, message: "Erreur. Merci de remplir tous les champs obligatoires " });
    }

    User.findOne({
            where: {
                email: req.body.email,
            },
        })
        .then((user) => {
            // console.log(user.id)
            if (!user) {
                const message = `L'utilisateur demandé n'existe pas.`;
                return res.status(404).json({ statut: false, message });
            }


            dataUserMag = {
                userId: user.id,
                magasinId: req.body.magasinId
            }
            UserMagasin.create(dataUserMag)
                .then((userresult) => {
                    // Envoi d'un mail aux admin pour indiquer qu'un compte nécessite une validation
                    let resultMail = EnvoiMailValidationCompte(`${user.prenom} ${user.nom}`);
                    const message = resultMail ? "Validation de l'inscription. " : "Echec de l'envoi de mail.";
                    let resARenvoyer = resultMail ? true : false;
                    res.json({ statut: resARenvoyer, data: userresult, message: message });
                })
                .catch((error) => {
                    // Envoi d'un mail pour signaler cette anomalie
                    const message = `ce compte n'appartient à aucun utilisateur. `;
                    res.status(500).json({ statut: false, message, error });
                });


        })
        .catch((err) => {
            const message = `L'utilisateur n'a pas pu être ajouté car une erreur a été déclenchée.`;
            res.status(500).json({ statut: false, message, err });
        });


}

// user déjà inscrit a un magasin 
exports.DejaInscrit = (req, res) => {

    if (!req.body.userId) {
        return res
            .status(400)
            .json({
                message: "Erreur. Merci de remplir tous les champs obligatoires ",
            });
    }

    UserMagasin.findOne({
        where: { userId: req.body.userId },
        attributes: {
            exclude: ["createdAt", "updatedAt"],
        },
    }).then((resultat) => {
        return res.json({ statut: true, data: resultat });
    }).catch((error) => {
        const message = `L'utilisateur n'a pas pu être connecté. Réessayez dans quelques instants ou contactez un administrateur.`;
        console.info(message)
        res.status(500).json({ statut: false, message, data: error });
    });

}

// // login
// exports.login1 = (req, res) => {
//     if (!req.body.email || !req.body.password) {
//         return res
//             .status(400)
//             .json({
//                 message: "Erreur. Merci de remplir tous les champs obligatoires ",
//             });
//     }

//     User.findOne({
//             where: { email: req.body.email },
//             attributes: {
//                 exclude: ["createdAt", "updatedAt", "statutcomptId", "profilId"],
//             },
//             include: ["statutcompt", "profil"],
//         })
//         .then((user) => {
//             //  console.log(user)
//             if (!user) {
//                 const message = `L'utilisateur demandé n'existe pas.`;
//                 return res.status(404).json({ statut: false, message });
//             }

//             //    console.log(user);
//             return bcrypt
//                 .compare(req.body.password, user.password)
//                 .then((isPasswordValid) => {
//                     if (!isPasswordValid) {
//                         const message = `Le mot de passe est incorrect.`;
//                         return res.status(401).json({ statut: false, message });
//                     }

//                     // Générer un jeton JWT valide pendant 24 heures.
//                     const token = jwt.sign({ userId: user.id }, privateKey, {
//                         expiresIn: "24h",
//                     });
//                     if (user.profil.nom == "Etudiant") {
//                         UserMagasin.findOne({
//                                 where: { userId: user.id },
//                                 attributes: {
//                                     exclude: ["createdAt", "updatedAt"],
//                                 },
//                             })
//                             .then((resultat) => {
//                                 const message = `L'utilisateur a été connecté avec succès`;
//                                 //  console.log(user);
//                                 const userss = {
//                                     id: user.id,
//                                     nom: user.nom,
//                                     prenom: user.prenom,
//                                     email: user.email,
//                                     tel: user.tel,
//                                     satutcompte: user.statutcompt.nom,
//                                     profile: user.profil.nom,
//                                     idmagasin: resultat.magasinId,
//                                     magasin: resultat.nom,
//                                     certificat: user.certi_scolarite,
//                                     dateExp: user.dateExp
//                                 };
//                                 return res.json({ statut: true, data: userss, token });
//                             }).catch((error) => {
//                                 console.log('magasin pas selectioner')
//                                 const message = `L'utilisateur n'a pas pu être connecté. Réessayez dans quelques instants ou contactez un administrateur.`;
//                                 res.status(500).json({ message, data: error });
//                             });

//                     } else {
//                         const userss = {
//                             id: user.id,
//                             nom: user.nom,
//                             prenom: user.prenom,
//                             email: user.email,
//                             tel: user.tel,
//                             satutcompte: user.statutcompt.nom,
//                             profile: user.profil.nom,
//                         };
//                         return res.json({ statut: true, data: userss, token });
//                     }


//                 });
//         })
//         .catch((error) => {
//             const message = `L'utilisateur n'a pas pu être connecté. Réessayez dans quelques instants ou contactez un administrateur. `;
//             res.status(500).json({ message, data: error });
//         });
// };
// login
exports.login = (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res
            .status(400)
            .json({
                message: "Erreur. Merci de remplir tous les champs obligatoires ",
            });
    }

    User.findOne({
            where: { email: req.body.email },
            attributes: {
                exclude: ["createdAt", "updatedAt", "statutcomptId", "profilId"],
            },
            include: ["statutcompt", "profil"],
        })
        .then((user) => {
            //  console.log(user)
            if (!user) {
                const message = `L'utilisateur demandé n'existe pas.`;
                return res.status(404).json({ statut: false, message });
            }

            //    console.log(user);
            return bcrypt
                .compare(req.body.password, user.password)
                .then((isPasswordValid) => {
                    if (!isPasswordValid) {
                        const message = `Le mot de passe est incorrect.`;
                        return res.status(401).json({ statut: false, message });
                    }

                    // Générer un jeton JWT valide pendant 24 heures.
                    const token = jwt.sign({ userId: user.id }, privateKey, {
                        expiresIn: "24h",
                    });

                    if (user.profil.nom != 'Etudiant') {
                        const userss = {
                            id: user.id,
                            nom: user.nom,
                            prenom: user.prenom,
                            email: user.email,
                            tel: user.tel,
                            satutcompte: user.statutcompt.nom,
                            profile: user.profil.nom,
                            certificat: user.certi_scolarite,
                            dateExp: user.dateExp
                        };
                        return res.json({ statut: true, data: userss, token });
                    }

                    nbMagasinUser(user.id).then(resNbMag => {
                        let nbMag = resNbMag[0].nb;
                        // Si pas de magasin renseigné, on met 0 dans idMagasin
                        if (nbMag == 0){
                            const message = `L'utilisateur a été connecté avec succès`;
                            const userss = {
                                id: user.id,
                                nom: user.nom,
                                prenom: user.prenom,
                                email: user.email,
                                tel: user.tel,
                                satutcompte: user.statutcompt.nom,
                                profile: user.profil.nom,
                                idmagasin: 0,
                                magasin: "aucun",
                                certificat: user.certi_scolarite,
                                dateExp: user.dateExp
                            };
                            return res.json({ statut: true, data: userss, token });
                        }
                        // Si un magasin a été trouvé, on laisse faire la requête à Sequelize
                        UserMagasin.findOne({
                            where: { userId: user.id },
                            attributes: {
                                exclude: ["createdAt", "updatedAt"],
                            },
                        })
                        .then((resultat) => {
                            const message = `L'utilisateur a été connecté avec succès`;
                            //  console.log(user);
                            const userss = {
                                id: user.id,
                                nom: user.nom,
                                prenom: user.prenom,
                                email: user.email,
                                tel: user.tel,
                                satutcompte: user.statutcompt.nom,
                                profile: user.profil.nom,
                                idmagasin: resultat.magasinId,
                                magasin: resultat.nom,
                                certificat: user.certi_scolarite,
                                dateExp: user.dateExp
                            };
                            return res.json({ statut: true, data: userss, token });
                        }).catch((error) => {
                            const message = `L'utilisateur n'a pas pu être connecté. Réessayez dans quelques instants ou contactez un administrateur.`;
                            // add text 
                            res.status(500).json({ message, data: error });
                        });
                    })
                    .catch(error => {
                        const message = `Aucun  resultat n'a pas pu être retrouvé. Réessayez dans quelques instants.`
                        res.status(500).json({ statut: false, message, data: error })
                    })
                });
        })
        .catch((error) => {
            const message = `L'utilisateur n'a pas pu être connecté. Réessayez dans quelques instants ou contactez un administrateur. `;
              // add text 
            res.status(500).json({ message, data: error });
        });
};

// UPDATE user sans password
exports.updateUser = async(req, res) => {
    // Aucune information à traiter
    if (!req.body.idUser ||
        !req.body.nom ||
        !req.body.prenom ||
        !req.body.email ||
        !req.body.tel

    ) {
        return res
            .status(400)
            .json({
                message: "Erreur. Merci de remplir tous les champs obligatoires ",
            });
    }
    userId = req.body.idUser;
    const userData = {
        prenom: req.body.prenom,
        nom: req.body.nom,
        tel: req.body.tel,
        email: req.body.email,


    };
    /*   const resv = Recup(userId, "users", "PUT")
          .then((resultat) => {
              if (resultat[0].res > 0) { */
    userService
        .updateuser(userId, userData)
        .then((user) => {
            const userData = {
                id: user.id,
                email: user.email,
                prenom: user.prenom,
                nom: user.nom,
                certi_scolarite: user.certi_scolarite,
            };
            const message = "Un utilisateur a bien été modifié.";

            res.json({ statut: true, message, data: userData });
        })
        .catch((error) => {
            const message = `L'utilisateur n'a pas pu être modifié. Réessayez dans quelques instants.`;
            res.status(500).json({ statut: false, message, data: error });
        });
    /*      } else {
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

// UPDATE user certificat de scolarité 
exports.updateCertificat = async(req, res) => {
    // Aucune information à traiter
    if (!req.body.idUser) {
        return res
            .status(400)
            .json({
                message: "Erreur. Merci de remplir tous les champs obligatoires ",
            });
    }

    userId = parseInt(req.body.idUser);
    const userData = {
        certi_scolarite: "",
    };

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ message: "Veuillez ajouter une image" });
    }
    let sampleFile;
    let uploadPath;
    /*   Recup(userId, "users", "PUT")
          .then((resultat) => { 
              if (resultat[0].res > 0) {*/
    sampleFile = req.files;
    const parts = sampleFile.files.name.split(".");
    const extension = parts[parts.length - 1];

    file = "images" + "-" + Date.now() + "." + extension;
    // gestion des images
    uploadPath = "./public/images/certificats/" + file;
    userData.certi_scolarite = routeUpload.routeUpload() + "images/certificats/" + file;


    sampleFile.files.mv(uploadPath, function(err) {
        if (err) {
            //  console.log(err);
            const message =
                "Une erreur s'est produite lors de l'ajout de l'image, veuillez réessayer dans quelques instants ";
            return res
                .status(500)
                .json({ statut: false, message, err: err });
        } else {

            userService
                .updateuser(userId, userData)
                .then((user) => {
                    const userData = {
                        id: user.id,
                        email: user.email,
                        prenom: user.prenom,
                        nom: user.nom,
                        certi_scolarite: user.certi_scolarite,
                    };
                    const message = "Votre certificat de scolarité a bien été mise à jour.";

                    res.json({ statut: true, message, data: userData });
                })
                .catch((error) => {
                    const message = `L'utilisateur n'a pas pu être modifié. Réessayez dans quelques instants.`;
                    res.status(500).json({ statut: false, message, data: error });
                });
        }
    });

    /* } /*else {
                let resul = { statut: false, message: "Action non autorisée." };
                return res.status(500).json({ resul });
            }
        })
       /*  .catch((error) => {
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

// upadate user passwword procedure
exports.RestePassword = async(req, res) => {
    // Aucune information à traiter
    if (!req.body.email) {
        return res
            .status(400)
            .json({
                message: "Erreur. Merci de remplir tous les champs obligatoires ",
            });
    }

    User.findOne({
            where: { email: req.body.email },
            attributes: {
                exclude: ["certi_scolarite", "createdAt", "updatedAt", "statutcomptId"],
            },
            include: ["statutcompt"],
        })
        .then((user) => {
            if (!user) {
                const message = `L'utilisateur demandé n'existe pas.`;
                return res.status(404).json({ message });
            }

            const secret = privateKey;

            const payload = {
                id: user.id,
            };

            const token = jwt.sign(payload, secret, { expiresIn: "15m" });
            // const link = `http://localhost:3000/reset-password/${user.id}/${token}`;
            // Some how sent the link to the users email
            //  console.log(link);
            // const resultat = { 'id_user': user.id, 'token': token }
            return res.json({ statut: true, data: user.id, token });

            //    res.send('Password reset link has been sent to ur email...');
        })
        .catch((error) => {
            const message = `une erreur a été détectée. Réessayez dans quelques instants.`;
            res.status(500).json({ message, data: error });
        });
};

// Update user password procedure
exports.updateUserPassword = async(req, res) => {
    // Aucune information à traiter
    if (!req.body.password || !req.body.token) {
        return res
            .status(400)
            .json({
                statut: false,
                message: "Erreur. Veuillez remplir tous les champs obligatoires ",
            });
    }

    const userData = {
        password: req.body.password,
    };
    token = req.body.token;
    const secret = privateKey;
    //console.log(secret)
    // console.log("secret")
    // console.log(token)
        /* try {
            const payload = jwt.verify(token, secret);
            // validate password and password2 should match
            // we can simply find the user with the payload email and id  and finally update with new password
            // alwasy hash the password before saving

          
        } catch (error) {
            res.status(400).json({ statut: false, error: error.message });
        } */

    User.findOne({
            where: { id: req.body.id },
            attributes: {
                exclude: ["certi_scolarite", "createdAt", "updatedAt", "statutcomptId"],
            },
            include: ["statutcompt"],
        })
        .then((user) => {
            // console.log(user)
            if (!user) {
                const message = `L'utilisateur demandé n'existe pas.`;
                return res.status(404).json({ message });
            }

            bcrypt.hash(req.body.password, 10, (err, hash) => {
                userData.password = hash;
                userService
                    .updatepassword(user.id, userData)
                    .then((users) => {
                        const userData = {
                            id: users.id,
                            email: users.email,
                            prenom: users.prenom,
                            nom: users.nom,
                            certi_scolarite: users.certi_scolarite,
                        };
                        const message = "Votre mot de passe a bien été modifié.";

                        res.json({ statut: true, message, data: userData });
                    })
                    .catch((error) => {
                        const message = `Votre mot de passe n'a pas pu être modifié. Réessayez dans quelques instants.`;
                        res.status(500).json({ statut: false, message, data: error });
                    });
            });

        })
        .catch((error) => {
            const message = `une erreur a été détectée. Réessayez dans quelques instants.`;
            res.status(500).json({ message, data: error });
        });
};

// update statut compte user et la date d'experiation du compte via l'admin
exports.updateStatutComptes = async(req, res) => {
    // Aucune information à traiter
    if (!req.body.idUser || !req.body.id || !req.body.StatutcomptId || !req.body.dateExp) {
        return res
            .status(400)
            .json({
                message: "Erreur. Merci de remplir tous les champs obligatoires ",
            });
    }
    userId = req.body.id;
    const userData = {
        statutcomptId: req.body.StatutcomptId,
        dateExp: req.body.dateExp,
    };
    let id = parseInt(req.body.id);
    /* Recup(userId, "users", "PUT")
         .then((resultat) => {
             if (resultat[0].res > 0) { */
    userService
        .updateuser(id, userData)
        .then((user) => {
            const userData = {
                id: user.id,
                email: user.email,
                prenom: user.prenom,
                nom: user.nom,
                certi_scolarite: user.certi_scolarite,
                statutcomptId: user.statutcompt,
            };
            const message = "Un utilisateur a bien été modifié.";

            res.json({ statut: true, message, data: userData });
        })
        .catch((error) => {
            const message = `Le utilisateur n'a pas pu être modifié. Réessayez dans quelques instants.`;
            res.status(500).json({ statut: false, message, data: error });
        });
    /*  } else {
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


exports.restrinUser = async(req, res) => {
    // Aucune information à traiter
    if (!req.body.id) {
        return res
            .status(400)
            .json({
                message: "Erreur. Merci de remplir tous les champs obligatoires ",
            });
    }
    console.log("restrin")
}


// upadate statut compte user via l'admin
exports.deleteUser = async(req, res) => {
    // Aucune information à traiter
    if (!req.body.id) {
        return res
            .status(400)
            .json({
                message: "Erreur. Merci de remplir tous les champs obligatoires ",
            });
    }
    userId = req.body.id;
    /* 
        const resv = Recup(userId, "users", "DELETE")
            .then((resultat) => {
                if (resultat[0].res > 0) { */
    userService
        .delete(userId)
        .then((user) => {
            const message = `l'utilisateur a bien été suprimé.`;

            res.json({ statut: true, message, data: user });
        })
        .catch((error) => {
            const message = `Le utilisateur n'a pas pu être modifié. Réessayez dans quelques instants.`;
            res.status(500).json({ statut: false, message, data: error });
        });
    /*  } else {
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

// get user

exports.getDetailUser = (req, res) => {

    if (!req.query.id) {
        return res
            .status(400)
            .json({
                message: "Erreur. Veuillez remplir tous les champs obligatoires ",
            });
    }
    //idprofile
    let idUser = parseInt(req.query.id)

    let id = parseInt(idUser)
    DetailUser(id).then(resultat => {
        if (resultat) {
            // console.log(resultat)
            res.json({ statut: true, data: resultat });
        } else {
            let resul = { statut: true, "message": "aucune utilisateur .", resultat }
            return res.json({ resul });
        }
    }).catch(error => {
        return res.status(403).json({ statut: false, message: "Un probleme est survenu. Réessayez dans quelques instants.", error });
    })

}

exports.getUserbyEmail = (req, res) => {
    if (!req.body.email) {
        return res.status(400).json({
            message: "Erreur. Merci de remplir tous les champs obligatoires ",
        });
    }
    User.findOne({
            where: { email: req.body.email },
            attributes: {
                exclude: ["certi_scolarite", "createdAt", "updatedAt", "statutcomptId", "profilId", "password"],
            },
            include: ["satutcompt", "profil"],
        }).then((user) => {
            if (!user) {
                const message = `L'utilisateur demandé n'existe pas.`;
                return res.status(404).json({ statut: false, message });
            }
            const message = "Un utilisateur a bien été retrouvé.";
            res.json({ statut: true, message, data: user });

        })
        .catch((error) => {
            const message = `L'utilisateur n'a pas pu être retrouvé. Réessayez dans quelques instants.`;
            res.status(500).json({ message, data: error });
        });
};

// all user 
exports.getUserAll = (req, res) => {
    User.findAndCountAll({

            attributes: {
                exclude: ["certi_scolarite", "createdAt", "updatedAt", "statutcomptId", "profilId", "password"],
            },
            include: ["satutcompt", "profil"],
        }).then((user) => {
            if (!user) {
                const message = `L'utilisateur demandé n'existe pas.`;
                return res.status(404).json({ statut: false, message });
            }
            const message = "Un utilisateur a bien été retrouvé.";
            res.json({ statut: true, message, data: user });

        })
        .catch((error) => {
            const message = `L'utilisateur n'a pas pu être retrouvé. Réessayez dans quelques instants.`;
            res.status(500).json({ message, data: error });
        });
};

// liste des user par 
exports.listeUserAllMag = async(req, res) => {
    if (!req.body.idmagasin) {
        return res
            .status(400)
            .json({
                message: "Erreur. Veuillez remplir tous les champs obligatoires ",
            });
    }
    //idprofile
    let idmagasin = parseInt(req.body.idmagasin)
    Profil.findAll({
            where: { nom: "Etudiant" },
            attributes: { exclude: ["createdAt", "updatedAt"] },
        })
        .then((respos) => {
            if (!respos) {
                const message = `Oups! un problème a été détecté.`;
                return res.status(404).json({ statut: false, message });
            }
            let idprofile = parseInt(respos[0].id)
            listeUserMAg(idmagasin, idprofile).then(resultat => {
                if (resultat.length > 0) {
                    const message = `les produit dispo du jour.`;

                    res.json({ statut: true, message, data: resultat });
                } else {
                    let resul = { statut: true, "message": "aucune produit dispo .", resultat }
                    return res.json({ resul });
                }
            }).catch(error => {
                return res.status(403).json({ statut: false, message: "Un probleme est survenu. Réessayez dans quelques instants.", error });
            })
        })
        .catch((error) => {
            const message = `Une erreur a été déclenchée car le Le magasin que vous avez sélectionné a un petit problème  `;
            res.json({ statut: false, message, error: error });
        });

}

exports.listeUserAll = async(req, res) => {

    //idprofile
    Profil.findAll({
            where: { nom: "Etudiant" },
            attributes: { exclude: ["createdAt", "updatedAt"] },
        })
        .then((respos) => {
            if (!respos) {
                const message = `Oups! un problème a été détecté.`;
                return res.status(404).json({ statut: false, message });
            }
            let idprofile = parseInt(respos[0].id)
                //    console.log(idprofile);
            listeUserAll(idprofile).then(resultat => {
                //   console.log(resultat);

                const message = `liste des utilisateurs .`;

                res.json({ statut: true, message, data: resultat });

            }).catch(error => {
                return res.status(403).json({ statut: false, message: "Un probleme est survenu. Réessayez dans quelques instants.", error });
            })
        })
        .catch((error) => {
            const message = `Une erreur a été déclenchée `;
            res.json({ statut: false, message, error: error });
        });

}

exports.listeUserProfileMagasinAll = async(req, res) => {

    //idprofile
    Profil.findAll({
            where: { nom: "Magasin" },
            attributes: { exclude: ["createdAt", "updatedAt"] },
        })
        .then((respos) => {
            if (!respos) {
                const message = `Oups! un problème a été détecté.`;
                return res.status(404).json({ statut: false, message });
            }
            let idprofile = parseInt(respos[0].id)
                //  console.log(idprofile);
            listeUserProfil(idprofile).then(resultat => {

                const message = `liste des utilisateurs .`;

                res.json({ statut: true, message, data: resultat });

            }).catch(error => {
                return res.status(403).json({ statut: false, message: "Un probleme est survenu. Réessayez dans quelques instants.", error });
            })
        })
        .catch((error) => {
            const message = `Une erreur a été déclenchée `;
            res.json({ statut: false, message, error: error });
        });

}

exports.registerUSer = (req, res) => {
    // Aucune information à traiter
    if (!req.body.email ||
        !req.body.password ||
        !req.body.nom
    ) {
        return res
            .status(400)
            .json({
                statut: false,
                message: "Erreur. Merci de remplir tous les champs obligatoires ",
            });
    }
    // recuperation des champs optionnel 


    // prenom
    let prenom = "";
    if (req.body.prenom) {
        prenom = req.body.prenom;
    } else {
        prenom = null;
    }


    Statutcompt.findAll({
            where: { nom: "attente" },
            attributes: { exclude: ["createdAt", "updatedAt"] },
        })
        .then((respo) => {
            if (!respo) {
                const message = `Oups!un problème a été détecté.`;
                return res.status(404).json({ statut: false, message });
            }
            Profil.findAll({
                    where: { nom: "Magasin" },
                    attributes: { exclude: ["createdAt", "updatedAt"] },
                })
                .then((respos) => {
                    if (!respos) {
                        const message = `Oups! un problème a été détecté.`;
                        return res.status(404).json({ statut: false, message });
                    }
                    let idProfile = respos[0].id;
                    sampleFile = req.files;
                    let id = respo[0].id;
                    const userData = {
                        email: req.body.email,
                        password: req.body.password,
                        nom: req.body.nom,
                        statutcomptId: id,
                        profilId: idProfile
                    };

                    User.findOne({
                            where: {
                                email: req.body.email,
                            },
                        })
                        .then((user) => {
                            if (!user) {
                                bcrypt.hash(req.body.password, 10, (err, hash) => {
                                    userData.password = hash;

                                    User.create(userData)
                                        .then((user) => {
                                            const message = `L'utilisateur ${req.body.nom} a bien été crée.`;
                                            //  user.setPassword(null);
                                            const userData = {
                                                id: user.id,
                                                email: user.email,
                                                prenom: user.prenom,
                                                nom: user.nom,
                                                statut: user.StatutcomptId,
                                                ProfilId: user.ProfilId
                                            };
                                            res.json({ statut: true, userData, message: message });


                                        })
                                        .catch((error) => {
                                            const message = `L' utilisateur n'a pas pu être ajouté. Réessayez dans quelques instants.`;
                                            res.status(500).json({ statut: false, message, error });
                                        });
                                });
                            } else {

                                const message = `Un compte existe déjà avec cette adresse e-mail .`;
                                res.status(500).json({ statut: false, message, error });
                            }
                        })
                        .catch((err) => {
                            const message = `L'utilisateur n'a pas pu être ajouté car une erreur a été déclenchée.`;
                            res.status(500).json({ statut: false, message, err });
                        });



                })
                .catch((error) => {
                    const message = ` L'utilisateur n'a pas pu être ajouté car une erreur a été déclenchée`;
                    res.json({ statut: false, message, error });
                });


        })
        .catch((error) => {
            const message = ` L'utilisateur n'a pas pu être ajouté car une erreur a été déclenchée`;
            res.json({ statut: false, message, error });
        });
};



exports.changeMaga = async(req, res) => {
    // Aucune information à traiter
    if (!req.body.UserId || !req.body.idMag) {
        return res.status(400).json({ statut: false, message: "Erreur. Merci de remplir tous les champs obligatoires " });
    }

    UserMagasin.findAll({
            where: { userId: req.body.UserId },
        }).then((resultat) => {
            message = "le changement a été validé"
            data = {
                "userId": req.body.UserId,
                "magasinId": req.body.idMag
            }
            usersMagasins
                .updateuserMag(resultat[0].id, data)
                .then((result) => {

                    const message = "Un utilisateur a bien été modifié.";

                    res.json({ statut: true, message, data: result });
                })
                .catch((error) => {
                    const message = `L'utilisateur n'a pas pu être modifié. Réessayez dans quelques instants.`;
                    res.status(500).json({ statut: false, message, data: error });
                });

        })
        .catch((error) => {
            // déclanger un mail pour signaler cette anomalie
            const message = `L'utilisateur a été créé, mais il n'a pas été rattaché à un magasin. `;
            res.status(500).json({ statut: false, message, error });
        });

};

exports.ChangeStatutComptes = async(req, res) => {
    // Aucune information à traiter
    if (!req.body.idUser || !req.body.id || !req.body.StatutcomptId || !req.body.dateExp) {
        return res
            .status(400)
            .json({
                message: "Erreur. Merci de remplir tous les champs obligatoires ",
            });
    }
    userId = req.body.id;
    const userData = {
        statutcomptId: req.body.StatutcomptId,
        dateExp: req.body.dateExp,
    };
    let id = parseInt(req.body.id);
    /* Recup(userId, "users", "PUT")
         .then((resultat) => {
             if (resultat[0].res > 0) { */
    userService
        .updateuser(id, userData)
        .then((user) => {
            const userData = {
                id: user.id,
                email: user.email,
                prenom: user.prenom,
                nom: user.nom,
                certi_scolarite: user.certi_scolarite,
                statutcomptId: user.statutcompt,
            };
            const message = "Un utilisateur a bien été modifié.";

            res.json({ statut: true, message, data: userData });
        })
        .catch((error) => {
            const message = `Le utilisateur n'a pas pu être modifié. Réessayez dans quelques instants.`;
            res.status(500).json({ statut: false, message, data: error });
        });
    /*  } else {
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

// update statut compte user et la date d'experiation du compte via l'admin
exports.updateStatutCompteRenouvellement = async(req, res) => {
    // Aucune information à traiter
    if (!req.body.idUser || !req.body.dateExp) {
        return res
            .status(400)
            .json({
                message: "Erreur. Merci de remplir tous les champs obligatoires ",
            });
    }

    Statutcompt.findOne({
            where: {
                nom: "renouvellement"
            }
        })
        .then(cmpte => {
            console.log(cmpte)
            if (!cmpte) {
                const message = `un petit problème a été détecté .`
                res.status(500).json({ "statut": false, message })

            } else {
                const userData = {
                    statutcomptId: cmpte.id,
                    dateExp: req.body.dateExp,
                };
                id = parseInt(req.body.idUser)
                userService.updateuser(id, userData)
                    .then((user) => {
                        const userData = {
                            id: user.id,
                            email: user.email,
                            prenom: user.prenom,
                            nom: user.nom,
                            certi_scolarite: user.certi_scolarite,
                            statutcomptId: user.statutcompt,
                        };
                        const message = "Un utilisateur a bien été modifié.";

                        res.json({ statut: true, message, data: userData });
                    })
                    .catch((error) => {
                        const message = `Le utilisateur n'a pas pu être modifié. Réessayez dans quelques instants.`;
                        res.status(500).json({ statut: false, message, data: error });
                    });
            }
        })
        .catch(err => {
            const message = `La liste des statut compte n'a pas pu être récupérée car une erreur a été déclenchée.`
            res.status(500).json({ "statut": false, message, err })
        })



};

// Retourne la liste des emails des administrateurs
exports.listeMailsAdmin = () => {
    listeUsersAdmin().then((users) => {
        let lstMails = "";

        users.forEach(user => {
            // console.log("userMail:" +user.email);
            lstMails+=user.email+";";
        });

        return lstMails;
    }).catch(error => {
        console.log("Erreur:"+error);
    })

    // User.findAll({
    //         where: {
    //             profilId: 1,
    //             statutcomptId: 1
    //         }
    //     }).then((user) => {
    //         console.log("mail:"+user.email);
    //         lstMails+=user.email+";"
    //     });

    // console.log(lstMails);
}




exports.deleteUser = async(req, res) => {
    // Aucune information à traiter
    if (!req.body.idUser || !req.body.dateExp) {
        return res
            .status(400)
            .json({
                message: "Erreur. Merci de remplir tous les champs obligatoires ",
            });
    }

    Statutcompt.findOne({
            where: {
                nom: "renouvellement"
            }
        })
        .then(cmpte => {
            console.log(cmpte)
            if (!cmpte) {
                const message = `un petit problème a été détecté .`
                res.status(500).json({ "statut": false, message })

            } else {
                const userData = {
                    statutcomptId: cmpte.id,
                    dateExp: req.body.dateExp,
                };
                id = parseInt(req.body.idUser)
                userService.updateuser(id, userData)
                    .then((user) => {
                        const userData = {
                            id: user.id,
                            email: user.email,
                            prenom: user.prenom,
                            nom: user.nom,
                            certi_scolarite: user.certi_scolarite,
                            statutcomptId: user.statutcompt,
                        };
                        const message = "Un utilisateur a bien été modifié.";

                        res.json({ statut: true, message, data: userData });
                    })
                    .catch((error) => {
                        const message = `Le utilisateur n'a pas pu être modifié. Réessayez dans quelques instants.`;
                        res.status(500).json({ statut: false, message, data: error });
                    });
            }
        })
        .catch(err => {
            const message = `La liste des statut compte n'a pas pu être récupérée car une erreur a été déclenchée.`
            res.status(500).json({ "statut": false, message, err })
        })



};