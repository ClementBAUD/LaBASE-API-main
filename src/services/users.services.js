const express = require("express");
const { User } = require("../db/sequelize");
const bcrypt = require('bcrypt')

module.exports = {
    getAll,
    getById,
    updatepassword,
    updateuser,
    delete: _delete
};

async function getAll() {
    return await User.findAll();
}

async function getById(id) {
    return await getUser(id);
}
async function updateuser(id, params) {
    const user = await getUser(id);

    // copy params to user and save
    Object.assign(user, params);
    await user.save();

    return omitHash(user.get());
}

async function updatepassword(id, params) {
    const user = await getUser(id);

    // hash password if it was entered

    // copy params to user and save
    Object.assign(user, params);
    await user.save();

    return omitHash(user.get());
}



async function _delete(id) {
    const user = await getUser(id);
    await user.destroy();
}

// helper functions

async function getUser(id) {
    const user = await User.findByPk(id);
    if (!user) throw "User n'existe pas";
    return user;
}

function omitHash(user) {
    const { hash, ...userWithoutHash } = user;
    return userWithoutHash;
}