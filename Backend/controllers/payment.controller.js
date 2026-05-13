import Payment from "../models/payment.model.js";
import razorpay from "../services/rezorpay.service.js";
import crypto from "crypto";
import User from "../models/user.model.js";


export const createOrder = async (req, res) => {
    try {
        const { planId, amount, credits } = req.body;
        // console.log(req.body);
        if (!amount || !credits) {
            return res.status(400).json({ message: "Invalid plan data" });
        }

        const options = {
            amount: amount * 100,     // rupees ko pain me convert krenge
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        await Payment.create({
            userId: req.userId,
            planId,
            amount: amount,
            credits,
            razorpayOrderId: order.id,
            status: "created",
        });

        return res.status(200).json(order);

    } catch (error) {
        console.log("Error in createOrder controller", error);
        return res.status(500).json({ message: `Create Razorpay Order Failed  ${error.message}` });
    }
}


export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto.createHmac("sha256", process.env.REZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ message: "Invalid signature" });
        }

        const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }

        if (payment.status === "paid") {
            return res.status(400).json({ message: "Payment already processed" });
        }

        // Update payment record 
        payment.status = "paid";
        payment.razorpayPaymentId = razorpay_payment_id;
        await payment.save();

        // Add credits to user account
        const updatedUser = await User.findByIdAndUpdate(payment.userId,
            { $inc: { credits: payment.credits } },
            { new: true });

        res.status(200).json({
            success: true,
            message: "Payment verified successfully and credits added to user account",
            user: updatedUser
        });
    } catch (error) {
        console.log("Error in verifyPayment controller", error);
        return res.status(500).json({ message: ` Failed to Verify Payment ${error.message}` });
    }
}