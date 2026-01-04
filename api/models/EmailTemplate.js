const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmailTemplateSchema = new Schema({
  userid: {
    type: String
  },
  name: {
    type: String
  },
  previewtext: {
    type: String
  },
  subject: {
    type: String
  },
  status: {
    type: String,
  },
  body: {
    type: String
  }
}, { timestamps: true })

const EmailTemplate = mongoose.model('EmailTemplate', EmailTemplateSchema);
module.exports = EmailTemplate;
