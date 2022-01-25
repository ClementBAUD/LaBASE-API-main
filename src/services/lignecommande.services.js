const express = require("express");
const { ligneCommande } = require("../db/sequelize");

module.exports = {
    getAllLigneCommande,
    updatligneCommande,
    createligneCommand,
    getligneCommand,
    deleteligneCommand
};

async function getAllLigneCommande() {
    return await ligneCommande.findAll();
}


async function updatligneCommande(id, params) {
    const commande = await getligneCommand(id);

    // copy params to magasin and save
    Object.assign(commande, params);
    await commande.save();

    return omitHash(commande.get());
}


async function createligneCommand(params) {
    // copy params to magasin and save
   
    Object.assign(ligneCommande, params);
    await ligneCommande.save();
   
    return omitHash(ligneCommande.get());
}



async function deleteligneCommand(id) {
    const commande = await getligneCommand(id);
    await commande.destroy();
}

// helper functions

async function getligneCommand(id) {
    const commande = await ligneCommande.findByPk(id);
    if (!commande) throw 'magasin not found';
    return commande;
}



function omitHash(commande) {
    const { hash, ...commandeWithoutHash } = commande;
    return commandeWithoutHash;
}