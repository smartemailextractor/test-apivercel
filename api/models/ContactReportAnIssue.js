const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContactReportAnIssueSchema = new Schema({
    isRead: {
        type: Boolean,
        default: false
    },
    user_id: {
        type: Schema.Types.ObjectId,  // Define the type as ObjectId
        ref: 'User'
    },
    useremail: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    whatsappnumber: {
        type: String,
        required: true
    },
    typeofissue: {
        type: String,
        required: true
    },
    briefdescription: {
        type: String,
        required: true
    },
    reproducesteps: {
        type: String,
    },
    status: {
        type: String,
        default: 'pending'
    }
}, { timestamps: true });

const ContactReportAnIssue = mongoose.model('ContactReportAnIssue', ContactReportAnIssueSchema);
module.exports = ContactReportAnIssue; 