import React from "react";
import { useLocation } from "react-router-dom";

const ConfirmationPage = () => {
  const location = useLocation();
  const { cab, pickup, drop, paymentId } = location.state || {};

  return (
    <div className="mt-14 flex flex-col items-center justify-center min-h-screen bg-green-50 p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-lg w-full text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">✅ Booking Confirmed!</h1>
        <p className="mb-2"><strong>Cab:</strong> {cab?.name}</p>
        <p className="mb-2"><strong>Pickup:</strong> {pickup?.formatted_address}</p>
        <p className="mb-2"><strong>Drop:</strong> {drop?.formatted_address}</p>
        <p className="mt-4 text-gray-700"><strong>Payment ID:</strong> {paymentId}</p>
      </div>
    </div>
  );
};

export default ConfirmationPage;
