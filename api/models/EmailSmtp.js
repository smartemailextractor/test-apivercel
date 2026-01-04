const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmailSmtpSchema = new Schema({
    userid: {
        type: String
    },
    name: {
        type: String
    },
    email: {
        type: String
    },
    app_email: {
        type: String
    },
    password: {
        type: String
    },
    provider: {
        type: String,
    },

    custom_host: {
        type: String
    },
    custom_port: {
        type: String
    },
    custom_secure: {
        type: Boolean
    },
    custom_auth_user: {
        type: String
    },
}, { timestamps: true })

const EmailSmtp = mongoose.model('EmailSmtp', EmailSmtpSchema);
module.exports = EmailSmtp;
