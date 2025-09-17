// frontend/src/components/BusBooking/BusPayment.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../App";

const BusPayment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ State for booking
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    // Try to get booking details from navigation state
    if (location.state) {
      setBooking(location.state);
      sessionStorage.setItem("pendingBooking", JSON.stringify(location.state));
    } else {
      // Otherwise, try to restore from sessionStorage
      const saved = sessionStorage.getItem("pendingBooking");
      if (saved) {
        setBooking(JSON.parse(saved));
      }
    }
  }, [location.state]);

  if (!booking) {
    return (
      <p className="pt-24 text-center text-gray-400">
        ⚠️ No booking details found. Please go back and select your bus.
      </p>
    );
  }

  const { bus, pickup, drop, date, boardingStop } = booking;
  const totalFare = bus.price || 500;

  const handlePayment = async () => {
    try {
      const { data } = await axios.post("http://localhost:5000/api/payment/orders", {
        amount: totalFare, // paise
        currency: "INR",
        notes: {
          bus: bus.name,
          pickup: pickup?.name,
          drop: drop?.name,
          boardingStop,
          date,
        },
      });

      if (!window.Razorpay) {
        alert("⚠️ Razorpay SDK not loaded");
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Trip Mittar - Bus Booking",
        description: `${bus.name} | ${pickup?.name} → ${drop?.name} (${boardingStop}) on ${date}`,
        order_id: data.order.id,
        handler: async (response) => {
          const verifyRes = await axios.post("http://localhost:5000/api/payment/verify", response);
          if (verifyRes.data.success) {
            alert("✅ Payment successful!");
            sessionStorage.removeItem("pendingBooking"); // clear after success
            navigate("/success", { state: { ...booking, totalFare } });
          } else {
            alert("❌ Payment verification failed");
          }
        },
        prefill: {
          name: user?.fullname || "Guest",
          email: user?.email || "guest@example.com",
        },
        theme: { color: "#165ef9" },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error("Bus payment error:", err);
      alert("❌ Could not start payment. Try again.");
    }
  };

  return (
    <div className="pt-24 min-h-screen flex justify-center items-center bg-gray-900">
      <div className="bg-gray-800 shadow-2xl rounded-2xl p-8 max-w-lg w-full text-gray-100">
        <h1 className="text-2xl font-bold mb-6 text-blue-400">
          🚌 Confirm Your Bus Booking
        </h1>

        <div className="space-y-2">
          <p><strong>Bus:</strong> {bus.name}</p>
          <p><strong>From:</strong> {pickup?.name}</p>
          <p><strong>To:</strong> {drop?.name}</p>
          <p><strong>Boarding Stop:</strong> {boardingStop}</p>
          <p><strong>Date:</strong> {new Date(date).toLocaleDateString()}</p>
        </div>

        {/* Fare Section */}
        <div className="mt-6 p-4 bg-gray-600 rounded-xl border border-gray-600">
          <p className="text-xl font-bold text-white">
            💰 Total Fare: ₹{totalFare}
          </p>
        </div>

        <button
          onClick={handlePayment}
          className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors duration-300 font-semibold shadow-lg"
        >
          🚀 Pay ₹{totalFare} & Confirm
        </button>
      </div>
    </div>
  );
};

export default BusPayment;
