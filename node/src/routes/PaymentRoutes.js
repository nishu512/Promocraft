const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/PaymentController');

router.post('/createOrder', PaymentController.createOrder);
router.post('/verifyPayment', PaymentController.verifyPayment);

module.exports = router;
