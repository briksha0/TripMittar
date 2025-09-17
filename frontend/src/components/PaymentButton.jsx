// frontend/src/components/PaymentButton.jsx
import React from "react";
import { createOrder, verifyPayment } from "../api/payment";

const PaymentButton = ({ amount, service, bookingId }) => {
  const handlePayment = async () => {
    try {
      const order = await createOrder(amount, service, bookingId);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // 👉 Use your Razorpay test key
        amount: order.amount,
        currency: order.currency,
        name: "My Travel App",
        description: `${service} Booking Payment`,
        order_id: order.id,
        handler: async function (response) {
          const verifyRes = await verifyPayment(response);
          if (verifyRes.success) {
            alert(`✅ ${service} Payment Successful!`);
          } else {
            alert("❌ Payment Verification Failed!");
          }
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "9876543210",
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment failed:", err);
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
    >
      Pay ₹{amount}
    </button>
  );
};

export default PaymentButton;
