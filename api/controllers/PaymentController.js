const moment = require('moment');
const jsonEncrypt = require('./jsonEncrypt');
const jsonDecrypt = require('./jsonDecrypt');
const User = require("../models/User");
const Payment = require("../models/Payment");

const index = async (req, res) => {
    res.json({ response: false, message: "--" });
    // try {
    //     const plans = await Plan.find().sort({ order: 1 });
    //     res.json({
    //         response: true,
    //         data: jsonEncrypt.encrypt(plans)
    //     });
    // } catch (err) {
    //     res.json({ response: false, message: "An error occurred during viewing user info. Please try again later.", error: err.message });
    // }
}

const view = async (req, res) => {
    try {
        const user_id = req.params.user_id;
        const payment = await Payment.find({ user_id: user_id, status: "Success" }).sort({ createdAt: -1 });
        res.json({ response: true, datas: jsonEncrypt.encrypt(payment) });
    } catch (err) {
        res.json({ response: false, message: "An error occurred during viewing user info. Please try again later.", error: err.message });
    }
}

const tempPayment = async (req, res) => {
    try {
        const data = jsonDecrypt.decrypt(req.body.tmpData)
        const payment = await Payment.create(data)
        res.json({ response: true, message: "Payment successful", data: jsonEncrypt.encrypt(payment) });
    } catch (err) {
        res.json({ response: false, message: "An error occurred during payment. Please try again later.", error: err.message });
    }
}

const getTokenDetails = async (req, res) => {
    try {
        const token = req.params.token;
        const payment = await Payment.findOne({ token: token });
        res.json({ response: true, message: "Payment successful", data: jsonEncrypt.encrypt(payment) });
    } catch (err) {
        res.json({ response: false, message: "An error occurred during getting token details. Please try again later.", error: err.message });
    }
}

module.exports = {
    index, tempPayment, getTokenDetails, view
}
