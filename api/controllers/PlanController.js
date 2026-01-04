const moment = require('moment');
const jsonEncrypt = require('./jsonEncrypt');
const jsonDecrypt = require('./jsonDecrypt');
const User = require("../models/User");
const Plan = require("../models/Plan");
const Payment = require("../models/Payment");

const cusupdate = async (req, res) => {
    // try {
    //     const result = await Plan.updateMany({}, {
    //         $set: {
    //             spam_score: 1,
    //             email_provider: ['Gmail'],
    //             template_builder: 1
    //         }
    //     });
    //     res.json({ response: true, message: `Updated ${result.modifiedCount} plans.` });
    // } catch (err) {
    //     res.json({ response: false, message: 'Failed to update plans', error: err.message });
    // }


    try {
        const plans = await Plan.findOneAndUpdate({ _id: '6892ff8e42742f641ed636f7' }, {
            $set: {
                email_provider: ['Gmail', 'Google Workspace (G Suite)', 'Outlook', 'Yahoo', 'Hotmail', 'Amazon SES', 'Zoho', 'Godaddy', 'Yandex', 'FastMail', 'iCloud', 'Mailgun', 'Mailjet']
            }
        });
        res.json({ response: true, data: jsonEncrypt.encrypt(plans) });
    } catch (err) {
        res.json({ response: false, message: "An error occurred during viewing user info. Please try again later.", error: err.message });
    }
}

const index = async (req, res) => {
    try {
        const plans = await Plan.find().sort({ order: 1 });
        res.json({
            response: true,
            data: jsonEncrypt.encrypt(plans)
        });
    } catch (err) {
        res.json({ response: false, message: "An error occurred during viewing user info. Please try again later.", error: err.message });
    }
}

const viewplan = async (req, res) => {
    try {
        const plan = await Plan.findOne({ plan_name: req.params.name });
        if (!plan) {
            return res.json({ response: false, message: "Plan not found" });
        }
        res.json({ response: true, data: jsonEncrypt.encrypt(plan) });
    } catch (err) {
        res.json({ response: false, message: "An error occurred during viewing user info. Please try again later.", error: err.message });
    }
}

const viewtoken = async (req, res) => {
    try {
        const token = jsonDecrypt.decrypt(req.body.tmpData)
        const payment = await Payment.findOne({ token: token });
        if (!payment) {
            return res.json({ response: false, message: "Invalid token" });
        }
        const plan = await Plan.findOne({ _id: payment.plan_details._id });
        if (!plan) {
            return res.json({ response: false, message: "Plan not found" });
        }
        const user = await User.findById(payment.user_id);
        if (!user) {
            return res.json({ response: false, message: "User not found" });
        }
        res.json({ response: true, data: jsonEncrypt.encrypt(plan), user: jsonEncrypt.encrypt(user), payment: jsonEncrypt.encrypt(payment) });
    } catch (err) {
        res.json({ response: false, message: "An error occurred during viewing user info. Please try again later.", error: err.message });
    }
}


const activeplan = async (req, res) => {
    try {
        const data = jsonDecrypt.decrypt(req.body.tmpData)

        const planDetails = await Plan.findOne({ plan_name: data.plan_name });

        if (!planDetails) {
            return res.json({ response: false, message: "Plan not found" });
        }

        const user = await User.findById(data.user_id);
        if (!user) {
            return res.json({ response: false, message: "User not found" });
        }


        let updatedUser = {
            firstActivePlan: true,
            planid: planDetails._id,
            planname: planDetails.plan_name,
            plan_speed: planDetails.plan_speed,
            plan_type: planDetails.plan_type,
            plan_is_enable_disable_unsubscribe_checkbox: planDetails.plan_is_enable_disable_unsubscribe_checkbox,
            plan_is_enable_disable_email_tracking_checkbox: planDetails.plan_is_enable_disable_email_tracking_checkbox,
            plan_sendemails_unsubscribed_contacts: planDetails.plan_is_enable_disable_unsubscribe_checkbox,
            plan_max_campaign_per_day: planDetails.plan_max_campaign_per_day,
            plan_max_email_send_perday: planDetails.plan_max_email_send_perday,
            plan_max_email_send_per_campaign: planDetails.plan_max_email_send_per_campaign,
            plan_max_contact_limit: planDetails.plan_max_contact_limit,
            plan_max_contact_upload_at_once: planDetails.plan_max_contact_upload_at_once,
            plan_max_contact_attribute_limit: planDetails.plan_max_contact_attribute_limit,
            plan_max_template_limit: planDetails.plan_max_template_limit,
            plan_max_smtp_limit: planDetails.plan_max_smtp_limit,

            plan_is_enable_email_attachments: planDetails.plan_is_enable_email_attachments,
            plan_is_enable_email_attachments_limit: planDetails.plan_is_enable_email_attachments_limit,
            plan_is_enable_email_attachments_size_limit: planDetails.plan_is_enable_email_attachments_size_limit,

            spam_score: planDetails.spam_score,
            email_provider: planDetails.email_provider,
            template_builder: planDetails.template_builder,

            planmaxdevice: planDetails.plan_max_device,
            planduraction: planDetails.plan_validity_in_text,
            planstart: moment(),
            planend: moment().add(planDetails.plan_validity_in_month, 'months'),
        }

        user.set(updatedUser);
        await user.save();

        res.json({ response: true, data: data, planDetails: planDetails, user: user });
    } catch (err) {
        res.json({ response: false, message: "An error occurred during viewing user info. Please try again later.", error: err.message });
    }
}

