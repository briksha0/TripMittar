import express from "express";
import { initDB } from "../config/db.js";
import { authMiddleware } from "./auth.js";  // ✅ works now

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const db = await initDB();
    const userId = req.user.id;

    // Example: fetch hotel bookings
    const [hotelBookings] = await db.execute(
      `SELECT hb.id, 'hotel' AS type, h.name, h.city, hb.checkin, hb.checkout, hb.total_price, hb.status
       FROM hotel_bookings hb
       JOIN hotels h ON hb.hotel_id = h.id
       WHERE hb.user_id = ?`,
      [userId]
    );

    res.json({ bookings: hotelBookings });
  } catch (err) {
    console.error("Fetch bookings error:", err.message);
    res.status(500).json({ message: "❌ Failed to fetch bookings" });
  }
});

export default router;
