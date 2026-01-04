const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { uuid } = require('uuidv4');

const SendingSpeedSchema = new Schema({
    speed: {
        type: String
    },
    fromTime: {
        type: Number
    },
    toTime: {
        type: Number
    },
    stopAt: {
        type: Number
    },
    stopAtFrom: {
        type: Number
    },
    stopAtTo: {
        type: Number
    },
    message: {
        type: String
    }
}, { timestamps: true })
const SendingSpeed = mongoose.model('SendingSpeed', SendingSpeedSchema);
module.exports = SendingSpeed;
