
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../App";

const PaymentCab = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { cab, pickup, drop, distance, totalFare } = location.state || {};
  if (!cab)
    return <p className="mt-24 text-center text-gray-500">No cab selected.</p>;

  const handlePayment = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/payment/orders",
        {
          amount: totalFare,
          currency: "INR",
          notes: { cab: cab.name, pickup, drop },
        }
      );

      if (!window.Razorpay) return alert("Razorpay SDK not loaded");

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Trip Mittar - Cab Booking",
        description: `Cab: ${cab.name} | Distance: ${distance.toFixed(1)} km`,
        order_id: data.order.id,
        handler: async (response) => {
          const verifyRes = await axios.post(
            "http://localhost:5000/api/payment/verify",
            response
          );
          if (verifyRes.data.success) {
            alert("✅ Cab Payment Successful!");
            navigate("/my-bookings");
          } else {
            alert("❌ Payment verification failed");
          }
        },
        prefill: {
          name: user?.fullname || "Guest",
          email: user?.email || "guest@example.com",
          contact: user?.contact || "9999999999",
        },
        theme: { color: "#2563eb" },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error("❌ Cab payment error:", err);
      alert("Payment failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">
          🚖 Cab Payment
        </h2>

        <div className="flex flex-col gap-3 mb-6 text-gray-700 dark:text-gray-300">
          <p>
            <span className="font-semibold">Cab:</span>{" "}
            <span className="text-blue-600 dark:text-blue-400">{cab.name}</span>
          </p>
          <p>
            <span className="font-semibold">Distance:</span> {distance.toFixed(1)} km
          </p>
          <p className="font-semibold text-orange-600 text-lg mt-2">
            💰 Total Fare: ₹{totalFare}
          </p>
        </div>

        <button
          onClick={handlePayment}
          className="w-full py-3 rounded-xl bg-blue-600 text-white font-medium shadow-lg
                     hover:bg-blue-700 hover:scale-105 transition transform active:scale-95"
        >
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default PaymentCab;
