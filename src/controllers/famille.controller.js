/*
* Gestion des magasins avec la creation modification et suppresion 
*/ 
const express = require("express");
const { Famille } = require("../db/sequelize");
const { success, error } = require("../utils/helper.js");
const { ValidationError, UniqueConstraintError } = require('sequelize');
const { Recup ,listeCategorieDuJour} = require("../db/requete");


/**
 * creation d'un magasin
 * 
 */
exports.Famillecreate = async(req, res) => {
    // Aucune information à traiter
    if (!req.body.nom ) {
        return res.status(400).json({ message: 'Erreur. Merci de remplir tous les champs obligatoires ' })
    }

    const data = {
        nom: req.body.nom,
    }
    let userId=parseInt(req.body.IdUser);
  /*  Recup(userId, "familles", "POST").then(resultat => {

        if (resultat[0].res > 0) {*/
            Famille.findOne({
                    where: {
                        nom: req.body.nom
                    }
                })
                .then(user => {
                    if (!user) {

                        Famille.create(data)
                            .then(Data => {
                                const message = `La famille ${req.body.nom} a bien été crée.`;
                                //  user.setPassword(null);

                
                                res.json({ "statut": true, Data,message:message });
                            })
                            .catch(error => {

                                const message = `Un problème a été détecté lors de la création de la fa famille de produit. Réessayez dans quelques instants.`
                                res.status(500).json({ statut: false, message, error: error })
                            })

                    } else {
                       
                        const message = `Le produit n'a pas pu être ajouté. Parce qu'il y a eu une violation de contrainte .`
                        res.status(500).json({ "statut": false, message })
                    }
                })
                .catch(err => {
                    const message = `Le produit n'a pas pu être ajouté car une erreur a été déclenchée.`
                    res.status(500).json({ "statut": false, message, err })
                })

        /*} else {
            let resul = { statut: false, message: "Action non autorisée." }
            return res.status(500).json({ resul });
        }

    }).catch(error => {
        return res.status(403).json({ statut: false, message: "champs manquants dans votre requête ", verification: 'Champs verification manquant', error });
    })*/

}

/**
 * List de famille 
 */
 exports.getListeFamille = async(req,res)=>{
    /*  if (
      !req.body.idUser 
      ) {
      return res.status(400).json({
        message: "Erreur. Merci de remplir tous les champs obligatoires ",
      });
    }
    userId=req.body.idUser 
   
     Recup(userId, "produits", "GET").then(resultat => {
        if (resultat[0].res > 0) { */
    if(req.body.nom) {
  
  
      return Famille.findAndCountAll({ 
        where: {
          nom: req.body.nom,
        }
      })
      .then((famille) => {
        // console.log(famille.rows)
        if (famille.count>0) {
          const message = 'La  famille a bien été récupéré.'
          return res.json({statut:true, message, data: famille })
        } else {
          const message = 'aucun nom de famille ne correspond.'
        return res.json({statut:true, message,famille })
        }
        
      })
    } 
    else {
        Famille.findAndCountAll()
      .then(famille => {
        const message = 'La liste des produits a bien été récupéré.'
        res.json({statut:true, message, data: famille })
      })
      .catch(error => {
        const message = `La liste des produits n'a pas pu être récupéré. 
                         Réessayez dans quelques instants.`
        res.status(500).json({statut:false, message, data: error })
      })
    }
    /*  } else {
         let resul = { statut: false, "message": "Action non autorisée." }
         return res.status(500).json({ resul });
      }
     }).catch(error => {
         return res.status(403).json({ statut: false, message: "champs manquants dans votre requête ", verification: 'Champs verification manquant', error });
     }) */
  }

exports.getListeFamilleClient = async(req,res)=>{
 
          if (!req.body.idmagasin  ) {
            return res.status(400).json({ message: 'Erreur. Merci de remplir tous les champs obligatoires ' })
        }
   
        const idmagasin = parseInt(req.body.idmagasin)
      
        listeCategorieDuJour(idmagasin).then(resulat => {
              
                const message = 'Le resultat a bien été retrouvé.';
    
                res.json({ statut:true, message, data: resulat })
            })
            .catch(error => {
                const message = `Aucun  resultat n'a pas pu être retrouvé. Réessayez dans quelques instants.`
                res.status(500).json({ message, data: error })
            })
   
  }
  