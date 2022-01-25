const express = require("express");
const { parametre } = require("../db/sequelize");


module.exports = {
    updateParametre,
    deleteParametre,
    getParametre
};




async function updateParametre(id, params) {
    const pars = await getParametre(id);
     // copy params to magasin and save
     Object.assign(pars, params);
     await pars.save();
 
     return omitHash(pars.get());
}





async function getParametre(id) {
    
    const pars = await parametre.findByPk(id);

    if (!pars) throw "le parametre n'existe pas";
    return pars;
}

async function deleteParametre(id) {
    const pars = await getParametre(id);
    await pars.destroy();
}

function omitHash(pars) {
    const { hash, ...ParamWithoutHash } = pars;
    return ParamWithoutHash;
}