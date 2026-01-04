const express = require('express');
const router = express.Router();

const UserController = require('../controllers/UserController');

router.get('/open/:trackingId', UserController.openTracking);
router.get('/click/:trackingId', UserController.clickTracking);
router.get('/unsubscribe/:trackingId', UserController.unsubscribeTracking);
router.get('/thankyou', UserController.thankyouUnsubscribe);
router.post('/contactus/store', UserController.storeContactUs);
router.get('/dashboard/:userid', UserController.dashboard);
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/view/:id', UserController.viewUserInfo);
router.post('/update', UserController.updateUserInfo);
router.post('/changepassword', UserController.changepassword);
router.get('/checkipblacklist/:ip', UserController.checkIpBlacklist);
router.post('/verifyemail', UserController.verifyEmail);
router.post('/forgotpassword', UserController.forgotPassword);
router.post('/resendverificationcode', UserController.resendVerificationCode);
router.post('/delete_device', UserController.deleteDevice);

module.exports = router;
