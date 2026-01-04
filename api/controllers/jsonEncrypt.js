var CryptoJS = require("crypto-js");
exports.encrypt = function (json) {
  var ss = CryptoJS.AES.encrypt(JSON.stringify(json), 'smartemailsender05').toString();
  return ss;
};
