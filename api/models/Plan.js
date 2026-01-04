const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { uuid } = require('uuidv4');

const PlanSchema = new Schema({

  order: {
    type: Number
  },
  plan_name: {
    type: String
  },
  plan_desc: {
    type: String
  },
  plan_max_device: {
    type: Number
  },
  plan_type: {
    type: String
  },
  plan_speed: {
    type: Number
  },
  plan_validity_in_month: {
    type: Number
  },
  plan_validity_in_text: {
    type: String
  },
  plan_price_inr_main: {
    type: Number
  },
  plan_price_inr_discount: {
    type: Number
  },
  plan_price_usd: {
    type: Number
  },
  plan_price_usd_discount: {
    type: Number
  },





  plan_max_contact_limit: {
    type: Number
  },
  plan_max_contact_upload_at_once: {
    type: Number
  },
  plan_max_email_send_per_campaign: {
    type: Number
  },
  plan_max_email_send_perday: {
    type: Number
  },
  plan_max_smtp_limit: {
    type: Number
  },
  plan_max_template_limit: {
    type: Number
  },
  plan_max_campaign_per_day: {
    type: Number
  },
  plan_max_contact_attribute_limit: {
    type: Number
  },
  plan_is_enable_disable_email_tracking_checkbox: {
    type: Boolean
  },
  plan_is_enable_disable_unsubscribe_checkbox: {
    type: Boolean
  },
  plan_sendemails_unsubscribed_contacts: {
    type: Boolean
  },
  plan_is_enable_email_attachments: {
    type: Boolean
  },
  plan_is_enable_email_attachments_limit: {
    type: Number
  },
  plan_is_enable_email_attachments_size_limit: {
    type: String
  },
  spam_score: {
    type: Number,
  },
  email_provider: {
    type: Array,
  },
  template_builder: {
    type: Number,
  },


  live_progress_tracking: {
    type: Boolean
  },
  advance_campain_analysis: {
    type: Boolean
  },
  advance_email_editor: {
    type: Number
  },
  spam_score_checker: {
    type: String
  },



}, { timestamps: true })

const Plan = mongoose.model('Plan', PlanSchema);
module.exports = Plan;
