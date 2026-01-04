const moment = require('moment');
const jsonEncrypt = require('./jsonEncrypt');
const jsonDecrypt = require('./jsonDecrypt');
const nodemailer = require("nodemailer");
const User = require("../models/User");
const EmailTracker = require("../utils/emailTracker");
const UnsubscribeList = require("../models/UnsubscribeList");
const EmailSendData = require("../models/EmailSendData");
const EmailViewerList = require("../models/EmailViewerList");
const EmailTemplate = require("../models/EmailTemplate");
const EmailSmtp = require("../models/EmailSmtp");
const ContactList = require("../models/ContactList");
const ContactUs = require("../models/ContactUs");
const resendTimestamps = new Map(); // Key: email, Value: timestamp
const RATE_LIMIT_MS = 20000;
const RATE_LIMIT_MS_FORGOT_PASSWORD = 60000;
const forgotPasswordTimestamps = new Map(); // Key: email, Value: timestamp

var transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    // secure: true,
    port: 587,
    auth: {
        user: '93c2a3001@smtp-brevo.com',
        pass: 'BE9Sca5vHsM402JU',
    },
});



async function sendEmailVerificationCode(name, email, code) {
    let info = await transporter.sendMail({
        from: '"SmartBulkEmailSender" <noreply@smartbulkemailsender.com>', // sender address
        to: email, // list of receivers
        subject: "Your Email Verification Code", // Subject line
        html: `
            <!DOCTYPE html>
<html>
<head>
  <title>Email Verification Code</title>
</head>
<body>

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f4; padding: 40px 0; font-family: Arial, sans-serif;">
  <tr>
    <td align="center">
      
      <!-- Logo (outside the main box) -->
      <img src="https://www.smartbulkemailsender.com/image/logo.png" alt="SmartBulkEmailSender" style="max-width: 190px; margin-bottom: 13px; z-index: 10; position: relative;" />

      <!-- Main Container -->
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); margin-top: 0;">
        
        <!-- Header Title -->
        <tr>
          <td style="background-color: #de4847; padding: 30px 20px 20px 20px; text-align: center; border-top-left-radius: 12px; border-top-right-radius: 12px;">
            <h1 style="margin: 0; font-size: 26px; color: #ffffff; font-weight: bold;">Email Verification Code</h1>
            <p style="margin: 5px 0 0; color: #e0e0e0; font-size: 14px;">Secure your account with this one-time code</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding: 30px; color: #333333; font-size: 16px; line-height: 1.6;">
            <p style="margin-top: 0;">Hello ${name},</p>
            <p>Thanks for signing up. Please enter the verification code below to confirm your email address:</p>

            <div style="text-align: center; margin: 30px 0;">
              <span style="display: inline-block; padding: 16px 38px; background-color: #e9f5ff; color: #de4847; font-size: 28px; font-weight: bold; letter-spacing: 5px; border-radius: 10px;">
                ${code}
              </span>
            </div>

            <p>If you didn’t request this, you can safely ignore this email.</p>
            <p>Best regards,<br><strong>SmartBulkEmailSender Team</strong></p>
          </td>
        </tr>

        <!-- Do Not Reply Note -->
        <tr>
          <td style="padding: 0 30px 20px 30px; color: #999999; font-size: 12px; text-align: center;">
            This email was sent from an email address that can't receive emails. Please don't reply to this email.
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 12px; color: #666666;">
            <div style="margin-bottom: 5px;">&copy; 2026 SmartBulkEmailSender. All rights reserved.</div>
            <div>Email: <a href="mailto:info@smartbulkemailsender.com" style="color: #de4847; text-decoration: none;">info@smartbulkemailsender.com</a></div>
            <div>Website: <a href="https://www.smartbulkemailsender.com" target="_blank" style="color: #de4847; text-decoration: none;">www.smartbulkemailsender.com</a></div>
          </td>
        </tr>
        
      </table>
    </td>
  </tr>
</table>

</body>
</html>
            
        `
    });
    return info;
}


