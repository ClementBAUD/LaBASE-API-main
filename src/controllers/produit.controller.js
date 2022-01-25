const express = require("express");
const { success, error } = require("../utils/helper.js");
const { Recup,listeProduitMAgjour } = require("../db/requete");
const ProduitService = require('../services/produit.services');
const { Produit } = require("../db/sequelize");
const fs = require("fs");
const routeUpload = require("../utils/upload.route");

//routeUpload.routeUpload()

// creation produits 

exports.Createproduits = async (req, res) => {
    // Aucune information à traiter
    if (
      !req.body.titre || !req.body.plu || !req.body.FamilleId
      ) {
      return res.status(400).json({
        message: "Erreur. Merci de remplir tous les champs obligatoires ",
      });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({message:"Veuillez ajouter une image"});
    }
    let ingredient = ""
    if (req.body.ingredient) {
      ingredient = req.body.ingredient;
    } else {
      ingredient = null;
    }
    let valeurNutritionnelle = ""
    if (req.body.valeurNutritionnelle) {
      valeurNutritionnelle = req.body.valeurNutritionnelle;
    } else {
      valeurNutritionnelle = null;
    }

    let allergene = ""
    if (req.body.allergene) {
      allergene = req.body.allergene;
    } else {
      allergene = null;
    }

    let titrecommercial=""
    if (req.body.titrecommercial) {
      titrecommercial = req.body.titrecommercial;
    } else {
      titrecommercial = null;
    }

    
    let sampleFile;
    let uploadPath;

    const prod = {
        titre: req.body.titre,
        plu: req.body.plu,
        ingredient: ingredient,
        allergene: allergene,
        valeurNutritionnelle: valeurNutritionnelle,
        familleId: req.body.FamilleId,
        image: "",
        titre_commercial:titrecommercial,
    };
    sampleFile = req.files;
    
    userId = parseInt(req.body.id)
/* 
     Recup(userId, "produits", "POST").then(resultat => {
        if (resultat[0].res > 0) { */

    Produit.findAll({
      where: {
        plu: req.body.plu,
      },
    })
      .then((produits) => {
        if (produits.length > 0) {
            const message = `Le PLU que vous souhaitez ajouter existe déjà.Veuillez vérifier le PLU.`;
            res.status(500).json({ statut: false, message, produits });
        } else {
            const parts = sampleFile.files.name.split(".");
            const extension = parts[parts.length - 1];
        
            file=  "images" + '-' + Date.now()+'.'+extension;
            // gestion des images 
            uploadPath = './public/images/produits/' +file ;
        
            sampleFile.files.mv(uploadPath, function(err) {
                if (err){
                    console.log(err)
                    const message= "Une erreur s'est produite lors de l'ajout de l'image, veuillez réessayer dans quelques instants "
                    return  res.status(500).json({ statut: false, message, err:err });
                }else{
                    prod.image=routeUpload.routeUpload()+"images/produits/"+file;
                    Produit.create(prod)
                    .then(products => {
                        const message = `Le Produit a bien été crée.`;
                        //  user.setPassword(null);
                     
                            // creation de son status par defaut 
                        res.json({ "statut": true, data:products,message });
                    })
                    .catch(error => {

                        const message = `L' Produit n'a pas pu être crée. Réessayez dans quelques instants.`
                        res.status(500).json({ statut: false, message, error })
                    })

                }
            });
        }
      })
      .catch((err) => {
        const message = `Le produit n'a pas pu être ajouté car une erreur a été déclenchée.`;
        res.status(500).json({ statut: false, message, err });
      });

  
    /*  } else {
         let resul = { statut: false, "message": "Action non autorisée." }
         return res.status(500).json({ resul });
      }
     }).catch(error => {
         return res.status(403).json({ statut: false, message: "champs manquants dans votre requête ", verification: 'Champs verification manquant', error });
     }) */
  };

