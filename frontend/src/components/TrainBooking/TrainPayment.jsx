// frontend/src/components/TrainBooking/TrainPayment.jsx
import React from "react";
import PaymentButton from "../PaymentButton";

const TrainPayment = ({ bookingId, price }) => {
  return (
    <div className="pt-24 text-center">
      <h2 className="text-2xl font-bold mb-4">🚆 Train Payment</h2>
      <PaymentButton amount={price} service="train" bookingId={bookingId} />
    </div>
  );
};

export default TrainPayment;