async function sendForgotPasswordCode(name, email, password) {
    let info = await transporter.sendMail({
        from: '"SmartBulkEmailSender" <noreply@smartbulkemailsender.com>', // sender address
        to: email, // list of receivers
        subject: "Your Account Password", // Subject line
        html: `
            <!DOCTYPE html>
<html>
<head>
  <title>Your Account Password</title>
</head>
<body>
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f4; padding: 40px 0; font-family: Arial, sans-serif;">
    <tr>
      <td align="center">
        <img src="https://www.smartbulkemailsender.com/image/logo.png" alt="SmartBulkEmailSender" style="max-width: 190px; margin-bottom: 13px; z-index: 10; position: relative;" />
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); margin-top: 0;">
          <tr>
            <td style="background-color: #de4847; padding: 30px 20px 20px 20px; text-align: center; border-top-left-radius: 12px; border-top-right-radius: 12px;">
              <h1 style="margin: 0; font-size: 26px; color: #ffffff; font-weight: bold;">Password Recovery</h1>
              <p style="margin: 5px 0 0; color: #e0e0e0; font-size: 14px;">Your account password information</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px; color: #333333; font-size: 16px; line-height: 1.6;">
              <p style="margin-top: 0;">Hello ${name},</p>
              <p>Your password is:</p>
              <div style="text-align: center; margin: 30px 0;">
                <span style="display: inline-block; padding: 16px 38px; background-color: #e9f5ff; color: #de4847; font-size: 28px; font-weight: bold; letter-spacing: 5px; border-radius: 10px;">
                  ${password}
                </span>
              </div>
              <p>If you didn’t request this, you can safely ignore this email.</p>
              <p>Best regards,<br><strong>SmartBulkEmailSender Team</strong></p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 30px 20px 30px; color: #999999; font-size: 12px; text-align: center;">
              This email was sent from an email address that can't receive emails. Please don't reply to this email.
            </td>
          </tr>
          <tr>
            <td style="background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 12px; color: #666666;">
              <div style="margin-bottom: 5px;">&copy; 2026 SmartBulkEmailSender. All rights reserved.</div>
              <div>Email: <a href="mailto:info@smartbulkemailsender.com" style="color: #de4847; text-decoration: none;">info@smartbulkemailsender.com</a></div>
              <div>Website: <a href="https://www.smartbulkemailsender.com" target="_blank" style="color: #de4847; text-decoration: none;">www.smartbulkemailsender.com</a></div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `
    });
    return info;
}



const getDaysInMonth = (month, year) => {
    let days = [];
    for (let day = 1; day <= moment(`${year}-${month}`, 'YYYY-MM').daysInMonth(); day++) {
        days.push(moment(`${year}-${month}-${day}`, 'YYYY-MM-DD').format('DD-MMMM-YYYY'));
    }
    return days;
}