exports.UploadproduitsImage = async (req, res) => {
    // Aucune information à traiter
    //||!req.body.idUser 
    if (!req.body.id  ) {
      return res.status(400).json({
        message: "Erreur. Merci de remplir tous les champs obligatoires ",
      });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({message:"Veuillez ajouter une image"});
      }
    
    let sampleFile;
    let uploadPath;

    const prod = {
        image: "",
    };
    sampleFile = req.files;
 //   userId = parseInt(req.body.idUser)
    id = parseInt(req.body.id)
/* 
     Recup(userId, "produits", "PUT").then(resultat => {
        if (resultat[0].res > 0) { */

    Produit.findAll({
      where: {
        id: req.body.id,
      },
    })
      .then((produits) => {
        if (produits.length > 0) {
          const parts = sampleFile.files.name.split(".");
          const extension = parts[parts.length - 1];
      
          file=  "images" + '-' + Date.now()+'.'+extension;
          // gestion des images 
          uploadPath = './public/images/produits/' +file ;
            sampleFile.files.mv(uploadPath, function(err) {
                if (err){
                    const message= "Une erreur s'est produite lors de l'ajout de l'image, veuillez réessayer dans quelques instants "
                    return  res.status(500).json({ statut: false, message, err:err });
                }else{
                    prod.image= routeUpload.routeUpload() + "images/produits/" + file;
                   

                    ProduitService.updateProduit(produits[0].id, prod)
                        .then(products => {
                        const message = `Le Produit a bien été modifié.`;
                        //  user.setPassword(null);
                            // creation de son status par defaut 
                        res.json({ "statut": true, data:products });
                    })
                    .catch(error => {

                        const message = `L' Produit n'a pas pu être modifié. Réessayez dans quelques instants.`
                        res.status(500).json({ statut: false, message, error })
                    })

                }
            });
          
        } else {
            const message = `Le PLU que vous souhaitez ajouter n'existe pas.Veuillez vérifier le PLU.`;
            res.status(500).json({ statut: false, message, produits });
        }
      })
      .catch((err) => {
        const message = `Le produit n'a pas pu être ajouté car une erreur a été déclenchée.`;
        res.status(500).json({ statut: false, message, err });
      });

  
    /*  } else {
         let resul = { statut: false, "message": "Action non autorisée." }
         return res.status(500).json({ resul });
      }
     }).catch(error => {
         return res.status(403).json({ statut: false, message: "champs manquants dans votre requête ", verification: 'Champs verification manquant', error });
     }) */
};

exports.Uploadproduits= async (req, res) => {
  // Aucune information à traiter || !req.body.idUser
  if (!req.body.id   ) {
    return res.status(400).json({
      message: "Erreur. Merci de remplir tous les champs obligatoires ",
    });
  }
  let ingredient = ""
  if (req.body.ingredient) {
    ingredient = req.body.ingredient;
  } else {
    ingredient = null;
  }
  let valeurNutritionnelle = ""
  if (req.body.valeurNutritionnelle) {
    valeurNutritionnelle = req.body.valeurNutritionnelle;
  } else {
    valeurNutritionnelle = null;
  }

  let allergene = ""
  if (req.body.allergene) {
    allergene = req.body.allergene;
  } else {
    allergene = null;
  }

  let titrecommercial = ""
  if (req.body.titrecommercial) {
    titrecommercial = req.body.titrecommercial;
  } else {
    titrecommercial = null;
  }
 

  const prod = {
    titre: req.body.titre,
    plu: req.body.plu,
    ingredient: ingredient,
    allergene: allergene,
    titre_commercial: titrecommercial,
    valeurNutritionnelle: valeurNutritionnelle,
    familleId: req.body.FamilleId,
};
  
  userId = parseInt(req.body.idUser)
  

/* 
   Recup(userId, "produits", "PUT").then(resultat => {
      if (resultat[0].res > 0) { */

  Produit.findAll({
    where: {
      id: req.body.id,
    },
  })
    .then((produits) => {
      if (produits.length > 0) {
         
          // gestion des images 
          
                  ProduitService.updateProduit(produits[0].id, prod)
                      .then(products => {
                      const message = `Le Produit a bien été modifié.`;
                      //  user.setPassword(null);
                          // creation de son status par defaut 
                      res.json({ "statut": true, data:products });
                  })
                  .catch(error => {

                      const message = `L' Produit n'a pas pu être modifié. Réessayez dans quelques instants.`
                      res.status(500).json({ statut: false, message, error })
                  })

           
        
      } else {
          const message = `Le PLU que vous souhaitez ajouter n'existe pas.Veuillez vérifier le PLU.`;
          res.status(500).json({ statut: false, message, produits });
      }
    })
    .catch((err) => {
      const message = `Le produit n'a pas pu être ajouté car une erreur a été déclenchée.`;
      res.status(500).json({ statut: false, message, err });
    });


  /*  } else {
       let resul = { statut: false, "message": "Action non autorisée." }
       return res.status(500).json({ resul });
    }
   }).catch(error => {
       return res.status(403).json({ statut: false, message: "champs manquants dans votre requête ", verification: 'Champs verification manquant', error });
   }) */
};

