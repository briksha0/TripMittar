// src/api/bookings.js
import axios from "axios";

export const fetchBookings = async (token) => {
  try {
    const res = await axios.get("http://localhost:5000/api/hotel-booking", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.bookings;
  } catch (err) {
    console.error("❌ Failed to fetch bookings:", err);
    throw err;
  }
};