const receivepayment = async (req, res) => {
    try {
        const data = jsonDecrypt.decrypt(req.body.tmpData)
        const payment = await Payment.findOne({ token: data.token });
        if (!payment) {
            return res.json({ response: false, message: "Invalid token" });
        }
        payment.set(data);
        await payment.save();


        const planDetails = await Plan.findOne({ _id: payment.plan_details._id });
        if (!planDetails) {
            return res.json({ response: false, message: "Plan not found" });
        }

        const user = await User.findById(payment.user_id);
        if (!user) {
            return res.json({ response: false, message: "User not found" });
        }

        let updatedUser = {
            firstActivePlan: true,
            planid: planDetails._id,
            planname: planDetails.plan_name,
            plan_speed: planDetails.plan_speed,
            plan_type: planDetails.plan_type,
            plan_is_enable_disable_unsubscribe_checkbox: planDetails.plan_is_enable_disable_unsubscribe_checkbox,
            plan_is_enable_disable_email_tracking_checkbox: planDetails.plan_is_enable_disable_email_tracking_checkbox,
            plan_sendemails_unsubscribed_contacts: planDetails.plan_is_enable_disable_unsubscribe_checkbox,
            plan_max_campaign_per_day: planDetails.plan_max_campaign_per_day,
            plan_max_email_send_perday: planDetails.plan_max_email_send_perday,
            plan_max_email_send_per_campaign: planDetails.plan_max_email_send_per_campaign,
            plan_max_contact_limit: planDetails.plan_max_contact_limit,
            plan_max_contact_upload_at_once: planDetails.plan_max_contact_upload_at_once,
            plan_max_contact_attribute_limit: planDetails.plan_max_contact_attribute_limit,
            plan_max_template_limit: planDetails.plan_max_template_limit,
            plan_max_smtp_limit: planDetails.plan_max_smtp_limit,

            plan_is_enable_email_attachments: planDetails.plan_is_enable_email_attachments,
            plan_is_enable_email_attachments_limit: planDetails.plan_is_enable_email_attachments_limit,
            plan_is_enable_email_attachments_size_limit: planDetails.plan_is_enable_email_attachments_size_limit,

            spam_score: planDetails.spam_score,
            email_provider: planDetails.email_provider,
            template_builder: planDetails.template_builder,

            planmaxdevice: planDetails.plan_max_device,
            planduraction: planDetails.plan_validity_in_text,
            planstart: moment(),
            planend: moment().add(planDetails.plan_validity_in_month, 'months'),
        }

        user.set(updatedUser);
        await user.save();


        res.json({ response: true });
    } catch (err) {
        res.json({ response: false, message: "An error occurred during viewing user info. Please try again later.", error: err.message });
    }
}


const receivepaymentpaypal = async (req, res) => {
    try {
        const data = jsonDecrypt.decrypt(req.body.tmpData)
        // const payment = await Payment.findOne({ token: data.token });
        // if (!payment) {
        //     return res.json({ response: false, message: "Invalid token" });
        // }
        // payment.set(data);
        // await payment.save();
        const payment = await Payment.create(data);

        const planDetails = await Plan.findOne({ _id: payment.plan_details._id });
        if (!planDetails) {
            return res.json({ response: false, message: "Plan not found" });
        }

        const user = await User.findById(payment.user_id);
        if (!user) {
            return res.json({ response: false, message: "User not found" });
        }

        let updatedUser = {
            firstActivePlan: true,
            planid: planDetails._id,
            planname: planDetails.plan_name,
            plan_speed: planDetails.plan_speed,
            plan_type: planDetails.plan_type,
            plan_is_enable_disable_unsubscribe_checkbox: planDetails.plan_is_enable_disable_unsubscribe_checkbox,
            plan_is_enable_disable_email_tracking_checkbox: planDetails.plan_is_enable_disable_email_tracking_checkbox,
            plan_sendemails_unsubscribed_contacts: planDetails.plan_is_enable_disable_unsubscribe_checkbox,
            plan_max_campaign_per_day: planDetails.plan_max_campaign_per_day,
            plan_max_email_send_perday: planDetails.plan_max_email_send_perday,
            plan_max_email_send_per_campaign: planDetails.plan_max_email_send_per_campaign,
            plan_max_contact_limit: planDetails.plan_max_contact_limit,
            plan_max_contact_upload_at_once: planDetails.plan_max_contact_upload_at_once,
            plan_max_contact_attribute_limit: planDetails.plan_max_contact_attribute_limit,
            plan_max_template_limit: planDetails.plan_max_template_limit,
            plan_max_smtp_limit: planDetails.plan_max_smtp_limit,

            plan_is_enable_email_attachments: planDetails.plan_is_enable_email_attachments,
            plan_is_enable_email_attachments_limit: planDetails.plan_is_enable_email_attachments_limit,
            plan_is_enable_email_attachments_size_limit: planDetails.plan_is_enable_email_attachments_size_limit,

            spam_score: planDetails.spam_score,
            email_provider: planDetails.email_provider,
            template_builder: planDetails.template_builder,

            planmaxdevice: planDetails.plan_max_device,
            planduraction: planDetails.plan_validity_in_text,
            planstart: moment(),
            planend: moment().add(planDetails.plan_validity_in_month, 'months'),
        }

        user.set(updatedUser);
        await user.save();

        res.json({ response: true });
    } catch (err) {
        res.json({ response: false, message: "An error occurred during viewing user info. Please try again later.", error: err.message });
    }
}

module.exports = {
    index, viewplan, activeplan, viewtoken, receivepayment, receivepaymentpaypal, cusupdate
}
