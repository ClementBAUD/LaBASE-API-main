const express = require("express");
const { MiseADispo } = require("../db/sequelize");

module.exports = {
    updateProduitDispo,
    createProduitDispo,
    deleteMise_ADispo,
    getProduitDispo
};




async function updateProduitDispo(id, params) {
    const Pdispo = await getProduitDispo(id);
    //console.log("update prod")
    //console.log("id,",id)
    //console.log("params",params)
     Object.assign(Pdispo, params);
     await Pdispo.save();
 
     return omitHash(Pdispo.get());
}


async function createProduitDispo(params) {
    // copy params to ProduitDispo and save
    Object.assign(ProduitDispo, params);
    await ProduitDispo.save();

    return omitHash(ProduitDispo.get());
}



async function getProduitDispo(id) {
    
    const produitDispo = await MiseADispo.findByPk(id);

    if (!produitDispo) throw "Produit mise a dispo n'existe pas";
    return produitDispo;
}

async function deleteMise_ADispo(id) {
    const produitDispo = await getProduitDispo(id);
    await produitDispo.destroy();
}

function omitHash(produitDispo) {
    const { hash, ...ProduitDispoWithoutHash } = produitDispo;
    return ProduitDispoWithoutHash;
}