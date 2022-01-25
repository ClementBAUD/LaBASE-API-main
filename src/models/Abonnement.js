const mongoose = require('mongoose');

const abonnement = new mongoose.Schema({
    userId: {type:String, required: true},
    endpoint: { type: String, unique: true},
    keys: {
        p256dh: {type: String},
        auth: {type: String}
    },
    userAgent: {type: String}, // optional, just an additional tracking field
    deviceId: {type: String} // just additional tracking fields
});

module.exports = Abonnement = mongoose.model('notifications', abonnement);