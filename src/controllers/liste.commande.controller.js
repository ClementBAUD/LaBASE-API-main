/**
 * Gestion des commandes
 * Liste des commandes 
 * affichage des commandes par rapport au status
 */
const express = require("express");
const { statutCommande } = require("../db/sequelize");
const { Profil } = require("../db/sequelize");
const { Statutcompt } = require("../db/sequelize");
const { Recup } = require("../db/requete");
const {
    ListeCommandeMagJour,
    nbreComProd,
    nbreComProdDay,
    nbreComMagDay,
    nbreComRecupDay,
    nbreComNovalidpDay,
    ListeCommandeFiltreStatutMag,
    detailcommande,
    ListeCommandeFiltrstatutDATEeMag,
    ListeCommandeJourUser,
    ListeCommandeUser,
    ListeCommandeStatutMag,
    ListeCommandeMagLast,
    nbreEtudiant,
    nbreComDayByUSer,
    nbreComMag,
    nbreComRecup,
    ListeCommandeUserLast,
    ListeCommandeStatutUser
} = require("../db/requete.commande");
const {
    NombreEtudiant,
    NombreCommandeNoRecup,
    NombreCommande,
    nbreComProduit,
    nbreComDernierJours,
    NombreEtudiantStatut
} = require("../db/requete.admin");

// nbre commande non récup
exports.NbCommandeNonRecup = async(req, res) => {

        //req.body.idUser
        if (!req.query.idmagasin) {
            return res.status(400).json({ message: 'Erreur. Merci de remplir tous les champs obligatoires ' })
        }
        const idMag = parseInt(req.query.idmagasin)
            //  const idUser = parseInt(req.body.idUser)
        statutCommande.findOne({
                where: {
                    nom: "Non récupérée"
                }
            })
            .then(commande => {
                //console.log(commande)
                if (!commande) {
                    const message = `un petit problème a été détecté 1 .`
                    res.status(500).json({ "statut": false, message })

                } else {
                    nbreComRecup(idMag, commande.id).then(resulat => {

                            const message = 'Le resultat a bien été retrouvé.';

                            res.json({ statut: true, message, data: resulat })
                        })
                        .catch(error => {
                            const message = `Aucun  resultat n'a pas pu être retrouvé. Réessayez dans quelques instants.`
                            res.status(500).json({ statut: false, message, data: error })
                        })
                }
            })
            .catch(err => {
                const message = `La liste des commandes n'a pas pu être récupérée car une erreur a été déclenchée.`
                res.status(500).json({ "statut": false, message, err })
            })
    }
    // nbre commande no recup day
exports.NbCommandeNonRecupday = async(req, res) => {

    //req.body.idUser
    if (!req.query.idmagasin) {
        return res.status(400).json({ message: 'Erreur. Merci de remplir tous les champs obligatoires ' })
    }
    const idMag = parseInt(req.query.idmagasin)
        //  const idUser = parseInt(req.body.idUser)
    statutCommande.findOne({
            where: {
                nom: "Non récupérée"
            }
        })
        .then(commande => {
            if (!commande) {
                const message = `un petit problème a été détecté 2 .`
                res.status(500).json({ "statut": false, message })

            } else {
                nbreComRecupDay(idMag, commande.id).then(resulat => {

                        const message = 'Le resultat a bien été retrouvé.';

                        res.json({ statut: true, message, data: resulat })
                    })
                    .catch(error => {
                        const message = `Aucun  resultat n'a pas pu être retrouvé. Réessayez dans quelques instants.`
                        res.status(500).json({ statut: false, message, data: error })
                    })
            }
        })
        .catch(err => {
            const message = `La liste des commandes n'a pas pu être récupérée car une erreur a été déclenchée.`
            res.status(500).json({ "statut": false, message, err })
        })
}