const dashboard = async (req, res) => {
    try {
        const userId = req.params.userid;
        const startOfMonth = moment().startOf('month');
        const endOfMonth = moment().endOf('month');

        // 1. Get all days in the month as strings
        const daysInMonth = [];
        let day = startOfMonth.clone();
        while (day.isSameOrBefore(endOfMonth)) {
            daysInMonth.push(day.format("DD-MMMM-YYYY"));
            day.add(1, 'day');
        }

        // 2. Get daily stats in a single aggregation
        const agg = await EmailSendData.aggregate([
            { $match: { userid: userId, createdAt: { $gte: startOfMonth.toDate(), $lte: endOfMonth.toDate() } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%d-%B-%Y", date: "$createdAt" } },
                    total_datas: { $sum: "$total_datas" },
                    total_success: { $sum: "$total_success" },
                    total_failed: { $sum: "$total_failed" },
                    total_records_day: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);




        const total_emails_send = agg.reduce((sum, item) => sum + item.total_datas, 0);

        const total_campaign_records = await EmailSendData.countDocuments({
            userid: userId,
            createdAt: { $gte: startOfMonth.toDate(), $lte: endOfMonth.toDate() }
        });

        const emailSendData = await EmailSendData.countDocuments({ userid: userId });
        const emailTemplates = await EmailTemplate.countDocuments({ userid: userId });
        const emailSmtp = await EmailSmtp.countDocuments({ userid: userId });
        const contactLists = await ContactList.countDocuments({ userid: userId });
        const unsubscribeLists = await UnsubscribeList.countDocuments({ userid: userId });
        const emailViewerLists = await EmailViewerList.countDocuments({ userid: userId });

        res.json({
            response: true,
            startOfMonth: startOfMonth.toDate(),
            endOfMonth: endOfMonth.toDate(),
            total_emails_send,
            total_campaign_records,
            total_email_templates: emailTemplates,
            total_email_smtps: emailSmtp,
            total_contact_lists: contactLists,
            total_unsubscribe_lists: unsubscribeLists,
            total_email_viewer_lists: emailViewerLists
        });
    } catch (e) {
        res.json({
            response: false,
            error: e.message
        });
    }
};

const viewUserInfo = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select('-emailverificationcode -password');
        res.json({
            response: true,
            data: jsonEncrypt.encrypt(user)
            // data: user
        });
    } catch (err) {
        res.json({ response: false, message: "An error occurred during viewing user info. Please try again later.", error: err.message });
    }
}

const updateUserInfo = async (req, res) => {
    try {
        const data = jsonDecrypt.decrypt(req.body.tmpData)
        console.log(data);
        const user = await User.findByIdAndUpdate(data._id, data, { new: true });
        res.json({ response: true, });
    } catch (err) {
        res.json({ response: false, message: "An error occurred during updating user info. Please try again later.", error: err.message });
    }
}

const deleteDevice = async (req, res) => {
    try {
        const data = jsonDecrypt.decrypt(req.body.tmpData);
        console.log(data);
        const user = await User.findByIdAndUpdate(
            data._id,
            { $pull: { logintokens: { logintoken: data.logintoken } } },
            { new: true }
        );
        res.json({ response: true });
    } catch (err) {
        res.json({ response: false, message: "An error occurred during deleting device. Please try again later.", error: err.message });
    }
}

const changepassword = async (req, res) => {
    try {
        const data = jsonDecrypt.decrypt(req.body.tmpData)
        console.log(data);
        const user = await User.findById(data._id);
        console.log(user);
        if (!user) {
            return res.json({ response: false, message: "No account found with this email address." });
        }
        if (user.password !== data.oldPassword) {
            return res.json({ response: false, message: "The current password you entered is incorrect." });
        }
        user.password = data.newPassword;
        await user.save();
        res.json({ response: true, });
    } catch (err) {
        res.json({ response: false, message: "An error occurred during changing password. Please try again later.", error: err.message });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = jsonDecrypt.decrypt(req.body.tmpData);
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ response: false, message: "No account found with this email address." });
        }
        if (user.password !== password) {
            return res.json({ response: false, message: "Incorrect password. Please try again." });
        }
        res.json({ response: true, data: jsonEncrypt.encrypt(user) });
    } catch (err) {
        res.json({ response: false, message: "An error occurred during login. Please try again later.", error: err.message });
    }
}

const verifyEmail = async (req, res) => {
    try {
        const { email, code } = jsonDecrypt.decrypt(req.body.tmpData);
        console.log(email, code);
        const user = await User.findOne({ email: email, emailverificationcode: code });
        console.log(user);
        if (!user) {
            return res.json({ response: false, message: "Invalid email or verification code." });
        }
        user.emailverification = "Verified";
        await user.save();
        res.json({ response: true, data: jsonEncrypt.encrypt(user) })
    } catch (err) {
        res.json({ response: false, message: "An error occurred during email verification. Please try again later.", error: err.message });
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = jsonDecrypt.decrypt(req.body.tmpData);
        // Rate limit: allow only one request per 20 seconds per email
        const now = Date.now();
        const lastSent = forgotPasswordTimestamps.get(email);
        if (lastSent && now - lastSent < RATE_LIMIT_MS_FORGOT_PASSWORD) {
            const waitTime = Math.ceil((RATE_LIMIT_MS_FORGOT_PASSWORD - (now - lastSent)) / 1000);
            return res.status(429).json({ response: false, message: `Please wait ${waitTime} more seconds before requesting again.` });
        }
        forgotPasswordTimestamps.set(email, now);
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ response: false, message: "No account found with this email address." });
        }
        // await sendForgotPasswordCode(user.name, user.email, user.password);
        res.json({ response: true, message: "Password sent successfully." });
    } catch (err) {
        res.json({ response: false, message: "An error occurred during forgot password. Please try again later.", error: err.message });
    }
}

