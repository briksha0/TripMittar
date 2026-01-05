import express from "express";
import { getDB } from "../config/db.js"; // Use getDB if initDB only initializes
import { authMiddleware } from "./auth.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const db = getDB();
    const userId = req.user.id;

    // We run all queries in parallel for maximum speed
    const [hotelRows, busRows, cabRows] = await Promise.all([
      // 1. Fetch Hotel Bookings
      db.query(
        `SELECT hb.id, 'hotel' AS type, h.name, h.city, hb.checkin, hb.checkout, hb.total_price, hb.status
         FROM hotel_bookings hb
         JOIN hotels h ON hb.hotel_id = h.id
         WHERE hb.user_id = $1 ORDER BY hb.created_at DESC`,
        [userId]
      ),
      // 2. Fetch Bus Bookings
      db.query(
        `SELECT b.id, 'bus' AS type, bus_list.name, b.travel_date AS date, b.boarding_point AS pickup, 
         bus_list.to_city AS drop, b.amount AS price, b.status
         FROM bookings b
         JOIN buses bus_list ON b.service_id = bus_list.id
         WHERE b.user_id = $1 AND b.service_type = 'bus' ORDER BY b.created_at DESC`,
        [userId]
      ),
      // 3. Fetch Cab Bookings (if you have a cabs table)
      db.query(
        `SELECT id, 'cab' AS type, pickup, "drop", travel_date AS date, amount AS fare, status
         FROM cab_bookings
         WHERE user_id = $1 ORDER BY created_at DESC`,
        [userId]
      ).catch(() => ({ rows: [] })) // Fallback if cab table isn't created yet
    ]);

    // Send unified data to the frontend
    res.json({
      hotels: hotelRows.rows,
      buses: busRows.rows,
      cabs: cabRows.rows
    });

  } catch (err) {
    console.error("❌ Fetch bookings error:", err.message);
    res.status(500).json({ message: "Failed to fetch your travel history" });
  }
});

export default router;