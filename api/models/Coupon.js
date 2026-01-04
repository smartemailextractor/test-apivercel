const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CouponSchema = new Schema({
  name: {
    type: String
  },
  coupon_name: {
    type: String
  },
  per_user_limit: {
    type: Number
  },
  value_percent: {
    type: Number
  },
  plan_ids: {
    type: Object
  },
}, { timestamps: true })

const Coupon = mongoose.model('Coupon', CouponSchema);
module.exports = Coupon;