const register = async (req, res) => {
    try {
        let data = jsonDecrypt.decrypt(req.body.tmpData);

        const existingUser = await User.findOne({ email: data.email });
        if (existingUser) {
            return res.json({ response: false, message: "The email address you entered is already in use. Please try a different email address." });
        }

        data.emailverificationcode = Math.floor(100000 + Math.random() * 900000).toString();

        const newUser = new User(data);
        await newUser.save();

        // send email verification code
        await sendEmailVerificationCode(newUser.name, newUser.email, newUser.emailverificationcode);

        res.json({ response: true, message: "User registered successfully.", data: jsonEncrypt.encrypt(newUser) });
    } catch (err) {
        res.json({ response: false, message: "An error occurred during registration. Please try again later.", error: err.message });
    }
}

const resendVerificationCode = async (req, res) => {
    try {
        const { email } = jsonDecrypt.decrypt(req.body.tmpData);

        // Rate limit: allow only one request per 20 seconds per email
        const now = Date.now();
        const lastSent = resendTimestamps.get(email);
        if (lastSent && now - lastSent < RATE_LIMIT_MS) {
            const waitTime = Math.ceil((RATE_LIMIT_MS - (now - lastSent)) / 1000);
            return res.status(429).json({ response: false, message: `Please wait ${waitTime} more seconds before requesting again.` });
        }
        resendTimestamps.set(email, now);

        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ response: false, message: "No account found with this email address." });
        }

        // send email verification code
        await sendEmailVerificationCode(user.name, user.email, user.emailverificationcode);
        res.json({ response: true, message: "Verification code resent successfully." });
    } catch (err) {
        res.json({ response: false, message: "An error occurred during resending verification code. Please try again later.", error: err.message });
    }
}

const openTracking = async (req, res) => {
    const { trackingId } = req.params;
    try {
        // Find the document and update the matching subdocument
        const result = await EmailSendData.findOneAndUpdate(
            { "email_send_datas.trackingId": trackingId },
            {
                $set: { "email_send_datas.$.isEmailOpened": true },
                $push: {
                    "email_send_datas.$.emailOpenTimes": {
                        date_and_time: moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
                        status: 'open'
                    }
                }
            },
            { new: true }
        );

        const viewerEmail = result.email_send_datas.find(item => item.trackingId === trackingId);
        await EmailViewerList.create({
            userid: result.userid,
            email_send_data_id: result._id,
            viewer_email: viewerEmail.email,
            smtp_email: result.smtp_data.email,
            trackingId: trackingId
        });

        if (!result) {
            return res.status(404).json({ response: false, message: "Tracking ID not found" });
        }

        res.json({ response: true, message: "Email open tracked", trackingId });
    } catch (err) {
        res.status(500).json({ response: false, message: err.message });
    }
};

const clickTracking = async (req, res) => {
    const { trackingId } = req.params;
    try {
        // Find the document and update the matching subdocument
        const result = await EmailSendData.findOneAndUpdate(
            { "email_send_datas.trackingId": trackingId },
            {
                $set: { "email_send_datas.$.isEmailOpened": true },
                $push: {
                    "email_send_datas.$.emailOpenTimes": {
                        date_and_time: moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
                        status: 'click'
                    }
                }
            },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({ response: false, message: "Tracking ID not found" });
        }

        res.json({ response: true, message: "Email click tracked", trackingId });
    } catch (err) {
        res.status(500).json({ response: false, message: err.message });
    }
}

