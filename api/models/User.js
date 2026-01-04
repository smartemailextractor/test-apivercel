const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { uuid } = require('uuidv4');
const moment = require('moment');

const UserSchema = new Schema({
  loginid: {
    type: String
  },
  firstActivePlan: {
    type: Boolean,
    default: false
  },
  isBanned: {
    type: Boolean,
    default: false
  },
  name: {
    type: String
  },
  email: {
    type: String
  },
  whatsapp: {
    type: String
  },
  emailverification: {
    type: String,
    default: 'NotVerified'
  },
  emailverificationcode: {
    type: String,
  },
  password: {
    type: String
  },
  company: {
    type: String
  },
  contact: {
    type: String
  },
  country: {
    type: String
  },
  state: {
    type: String
  },
  city: {
    type: String
  },
  type: {
    type: String
  },
  planid: {
    type: String,
    default: '6892fe7442742f641ed636f4'
  },
  planname: {
    type: String,
    default: 'Free'
  },
  plan_speed: {
    type: String,
    default: '1'
  },
  plan_type: {
    type: String,
    default: 'Monthly'
  },
  plan_is_enable_disable_unsubscribe_checkbox: {
    type: Boolean,
    default: false
  },
  plan_is_enable_disable_email_tracking_checkbox: {
    type: Boolean,
    default: false
  },
  plan_sendemails_unsubscribed_contacts: {
    type: Boolean,
    default: false
  },
  plan_max_campaign_per_day: {
    type: Number,
    default: 10
  },
  plan_max_email_send_perday: {
    type: Number,
    default: 10
  },
  plan_max_email_send_per_campaign: {
    type: Number,
    default: 10
  },
  plan_max_contact_limit: {
    type: Number,
    default: 1000
  },
  plan_max_contact_upload_at_once: {
    type: Number,
    default: 10
  },
  plan_max_contact_attribute_limit: {
    type: Number,
    default: 10
  },
  plan_max_template_limit: {
    type: Number,
    default: 10
  },
  plan_max_smtp_limit: {
    type: Number,
    default: 10
  },
  planmaxdevice: {
    type: Number,
    default: 1
  },

  plan_is_enable_email_attachments: {
    type: Boolean,
    default: false
  },
  plan_is_enable_email_attachments_limit: {
    type: Number,
    default: 1
  },
  plan_is_enable_email_attachments_size_limit: {
    type: String,
    default: '1MB'
  },


  planduraction: {
    type: String,
    default: 'Monthly'
  },
  planstart: {
    type: Date,
    default: moment()
  },
  planend: {
    type: Date,
    default: moment().add(12, 'months')
  },
  ip_info: {
    type: Object,
  },
  logintokens: {
    type: Object,
  },
  contactAttributes: {
    type: Array,
  },


  spam_score: {
    type: Number,
    default: 1
  },
  email_provider: {
    type: Array,
    default: ['Gmail']
  },
  template_builder: {
    type: Number,
    default: 1
  }

}, { timestamps: true })

const User = mongoose.model('User', UserSchema);
module.exports = User;
