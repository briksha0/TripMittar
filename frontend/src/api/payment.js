// frontend/src/api/payment.js
import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api/payment" });

// Create Razorpay order
export const createOrder = async (amount, notes = {}) => {
  const { data } = await API.post("/orders", { amount, notes });
  return data;
};

// Verify Razorpay payment
export const verifyPayment = async (paymentData) => {
  const { data } = await API.post("/verify", paymentData);
  return data;
};