// nbre commande en cours du day 
exports.NbCommandeEncours = async(req, res) => {

    //req.body.idUser
    if (!req.query.idmagasin) {
        return res.status(400).json({ message: 'Erreur. Merci de remplir tous les champs obligatoires ' })
    }
    const idMag = parseInt(req.query.idmagasin)
        //  const idUser = parseInt(req.body.idUser)
    statutCommande.findOne({
            where: {
                nom: "En cours"
            }
        })
        .then(commande => {
            if (!commande) {
                const message = `un petit problème a été détecté 3 .`
                res.status(500).json({ "statut": false, message })

            } else {
                nbreComNovalidpDay(idMag, commande.id).then(resulat => {

                        const message = 'Le resultat a bien été retrouvé.';

                        res.json({ statut: true, message, data: resulat })
                    })
                    .catch(error => {
                        const message = `Aucun  resultat n'a pas pu être retrouvé. Réessayez dans quelques instants.`
                        res.status(500).json({ statut: false, message, data: error })
                    })
            }
        })
        .catch(err => {
            const message = `La liste des commandes n'a pas pu être récupérée car une erreur a été déclenchée.`
            res.status(500).json({ "statut": false, message, err })
        })
}

// nbre commande Mag
exports.NbCommande = async(req, res) => {

        //req.body.idUser
        if (!req.query.idmagasin) {
            return res.status(400).json({ message: 'Erreur. Merci de remplir tous les champs obligatoires ' })
        }
        const idMag = parseInt(req.query.idmagasin)
            //  const idUser = parseInt(req.body.idUser)

        nbreComMag(idMag).then(resulat => {

            const message = 'Le resultat a bien été retrouvé.';

            res.json({ statut: true, message, data: resulat })
        }).catch(error => {
            const message = `Aucun  resultat n'a pas pu être retrouvé. Réessayez dans quelques instants.`
            res.status(500).json({ statut: false, message, data: error })
        })


    }
    // nbre commande Mag par jours
exports.NbCommandeDay = async(req, res) => {

    //req.body.idUser
    if (!req.query.idmagasin) {
        return res.status(400).json({ message: 'Erreur. Merci de remplir tous les champs obligatoires ' })
    }
    const idMag = parseInt(req.query.idmagasin)
        //  const idUser = parseInt(req.body.idUser)

    nbreComMagDay(idMag).then(resulat => {

        const message = 'Le resultat a bien été retrouvé.';

        res.json({ statut: true, message, data: resulat })
    }).catch(error => {
        const message = `Aucun  resultat n'a pas pu être retrouvé. Réessayez dans quelques instants.`
        res.status(500).json({ statut: false, message, data: error })
    })


}

// nbre etudiant Mag
exports.NbEtuMag = async(req, res) => {

    //req.body.idUser
    if (!req.query.idmagasin) {
        return res.status(400).json({ message: 'Erreur. Merci de remplir tous les champs obligatoires ' })
    }
    const idMag = parseInt(req.query.idmagasin)
        //  const idUser = parseInt(req.body.idUser)

        Profil.findAll({
            where: { nom: "Etudiant" },
            attributes: { exclude: ["createdAt", "updatedAt"] },
        })
        .then((respos) => {
            let idProfile = respos[0].id;
            Statutcompt.findAll({
                where: { nom: "valider" },
                attributes: { exclude: ["createdAt", "updatedAt"] },
            })
            .then((respo) => {
                let idStatut = respo[0].id;
                if (!respo) {
                    const message = `Oups!un problème a été détecté.`;
                    return res.status(404).json({ statut: false, message });
                }
                nbreEtudiant(idMag,idProfile,idStatut).then(resulat => {
        
                    const message = 'Le resultat a bien été retrouvé.';
            
                    res.json({ statut: true, message, data: resulat })
                }).catch(error => {
                    const message = `Aucun  resultat n'a pas pu être retrouvé. Réessayez dans quelques instants.`
                    res.status(500).json({ statut: false, message, data: error })
                })
            })
            .catch((error) => {
                const message = ` une erreur a été déclenchée`;
                res.json({ statut: false, message, error });
            });
            
        })
        .catch((error) => {
            const message = ` une erreur a été déclenchée`;
            res.json({ statut: false, message, error });
        });

        
}

