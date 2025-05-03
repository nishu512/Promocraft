const Razorpay = require('razorpay');
const crypto = require('crypto');
const PaymentModel = require('../models/PaymentModel');

const razorpayInstance = new Razorpay({
    key_id: 'rzp_test_bko0Tgqc4fdLII',
    key_secret: 'e54o15FO9WGtoG7cCnrkVLe2',
});

exports.createOrder = async (req, res) => {
    const { amount, currency } = req.body;
    const options = {
        amount: amount * 100, // Razorpay requires amount in paise
        currency: currency,
        receipt: 'receipt_order_74394',
    };
    try {
        const order = await razorpayInstance.orders.create(options);
        const newPayment = new PaymentModel({
            amount,
            currency,
            paymentMethod: req.body.paymentMethod,
            paymentStatus: 'pending',
            transactionRef: order.id,
        });
        await newPayment.save();
        res.json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.verifyPayment = (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const generated_signature = crypto.createHmac('sha256', 'e54o15FO9WGtoG7cCnrkVLe2')
        .update(razorpay_order_id + '|' + razorpay_payment_id)
        .digest('hex');
    if (generated_signature === razorpay_signature) {
        PaymentModel.updateOne({ transactionRef: razorpay_order_id }, { paymentStatus: 'completed' })
            .then(() => res.json({ success: true, message: 'Payment verified successfully' }))
            .catch(err => res.status(500).json({ success: false, error: err.message }));
    } else {
        res.status(400).json({ success: false, message: 'Payment verification failed' });
    }
};