// const unsubscribeTracking = async (req, res) => {
//     const { trackingId } = req.params;
//     try {
//         const result = await EmailSendData.findOneAndUpdate(
//             { "email_send_datas.trackingId": trackingId },
//             { $set: { "email_send_datas.$.unSubscribeClick": true } },
//             { new: true }
//         );

//         if (!result) {
//             return res.status(404).json({ success: false, message: "Tracking ID not found" });
//         }

//         // Find the correct email_send_datas subdocument
//         const unsubEmailObj = result.email_send_datas.find(
//             (item) => item.trackingId === trackingId
//         );

//         await UnsubscribeList.create({
//             userid: result.userid,
//             email: unsubEmailObj ? unsubEmailObj.email : undefined,
//             trackingid: trackingId,
//         });

//         res.json({ success: true, message: "Unsubscribe tracked", trackingId, result });
//     } catch (err) {
//         res.status(500).json({ success: false, message: err.message });
//     }
// }

const unsubscribeTracking = async (req, res) => {
    const { trackingId } = req.params;
    try {
        const result = await EmailSendData.findOneAndUpdate(
            { "email_send_datas.trackingId": trackingId },
            { $set: { "email_send_datas.$.unSubscribeClick": true } },
            { new: true }
        );

        if (!result) {
            // return res.status(404).json({ success: false, message: "Tracking ID not found" });
            res.redirect('/thankyou-unsubscribe');
        }

        // Find the correct email_send_datas subdocument
        const unsubEmailObj = result.email_send_datas.find(
            (item) => item.trackingId === trackingId
        );

        const existing = await UnsubscribeList.findOne({
            userid: result.userid,
            email: unsubEmailObj ? unsubEmailObj.email : undefined,
        });

        if (!existing) {
            await UnsubscribeList.create({
                userid: result.userid,
                email: unsubEmailObj ? unsubEmailObj.email : undefined,
                trackingid: trackingId,
            });
        }
        res.redirect('/thankyou-unsubscribe');

        // res.json({ success: true, message: "Unsubscribe tracked", trackingId });
    } catch (err) {
        // res.status(500).json({ success: false, message: err.message });
        res.redirect('/thankyou-unsubscribe');

    }
}

const thankyouUnsubscribe = async (req, res) => {
    res.redirect('/thankyou-unsubscribe');
}

const checkIpBlacklist = async (req, res) => {
    const { ip } = req.params;
    const blacklist = await Blacklist.findOne({ ip });
    res.json({ response: true, data: blacklist });
}

const storeContactUs = async (req, res) => {
    try {
        const data = jsonDecrypt.decrypt(req.body.tmpData);
        const contactUs = await ContactUs.create(data);

        let info = await transporter.sendMail({
            from: 'SmartBulkEmailSender <noreply@smartbulkemailsender.com>',
            to: 'b21341995returns@gmail.com',
            subject: '⏰⏰⏰⏰ New Contact Request',
            html: `
              <html>
                <body>
                  <p>You have received a new contact request via SmartBulkEmailSender.</p>
                  <p><strong>Name:</strong> ${data.name}</p>
                  <p><strong>Email:</strong> ${data.email}</p>
                  <p><strong>Whatsapp:</strong> ${data.whatsapp}</p>
                  <p><strong>Subject:</strong> ${data.subject}</p>
                  <p><strong>Message:</strong> ${data.message}</p>
                </body>
              </html>
            `
        });


        res.json({ response: true, message: "Contact us stored successfully." });
    } catch (err) {
        res.json({ response: false, message: "An error occurred during storing contact us. Please try again later.", error: err.message });
    }
}


module.exports = {
    openTracking, clickTracking, unsubscribeTracking, thankyouUnsubscribe, register, viewUserInfo, checkIpBlacklist, verifyEmail, login, resendVerificationCode, forgotPassword, updateUserInfo, changepassword, deleteDevice, dashboard, storeContactUs
};