// nombre de produit 
// nbre produit Mag day 
exports.NbProducommanDay = async(req, res) => {

    //req.body.idUser
    if (!req.query.idmagasin) {
        return res.status(400).json({ message: 'Erreur. Merci de remplir tous les champs obligatoires ' })
    }
    const idMag = parseInt(req.query.idmagasin)

        //  const idUser = parseInt(req.body.idUser)

        statutCommande.findOne({
            where: {
                nom: "Récupérée"
            }
        })
        .then(stCommande => {
            if (!stCommande) {
                const message = `un petit problème a été détecté  4.`
                res.status(500).json({ "statut": false, message })
        
            } else {
                //console.log(stCommande.id)
        
                    nbreComProdDay(idMag,stCommande.id).then(resulat => {
        
                        const message = 'Le resultat a bien été retrouvé.';
                
                        res.json({ statut: true, message, data: resulat })
                    }).catch(error => {
                        const message = `Aucun  resultat n'a pas pu être retrouvé. Réessayez dans quelques instants.`
                        res.status(500).json({ statut: false, message, data: error })
                    })
            }
        })
        .catch(err => {
            const message = `La liste des commandes n'a pas pu être récupérée car une erreur a été déclenchée.`
            res.status(500).json({ "statut": false, message, err })
        })

   


}

// nbre produit Mag 
exports.NbProducommande = async(req, res) => {

    //req.body.idUser
    if (!req.query.idmagasin) {
        return res.status(400).json({ message: 'Erreur. Merci de remplir tous les champs obligatoires ' })
    }
    const idMag = parseInt(req.query.idmagasin)
        //  const idUser = parseInt(req.body.idUser)

    nbreComProd(idMag).then(resulat => {

        const message = 'Le resultat a bien été retrouvé.';

        res.json({ statut: true, message, data: resulat })
    }).catch(error => {
        const message = `Aucun  resultat n'a pas pu être retrouvé. Réessayez dans quelques instants.`
        res.status(500).json({ statut: false, message, data: error })
    })


}

exports.getListeCommandeJourMagasin = async(req, res) => {
    //|| !req.body.idUser
    if (!req.query.idmagasin) {
        return res.status(400).json({ message: 'Erreur. Merci de remplir tous les champs obligatoires ' })
    }
    const idMag = parseInt(req.query.idmagasin)
        //   const idUser = parseInt(req.body.idUser)

    ListeCommandeMagJour(idMag).then(resulat => {

            const message = 'Le resultat a bien été retrouvé.';

            res.json({ statut: true, message, data: resulat })
        })
        .catch(error => {
            const message = `Aucun  resultat n'a pas pu être retrouvé. Réessayez dans quelques instants.`
            res.status(500).json({ statut: false, message, data: error })
        })
}

exports.getListeCommandeJourMagasinparStatut = async(req, res) => {

    //req.body.idUser
    if (!req.query.idmagasin || !req.query.idStatut) {
        return res.status(400).json({ message: 'Erreur. Merci de remplir tous les champs obligatoires ' })
    }
    const idMag = parseInt(req.query.idmagasin)
        //  const idUser = parseInt(req.body.idUser)
    const idStatut = parseInt(req.query.idStatut)
    ListeCommandeFiltreStatutMag(idMag, idStatut).then(resulat => {

            const message = 'Le resultat a bien été retrouvé.';

            res.json({ statut: true, message, data: resulat })
        })
        .catch(error => {
            const message = `Aucun  resultat n'a pas pu être retrouvé. Réessayez dans quelques instants.`
            res.status(500).json({ statut: false, message, data: error })
        })
}

// liste des commande passer
exports.getListeCommandeLast = async(req, res) => {

    //req.body.idUser
    if (!req.query.idmagasin) {
        return res.status(400).json({ message: 'Erreur. Merci de remplir tous les champs obligatoires ' })
    }
    const idMag = parseInt(req.query.idmagasin)
        //  const idUser = parseInt(req.body.idUser)
    ListeCommandeMagLast(idMag).then(resulat => {

            const message = 'Le resultat a bien été retrouvé.';

            res.json({ statut: true, message, data: resulat })
        })
        .catch(error => {
            const message = `Aucun  resultat n'a pas pu être retrouvé. Réessayez dans quelques instants.`
            res.status(500).json({ statut: false, message, data: error })
        })
}