exports.getListeproduits = async(req,res)=>{
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
  if(req.query.id) {

    id=req.query.id
    return Produit.findAndCountAll({ 
      where: {
        id:id,
      },
      include: ["famille"]
    })
    .then((products) => {
      if (products.count > 0) {
        const message = 'La liste des produits a bien été récupéré.'
        return res.json({statut:true, message, data: products })
      } else {
        const message = 'aucun produit ne correspond au plu.'
      return res.json({statut:true, message, data: products })
      }
      
    }).catch(error => {
      const message = `Le produit n'a pas pu être récupéré.Réessayez dans quelques instants.`
      res.status(500).json({statut:false, message, data: error })
    })
  } 
  else {
    Produit.findAndCountAll({ order: ['plu'] ,  include: ["famille"]})
    .then((produits) => {
      // console.log(produits.rows);
      const message = 'La liste des produits a bien été récupéré.'
      res.json({statut:true, message, data: produits })
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

exports.supprimerproduits = async(req,res)=>{
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
        


        /*  } else {
       let resul = { statut: false, "message": "Action non autorisée." }
       return res.status(500).json({ resul });
    }
   }).catch(error => {
       return res.status(403).json({ statut: false, message: "champs manquants dans votre requête ", verification: 'Champs verification manquant', error });
   }) */

}

exports.listeProduitMAgDay = async(req,res)=>{
 
  if (!req.body.idmagasin || !req.body.idfamille  ) {
    return res.status(400).json({ message: 'Erreur. Merci de remplir tous les champs obligatoires ' })
}

const idmagasin = parseInt(req.body.idmagasin)
const idfamille = parseInt(req.body.idfamille)

listeProduitMAgjour(idmagasin,idfamille).then(resulat => {
      
        const message = 'Le resultat a bien été retrouvé.';

        res.json({ statut:true, message, data: resulat })
    })
    .catch(error => {
        const message = `Aucun  resultat n'a pas pu être retrouvé. Réessayez dans quelques instants.`
        res.status(500).json({ message, data: error })
    })

}

exports.getProduitPLu = async(req,res)=>{
  if(req.query.plu) {

    plu=req.query.plu
    // console.log(plu)
    return Produit.findAndCountAll({ 
      where: {
        plu:plu,
      },
      include: ["famille"]
    })
    .then((products) => {
      if (products.count > 0) {
        const message = 'La liste des produits a bien été récupéré.'
        return res.json({statut:true, message, data: products })
      } else {
        const message = 'aucun produit ne correspond au plu.'
      return res.json({statut:true, message, data: products })
      }
      
    }).catch(error => {
      const message = `Le produit n'a pas pu être récupéré.Réessayez dans quelques instants.`
      res.status(500).json({statut:false, message, data: error })
    })
  } 
}