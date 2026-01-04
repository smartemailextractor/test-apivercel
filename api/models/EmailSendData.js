const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmailSendDataSchema = new Schema({
    userid: {
        type: String
    },
    campaign_name: {
        type: String
    },
    status: {
        type: String
    },
    template_data: {
        type: Object
    },
    smtp_data: {
        type: Object
    },
    email_send_datas: {
        type: Object
    },
    total_datas: {
        type: Number
    },
    total_success: {
        type: Number
    },
    total_failed: {
        type: Number
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const EmailSendData = mongoose.model('EmailSendData', EmailSendDataSchema);
module.exports = EmailSendData;
