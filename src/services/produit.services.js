const express = require("express");
const { Produit } = require("../db/sequelize");

module.exports = {
    getAll,
    getById,
    updateProduit,
    deleteProduit,
};

async function getAll() {
    return await Produit.findAll();
}

async function getById(id) {
    return await getProduit(id);
}
async function updateProduit(id, params) {
    const produits = await getProduit(id);

    // copy params to produit and save
    Object.assign(produits, params);
    await produits.save();

    return omitHash(produits.get());
}




async function deleteProduit(id) {
    const produit = await getProduit(id);
    await produit.destroy();
}

// helper functions

async function getProduit(id) {
    const produit = await Produit.findByPk(id);
    if (!produit) throw 'produit non trouvé';
    return produit;
}

function omitHash(produit) {
    const { hash, ...produitWithoutHash } = produit;
    return produitWithoutHash;
}