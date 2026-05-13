import Payment from "../models/payment.model.js";
import razorpay from "../services/rezorpay.service.js";


export const createOrder = (req, res) => {
    try {
        const { planId, amout, credits } = req.body;
        if ( !amout || !credits) {
            return res.status(400).json({ message: "Invalid plan data" });
        }

        const options = {
            amount: amout * 100,     // rupees ko pain me convert krenge
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        await Payment.create({
            userId: req.userId,
            planId,
            amount: amout,
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