// liste des commande passer par user
exports.getListeCommandeLastUser = async(req, res) => {

    //req.body.idUser
    if (!req.query.iduser) {
        return res.status(400).json({ message: 'Erreur. Merci de remplir tous les champs obligatoires ' })
    }
    const iduser = parseInt(req.query.iduser)
        //  const idUser = parseInt(req.body.idUser)
    ListeCommandeUserLast(iduser).then(resulat => {

            const message = 'Le resultat a bien été retrouvé.';

            res.json({ statut: true, message, data: resulat })
        })
        .catch(error => {
            const message = `Aucun  resultat n'a pas pu être retrouvé. Réessayez dans quelques instants.`
            res.status(500).json({ statut: false, message, data: error })
        })
}

// liste des commande passer
exports.getListeCommandeNonRecupMAg = async(req, res) => {

    //req.body.idUser
    if (!req.query.idmagasin) {
        return res.status(400).json({ message: 'Erreur. Merci de remplir tous les champs obligatoires ' })
    }
    const idMag = parseInt(req.query.idmagasin)
        //  const idUser = parseInt(req.body.idUser)
    statutCommande.findOne({
            where: {
                nom: "Non récupérée"
            }
        })
        .then(commande => {
            if (!commande) {
                const message = `un petit problème a été détecté 5.`
                res.status(500).json({ "statut": false, message })

            } else {
                ListeCommandeStatutMag(idMag, commande.id).then(resulat => {

                        const message = 'Le resultat a bien été retrouvé.';

                        res.json({ statut: true, message, data: resulat })
                    })
                    .catch(error => {
                        const message = `Aucun  resultat n'a pas pu être retrouvé. Réessayez dans quelques instants.`
                        res.status(500).json({ statut: false, message, data: error })
                    })
            }
        })
        .catch(err => {
            const message = `La liste des commandes n'a pas pu être récupérée car une erreur a été déclenchée.`
            res.status(500).json({ "statut": false, message, err })
        })
}

// liste des commande non recup user
exports.getListeCommandeNonRecup = async(req, res) => {

    //req.body.idUser
    if (!req.query.iduser) {
        return res.status(400).json({ message: 'Erreur. Merci de remplir tous les champs obligatoires ' })
    }
    const iduser = parseInt(req.query.iduser)
        //  const idUser = parseInt(req.body.idUser)
    statutCommande.findOne({
            where: {
                nom: "Non récupérée"
            }
        })
        .then(commande => {
            if (!commande) {
                const message = `un petit problème a été détecté 6.`
                res.status(500).json({ "statut": false, message })

            } else {
                ListeCommandeStatutUser(iduser, commande.id).then(resulat => {

                        const message = 'Le resultat a bien été retrouvé.';

                        res.json({ statut: true, message, data: resulat })
                    })
                    .catch(error => {
                        const message = `Aucun  resultat n'a pas pu être retrouvé. Réessayez dans quelques instants.`
                        res.status(500).json({ statut: false, message, data: error })
                    })
            }
        })
        .catch(err => {
            const message = `La liste des commandes n'a pas pu être récupérée car une erreur a été déclenchée.`
            res.status(500).json({ "statut": false, message, err })
        })
}

//liste des commandes par et statut et date pour les magasin s
exports.getListeCommandeFiltrstatutDate = async(req, res) => {
    //|| !req.body.idUser
    if (!req.body.idmagasin || !req.body.idStatut || !req.body.datedebut || !req.body.datefin) {
        return res.status(400).json({ message: 'Erreur. Merci de remplir tous les champs obligatoires ' })
    }
    const idMag = parseInt(req.body.idmagasin)
        // const idUser = parseInt(req.body.idUser)
    const idStatut = parseInt(req.body.idStatut)
    const datedebut = req.body.datedebut
    const datefin = req.body.datefin
    ListeCommandeFiltrstatutDATEeMag(idMag, idStatut, datedebut, datefin).then(resulat => {

            const message = 'Le resultat a bien été retrouvé.';

            res.json({ statut: true, message, data: resulat })
        })
        .catch(error => {
            const message = `Aucun  resultat n'a pas pu être retrouvé. Réessayez dans quelques instants.`
            res.status(500).json({ statut: false, message, data: error })
        })
}

