const express = require("express");
const { UserMagasin } = require("../db/sequelize");

module.exports = {
    getAll,
    getById,
    updateuserMag,

};

async function getAll() {
    return await UserMagasin.findAll();
}

async function getById(id) {
    return await getUserMag(id);
}
async function updateuserMag(id, params) {
    const userMags = await getUserMag(id);

    // copy params to userMag and save
    Object.assign(userMags, params);
    await userMags.save();

    return omitHash(userMags.get());
}



async function getUserMag(id) {
    const userMag = await UserMagasin.findByPk(id);
    if (!userMag) throw 'identifantion non trouvé';
    return userMag;
}



function omitHash(userMag) {
    const { hash, ...userMagWithoutHash } = userMag;
    return userMagWithoutHash;
}