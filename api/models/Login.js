const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { uuid } = require('uuidv4');

const LoginSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,  // Define the type as ObjectId
    ref: 'User'
  },
  ipinfo: {
    type: Object
  },
  systeminfo: {
    type: Object
  },
  logintokens: {
    type: String
  },
  user_email: {
    type: String
  },
}, { timestamps: true })
const Login = mongoose.model('Login', LoginSchema);
module.exports = Login;