//Liste Commande Jour User

exports.getListeCommandeUserJour = async(req, res) => {
    if (!req.body.idUser) {
        return res.status(400).json({ message: 'Erreur. Merci de remplir tous les champs obligatoires ' })
    }

    const idUser = parseInt(req.body.idUser)

    ListeCommandeJourUser(idUser).then(resulat => {

            const message = 'Le resultat a bien été retrouvé.';

            res.json({ statut: true, message, data: resulat })
        })
        .catch(error => {
            const message = `Aucun  resultat n'a pas pu être retrouvé. Réessayez dans quelques instants.`
            res.status(500).json({ statut: false, message, data: error })
        })
}

// liste des commande  par user
exports.getListeCommandeUsers = async(req, res) => {
    if (!req.body.idUser || !req.body.idStatut) {
        return res.status(400).json({ message: 'Erreur. Merci de remplir tous les champs obligatoires ' })
    }

    const idUser = parseInt(req.body.idUser)
    const idStatut = parseInt(req.body.idStatut)

    ListeCommandeUser(idUser, idStatut).then(resulat => {

            const message = 'Le resultat a bien été retrouvé.';

            res.json({ statut: true, message, data: resulat })
        })
        .catch(error => {
            const message = `Aucun  resultat n'a pas pu être retrouvé. Réessayez dans quelques instants.`
            res.status(500).json({ statut: false, message, data: error })
        })
}

//nombre commande par user 

exports.getnbreComDayByUSer = async(req, res) => {
        if (!req.query.idUser) {
            return res.status(400).json({ message: 'Erreur. Merci de remplir tous les champs obligatoires ' })
        }

        const idUser = parseInt(req.query.idUser)

        nbreComDayByUSer(idUser).then(resulat => {
                // console.log(resulat)
                const message = 'Le resultat a bien été retrouvé.';

                res.json({ statut: true, message, data: resulat })
            })
            .catch(error => {
                const message = `Aucun  resultat n'a pas pu être retrouvé. Réessayez dans quelques instants.`
                res.status(500).json({ statut: false, message, data: error })
            })
    }
    // detail de commande 

exports.detailcommandes = async(req, res) => {

    // !req.body.idUser
    if (!req.query.id || !req.query.idmagasin) {
        return res.status(400).json({ message: 'Erreur. Merci de remplir tous les champs obligatoires ' })
    }

    //const idUser = parseInt(req.param('idUser'))
    const idcom = req.query.id
    const idmagasin = parseInt(req.query.idmagasin)

    detailcommande(idcom, idmagasin).then(resulat => {

            const message = 'Le resultat a bien été retrouvé.';
            // console.log(resulat)
            res.json({ statut: true, message, data: resulat })
        })
        .catch(error => {
            const message = `Aucun  resultat n'a pas pu être retrouvé. Réessayez dans quelques instants.`
            res.status(500).json({ statut: false, message, data: error })
        })
}

//partie admin 

// nbre commande effectuer
exports.NombreCommandeAdmin = async(req, res) => {
    NombreCommande().then(resulat => {

        const message = 'Le resultat a bien été retrouvé.';

        res.json({ statut: true, message, data: resulat })
    }).catch(error => {
        const message = `Aucun  resultat n'a pas pu être retrouvé. Réessayez dans quelques instants.`
        res.status(500).json({ statut: false, message, data: error })
    })

}

// nombre de produit donnée 
exports.NombreProdAdmin = async(req, res) => {
    statutCommande.findOne({
            where: {
                nom: "Récupérée"
            }
        })
        .then(commande => {
            if (!commande) {
                const message = `un petit problème a été détecté 7.`
                res.status(500).json({ "statut": false, message })

            } else {
                
                nbreComProduit(commande.id).then(resulat => {

                    const message = 'Le resultat a bien été retrouvé.';
                    // console.log(resulat[0].nbre)
                    if (resulat[0].nbre == null) {
                        // resc=0
                        return res.json({ statut: true, message, data: 0 })
                    }
                    return res.json({ statut: true, message, data: resulat[0].nbre })


                }).catch(error => {
                    const message = `Aucun  resultat n'a pas pu être retrouvé. Réessayez dans quelques instants.`
                    res.status(500).json({ statut: false, message, data: error })
                })

            }
        }).catch(err => {
            const message = `La liste des commandes n'a pas pu être récupérée car une erreur a été déclenchée.`
            res.status(500).json({ "statut": false, message, err })
        })

}

