import React from "react";
import axios from "axios";
import { useAuth } from "../../App";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentFlight = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { flight } = location.state;
  const totalFare = flight.price || 5000;

  const handleFlightPayment = async () => {
    try {
      const { data } = await axios.post("http://localhost:5000/api/payment/orders", {
        amount: totalFare,
        currency: "INR",
        notes: {
          service: "flight",
          userId: user?.id,
          flightId: flight.id,
        },
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Trip Mittar Flight Booking",
        description: `Flight: ${flight.airline?.name}`,
        order_id: data.order.id,
        handler: async (response) => {
          const verifyRes = await axios.post("http://localhost:5000/api/payment/verify", {
            ...response,
            notes: { service: "flight", userId: user?.id, flightId: flight.id },
          });

          if (verifyRes.data.success) {
            alert("✅ Payment successful!");
            navigate("/success", { state: { flight, totalFare } });
          } else alert("❌ Payment verification failed");
        },
        prefill: { name: user?.fullname, email: user?.email },
        theme: { color: "#16a34a" },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error(err);
      alert("Payment failed!");
    }
  };

  return (
    <div className="pt-24 text-center">
      <h2 className="text-2xl font-bold mb-4">✈️ Flight Payment</h2>
      <button onClick={handleFlightPayment} className="bg-green-600 text-white px-6 py-2 rounded-xl">
        Pay Now
      </button>
    </div>
  );
};

export default PaymentFlight;
