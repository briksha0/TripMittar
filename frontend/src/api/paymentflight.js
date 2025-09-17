// src/api/paymentflight.js
import axios from "axios";

const API_BASE = "http://localhost:5000/api/payment"; // 👈 FIXED path

// 🔹 Create Razorpay Order
export const createOrder = async (amount, userId, flightId) => {
  const { data } = await axios.post(`${API_BASE}/orders`, {
    amount,   // INR (backend multiplies by 100)
    userId,
    flightId,
  });
  return data; // { id, amount, currency }
};

// 🔹 Verify Razorpay Payment
export const verifyPayment = async (paymentData) => {
  const { data } = await axios.post(`${API_BASE}/verify`, paymentData);
  return data; // { success: true | false }
};
