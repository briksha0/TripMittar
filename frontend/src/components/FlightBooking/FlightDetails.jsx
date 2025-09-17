import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { createOrder, verifyPayment } from "../../api/paymentflight";
import { useAuth } from "../../App";

export const FlightDetails = () => {
  const { flightId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [flight, setFlight] = useState(null);

  // 🛫 Restore / Save flight session
  useEffect(() => {
    if (state?.flight) {
      sessionStorage.setItem("flightBooking", JSON.stringify(state.flight));
      setFlight(state.flight);
    } else {
      const savedFlight = sessionStorage.getItem("flightBooking");
      if (savedFlight) {
        setFlight(JSON.parse(savedFlight));
      }
    }
  }, [state]);

  if (!flight) {
    return (
      <div className="mt-24 text-center">
        <p className="text-red-500 text-lg font-semibold">
          No flight data found.
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          Go Home
        </button>
      </div>
    );
  }

  // 💳 Handle Payment
  const handlePayment = async () => {
    if (!user) {
      alert("⚠️ Please sign in to proceed with payment.");
      navigate("/signin");
      return;
    }

    try {
      const amount = flight.price || 5000;
      const orderData = await createOrder(amount, "flight");

      if (!orderData?.order) {
        alert("❌ Failed to create payment order.");
        return;
      }

      if (!window.Razorpay) {
        alert("⚠️ Razorpay SDK not loaded. Refresh and try again.");
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Trip Mittar Flight Booking",
        description: `Flight: ${flight.airline?.name || "Flight"} (${flight.flight?.iata || ""})`,
        order_id: orderData.order.id,
        handler: async (response) => {
          try {
            const verifyRes = await verifyPayment(response);
            if (verifyRes.success) {
              alert("✅ Payment Successful!");

              // 🧹 Clear session once confirmed
              sessionStorage.removeItem("flightBooking");

              navigate("/confirmation", {
                state: { flight, paymentId: response.razorpay_payment_id },
              });
            } else {
              alert("❌ Payment verification failed.");
            }
          } catch (err) {
            console.error("Payment verification error:", err);
            alert("❌ Payment verification failed.");
          }
        },
        prefill: {
          name: user.fullname || user.username,
          email: user.email || "guest@example.com",
          contact: user.contact || "9999999999",
        },
        theme: { color: "#2563eb" },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error("Payment error:", err);
      alert("❌ Payment failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-6 md:p-24">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8 md:p-12">
        {/* Flight Header */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-center text-gray-600 dark:text-gray-400 mb-8">
          {flight.airline?.name} ({flight.flight?.iata})
        </h1>

        {/* Flight Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-2xl p-6 shadow hover:shadow-xl transition">
            <h3 className="text-lg font-semibold text-gray-300 mb-2">Departure</h3>
            <p className="font-medium text-white">
              {flight.departure?.airport} ({flight.departure?.iata})
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {flight.departure?.scheduled
                ? new Date(flight.departure.scheduled).toLocaleString()
                : "-"}
            </p>
          </div>
          <div className="bg-gray-800 rounded-2xl p-6 shadow hover:shadow-xl transition">
            <h3 className="text-lg font-semibold text-gray-300 mb-2">Arrival</h3>
            <p className="font-medium text-white">
              {flight.arrival?.airport} ({flight.arrival?.iata})
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {flight.arrival?.scheduled
                ? new Date(flight.arrival.scheduled).toLocaleString()
                : "-"}
            </p>
          </div>
        </div>

        {/* Flight Number */}
        <div className="mt-8 text-center">
          <p className="text-lg font-medium text-gray-200">
            Flight No:{" "}
            <span className="text-blue-400 font-bold">
              {flight.flight?.number || "-"}
            </span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col md:flex-row justify-center gap-6">
          <button
            onClick={() => navigate(-1)}
            className="w-full md:w-auto bg-gray-700 text-white px-6 py-3 rounded-2xl shadow hover:bg-gray-800 transition font-medium"
          >
            ← Back
          </button>
          <button
            onClick={handlePayment}
            className="w-full md:w-auto bg-blue-600 text-white px-6 py-3 rounded-2xl shadow hover:bg-blue-700 transition font-medium"
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};
