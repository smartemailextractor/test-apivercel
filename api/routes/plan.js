const express = require('express');
const router = express.Router();

const PlanController = require('../controllers/PlanController');

router.get('/', PlanController.index);
router.get('/cusupdate', PlanController.cusupdate);
router.get('/viewplan/:name', PlanController.viewplan);
router.post('/activeplan', PlanController.activeplan);
router.post('/viewtoken', PlanController.viewtoken);
router.post('/receivepayment', PlanController.receivepayment); // (external received)
router.post('/receivepaymentpaypal', PlanController.receivepaymentpaypal); // (paypal received)


module.exports = router;
