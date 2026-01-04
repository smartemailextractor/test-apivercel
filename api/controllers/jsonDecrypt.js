var CryptoJS = require("crypto-js");

exports.decrypt = function (json) {
  var bytes = CryptoJS.AES.decrypt(json, 'smartemailsender05');
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};