// nombre etudiant  ayant un statut en attente

exports.nbreEtudiantEnAttent = async(req, res) => {
    //  const idUser = parseInt(req.body.idUser)
    console.log("on regarde les étudiants en attente")
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
                    let idStatut = respo[0].id;
                    console.log("id profile : ",idProfile)
                    console.log("id statuts : ",idStatut)
                    NombreEtudiantStatut(idProfile, idStatut).then(resulat => {
                    console.log("retour résultat SQL",resulat)
                        const message = 'Le resultat a bien été retrouvé.';

                        res.json({ statut: true, message, data: resulat })
                    }).catch(error => {
                        const message = `Aucun  resultat n'a pas pu être retrouvé. Réessayez dans quelques instants.`
                        res.status(500).json({ statut: false, message, data: error })
                    })

                })
                .catch((error) => {
                    const message = ` une erreur a été déclenchée`;
                    res.json({ statut: false, message, error });
                });
        })
        .catch((error) => {
            const message = ` une erreur a été déclenchée`;
            res.json({ statut: false, message, error });
        });

}

// nombre totale des etudiants
exports.nbreEtudiantAll = async(req, res) => {
    //  const idUser = parseInt(req.body.idUser)

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
            NombreEtudiant(idProfile).then(resulat => {

                const message = 'Le resultat a bien été retrouvé.';

                res.json({ statut: true, message, data: resulat })
            }).catch(error => {
                const message = `Aucun  resultat n'a pas pu être retrouvé. Réessayez dans quelques instants.`
                res.status(500).json({ statut: false, message, data: error })
            })

        })
        .catch((error) => {
            const message = ` une erreur a été déclenchée`;
            res.json({ statut: false, message, error });
        });


}

// nombre commande non recupére 
exports.ListeCommandeNonRecup = async(req, res) => {


    statutCommande.findOne({
            where: {
                nom: "Non récupérée"
            }
        })
        .then(commande => {
            //console.log(commande)
            if (!commande) {
                const message = `un petit problème a été détecté 8.`
                res.status(500).json({ "statut": false, message })

            } else {
                NombreCommandeNoRecup(commande.id).then(resulat => {

                        const message = 'Le resultat a bien été retrouvé.';

                        res.json({ statut: true, message, data: resulat })
                    })
                    .catch(error => {
                        const message = `Aucun  resultat n'a pas pu être retrouvé. Réessayez dans quelques instants.`
                        res.status(500).json({ statut: false, message, data: error })
                    })
            }
        })
        .catch(err => {
            const message = `La liste des commandes n'a pas pu être récupérée car une erreur a été déclenchée.`
            res.status(500).json({ "statut": false, message, err })
        })
}


// nombre commande non recupére 
exports.ListeCommandeGraph = async(req, res) => {


    statutCommande.findOne({
            where: {
                nom: "Récupérée"
            }
        })
        .then(commande => {
            if (!commande) {
                const message = `un petit problème a été détecté 9.`
                res.status(500).json({ "statut": false, message })

            } else {
                nbreComDernierJours(commande.id).then(resulat => {

                        const message = 'Le resultat a bien été retrouvé.';

                        res.json({ statut: true, message, data: resulat })
                    })
                    .catch(error => {
                        const message = `Aucun  resultat n'a pas pu être retrouvé. Réessayez dans quelques instants.`
                        res.status(500).json({ statut: false, message, data: error })
                    })
            }
        })
        .catch(err => {
            const message = `La liste des commandes n'a pas pu être récupérée car une erreur a été déclenchée.`
            res.status(500).json({ "statut": false, message, err })
        })
}