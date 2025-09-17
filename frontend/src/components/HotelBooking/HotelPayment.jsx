// frontend/src/components/HotelBooking/HotelPayment.jsx
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../App";

const HotelPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const bookingState =
    location.state || JSON.parse(sessionStorage.getItem("pendingHotelBooking"));

  const { hotel, checkin, checkout, guests } = bookingState || {};

  useEffect(() => {
    if (!bookingState) {
      navigate("/hotels");
    } else {
      sessionStorage.setItem("pendingHotelBooking", JSON.stringify(bookingState));
    }
  }, [bookingState, navigate]);

  useEffect(() => {
    if (!user) {
      navigate("/signin", { state: { from: "/hotels/payment" } });
    }
  }, [user, navigate]);

  if (!hotel)
    return <p className="mt-24 text-center text-gray-300">⚠️ No hotel selected.</p>;

  const totalNights = Math.max(
    1,
    (new Date(checkout) - new Date(checkin)) / (1000 * 60 * 60 * 24)
  );
  const totalPrice = hotel.price_per_night * totalNights * guests;

  const handlePayment = async () => {
    try {
      const { data } = await axios.post("http://localhost:5000/api/payment/orders", {
        amount: totalPrice,
        currency: "INR",
        notes: { hotel: hotel.name, city: hotel.city, checkin, checkout, guests },
      });

      if (!window.Razorpay) {
        alert("⚠️ Razorpay SDK not loaded!");
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Trip Mittar Hotel Booking",
        description: `${hotel.name}, ${hotel.city} | ${guests} guest(s) | ${totalNights} night(s)`,
        order_id: data.order.id,
        handler: async (response) => {
          const verifyRes = await axios.post(
            "http://localhost:5000/api/payment/verify",
            response
          );
          if (verifyRes.data.success) {
            alert("✅ Payment successful!");
            sessionStorage.removeItem("pendingHotelBooking");
            navigate("/success", {
              state: { hotel, checkin, checkout, guests, totalPrice },
            });
          } else {
            alert("❌ Payment verification failed!");
          }
        },
        prefill: {
          name: user?.fullname || "Guest",
          email: user?.email || "guest@example.com",
        },
        theme: { color: "#165ef9ff" }, // orange accent
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Hotel payment error:", err);
      alert("❌ Payment failed!");
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-gray-900 flex justify-center items-start">
      <div className="w-full max-w-3xl bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-500">
          🏨 Hotel Payment
        </h2>

        {/* Hotel Info */}
        <div className="mb-6 bg-gray-700 p-5 rounded-xl shadow-inner">
          <h3 className="text-xl font-semibold text-blue-500">{hotel.name}</h3>
          <p className="text-gray-300">{hotel.city}</p>
          {hotel.address && <p className="text-gray-400">{hotel.address}</p>}

          <div className="mt-4 space-y-2 text-gray-200">
            <p>
              📅 <strong>Check-in:</strong> {checkin} →{" "}
              <strong>Check-out:</strong> {checkout}
            </p>
            <p>👥 Guests: {guests}</p>
            <p>🌙 Nights: {totalNights}</p>
          </div>

          {/* Fare Breakdown */}
          <div className="mt-4 bg-gray-800 p-4 rounded-lg">
            <p className="text-gray-300">
              ₹{hotel.price_per_night} × {totalNights} night(s) × {guests} guest(s)
            </p>
            <p className="text-lg font-bold text-gray-400 mt-2">
              💰 Total: ₹{totalPrice}
            </p>
          </div>
        </div>

        {/* Pay Button */}
        <div className="text-center">
          <button
            onClick={handlePayment}
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-500 transition-colors duration-300 font-semibold shadow-lg"
          >
            🚀 Pay ₹{totalPrice} & Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelPayment;
