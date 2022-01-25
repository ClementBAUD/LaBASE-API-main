const express = require("express");
const { commande } = require("../db/sequelize");

module.exports = {
    getAllcommandes,
    updatecommandes,
    createCommand,
    deleteCommand
};

async function getAllcommandes() {
    return await commande.findAll();
}


async function updatecommandes(id, params) {
    const commandes = await getCommand(id);

    // copy params to magasin and save
    Object.assign(commandes, params);
    await commandes.save();

    return omitHash(commandes.get());
}


async function createCommand(params) {
    // copy params to magasin and save
    Object.assign(commandes, params);
    await commandes.save();

    return omitHash(commandes.get());
}



async function deleteCommand(id) {
    const commandes = await getCommand(id);
    await commandes.destroy();
}

// helper functions

async function getCommand(id) {
    const commandes = await commande.findByPk(id);
    if (!commandes) throw 'commande not found';
    return commandes;
}



function omitHash(commandes) {
    const { hash, ...commandesWithoutHash } = commandes;
    return commandesWithoutHash;
}