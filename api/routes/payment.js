const express = require('express');
const router = express.Router();

const PaymentController = require('../controllers/PaymentController');

router.get('/', PaymentController.index);
router.post('/temp_payment', PaymentController.tempPayment);
router.post('/get_token_details/:token', PaymentController.getTokenDetails);
router.get('/view/:user_id', PaymentController.view);

module.exports = router;
