const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { uuid } = require('uuidv4');

const ContactListSchema = new Schema({
    userid: {
        type: String
    },
    name: {
        type: String
    },
    cols: {
        type: Object
    },
    rows: {
        type: Object
    },
    total: {
        type: Number
    },

}, { timestamps: true })
const ContactList = mongoose.model('ContactList', ContactListSchema);
module.exports = ContactList;
