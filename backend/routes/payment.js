// backend/routes/payment.js
import express from "express";

// Export a function that returns a router
export default function PaymentRoutes(razorpay) {
  const router = express.Router();

  // 🔹 Create Razorpay order
  router.post("/orders", async (req, res) => {
    try {
      const { amount, currency = "INR", notes = {} } = req.body;

      if (!amount) return res.status(400).json({ message: "Amount is required" });

      const options = {
        amount: amount * 100, // paise
        currency,
        receipt: `rcpt_${Date.now()}`,
        notes,
      };

      const order = await razorpay.orders.create(options);
      res.json({ success: true, order });
    } catch (err) {
      console.error("Razorpay order creation error:", err);
      res.status(500).json({ success: false, message: "Failed to create order" });
    }
  });

  // 🔹 Verify Razorpay payment
  router.post("/verify", async (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ success: false, message: "Missing payment details" });
      }

      const crypto = await import("crypto");
      const hmac = crypto.createHmac("sha256", razorpay.key_secret);
      hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
      const digest = hmac.digest("hex");

      if (digest === razorpay_signature) {
        res.json({ success: true, message: "Payment verified" });
      } else {
        res.status(400).json({ success: false, message: "Invalid signature" });
      }
    } catch (err) {
      console.error("Razorpay payment verification error:", err);
      res.status(500).json({ success: false, message: "Payment verification failed" });
    }
  });

  return router;
}
