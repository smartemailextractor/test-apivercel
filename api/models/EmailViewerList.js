const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmailViewerListSchema = new Schema({
    userid: {
        type: String
    },
    email_send_data_id: {
        type: String
    },
    viewer_email: {
        type: String
    },
    smtp_email: {
        type: String
    },
    trackingId: {
        type: String
    }
}, { timestamps: true })

const EmailViewerList = mongoose.model('EmailViewerList', EmailViewerListSchema);
module.exports = EmailViewerList;
