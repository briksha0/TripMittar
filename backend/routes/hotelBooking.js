// backend/routes/hotelBooking.js
import express from "express";
import initDB from "../config/db.js";
import { authMiddleware } from "./auth.js";

const router = express.Router();

// POST /api/hotel-booking/calculate
router.post("/calculate", authMiddleware, async (req, res) => {
  try {
    const { hotelId, checkin, checkout, guests } = req.body;
    if (!hotelId || !checkin || !checkout || !guests) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const db = await initDB();

    // Get hotel price per night from DB
    const [rows] = await db.execute(
      "SELECT price_per_night FROM hotels WHERE id=?",
      [hotelId]
    );

    if (!rows.length) return res.status(404).json({ message: "Hotel not found" });

    const pricePerNight = rows[0].price_per_night;

    const nights = Math.max(
      1,
      (new Date(checkout) - new Date(checkin)) / (1000 * 60 * 60 * 24)
    );

    const totalPrice = pricePerNight * nights * guests;

    res.json({ totalPrice });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to calculate price" });
  }
});

export default router;
