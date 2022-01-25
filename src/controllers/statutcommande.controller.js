const express = require("express");
const { statutCommande } = require("../db/sequelize");


/**
 * List 
 */
exports.getStatutcommande = async(req, res) => {


    statutCommande.findAndCountAll({order: [['ordre', 'ASC']]})
        .then(statut => {
            const message = 'La liste des statuts commande a bien été récupéré.'
            res.json({ statut: true, message, data: statut })
        })
        .catch(error => {
            const message = `La liste des statuts commande n'a pas pu être récupéré. 
                         Réessayez dans quelques instants.`
            res.status(500).json({ statut: false, message, data: error })
        })

    /*  } else {
         let resul = { statut: false, "message": "Action non autorisée." }
         return res.status(500).json({ resul });
      }
     }).catch(error => {
         return res.status(403).json({ statut: false, message: "champs manquants dans votre requête ", verification: 'Champs verification manquant', error });
     }) */
}