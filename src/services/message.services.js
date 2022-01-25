const express = require("express");
const { message } = require("../db/sequelize");

module.exports = {
    getAllMessage,
    getById,
    updateMessage,
    createMessage,
    getMessage,
    delete: _delete
};

async function getAllMessage() {
    return await message.findAndCountAll();
}

async function getById(id) {
    return await getMessage(id);
}
async function updateMessage(id, params) {
    const Message = await getMessage(id);

    // copy params to Message and save
    Object.assign(Message, params);
    await Message.save();

    return omitHash(Message.get());
}


async function createMessage(params) {
    // copy params to Message and save
    Object.assign(Message, params);
    await Message.save();

    return omitHash(Message.get());
}



async function _delete(id) {
    const Message = await getMessage(id);
    await Message.destroy();
}

// helper functions

async function getMessage(id) {
    const Message = await message.findByPk(id);
    if (!Message) throw 'message not found';
    return Message;
}

async function getMessageEmail(id) {
    const Message = await message.findByPk(id);
    if (!Message) throw 'message not found';
    return Message;
}

function omitHash(Message) {
    const { hash, ...MessageWithoutHash } = Message;
    return MessageWithoutHash;
}