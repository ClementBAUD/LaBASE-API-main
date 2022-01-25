const express = require("express");
const { Statutcompt } = require("../db/sequelize");
const { success, error } = require("../utils/helper.js");
const { ValidationError, UniqueConstraintError } = require('sequelize');
const { Recup ,listeCategorieDuJour} = require("../db/requete");

/**
 * List de famille 
 */
 exports.getStatutcompte = async(req,res)=>{
 
  
    Statutcompt.findAndCountAll()
      .then(statut => {
        const message = 'La liste des statut compte  a bien été récupéré.'
        res.json({statut:true, message, data: statut })
      })
      .catch(error => {
        const message = `La liste des statut  n'a pas pu être récupéré. 
                         Réessayez dans quelques instants.`
        res.status(500).json({statut:false, message, data: error })
      })
    
    /*  } else {
         let resul = { statut: false, "message": "Action non autorisée." }
         return res.status(500).json({ resul });
      }
     }).catch(error => {
         return res.status(403).json({ statut: false, message: "champs manquants dans votre requête ", verification: 'Champs verification manquant', error });
     }) */
  }
