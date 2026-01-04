const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { uuid } = require('uuidv4');

const PaymentSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  order_id: {
    type: String
  },
  status: {
    type: String
  },
  plan_details: {
    type: Object
  },
  pay_amount: {
    type: String
  },
  ip_info: {
    type: Object
  },
  token: {
    type: String
  },
  currency: {
    type: String
  }

}, { timestamps: true })
const Payment = mongoose.model('Payment', PaymentSchema);
module.exports = Payment;
