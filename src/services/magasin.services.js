const express = require("express");
const { Magasin } = require("../db/sequelize");

module.exports = {
    getAllMagasin,
    getById,
    updatemagasin,
    createmagasin,
    getMagasin,
    delete: _delete
};

async function getAllMagasin() {
    return await Magasin.findAndCountAll();
}

async function getById(id) {
    return await getMagasin(id);
}
async function updatemagasin(id, params) {
    const magasin = await getMagasin(id);

    // copy params to magasin and save
    Object.assign(magasin, params);
    await magasin.save();

    return omitHash(magasin.get());
}


async function createmagasin(params) {
    // copy params to magasin and save
    Object.assign(magasin, params);
    await magasin.save();

    return omitHash(magasin.get());
}



async function _delete(id) {
    const magasin = await getMagasin(id);
    await magasin.destroy();
}

// helper functions

async function getMagasin(id) {
    const magasin = await Magasin.findByPk(id);
    if (!magasin) throw 'magasin not found';
    return magasin;
}

async function getMagasinEmail(id) {
    const magasin = await Magasin.findByPk(id);
    if (!magasin) throw 'magasin not found';
    return magasin;
}

function omitHash(magasin) {
    const { hash, ...magasinWithoutHash } = magasin;
    return magasinWithoutHash;
}