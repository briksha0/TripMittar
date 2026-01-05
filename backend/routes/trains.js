import express from "express";
import crypto from "crypto";
import { getDB } from "../config/db.js";
import { authMiddleware } from "./auth.js"; // Protect the booking route

const router = express.Router();

/* ================= 1. SEARCH TRAINS ================= */
router.get("/search", async (req, res) => {
  const { from, to, date } = req.query;

  if (!from || !to || !date) {
    return res.status(400).json({ message: "⚠️ 'from', 'to', and 'date' are required" });
  }

  try {
    const db = getDB();
    
    // Search using ILIKE for case-insensitive city matching
    const result = await db.query(
      `SELECT * FROM trains 
       WHERE from_station ILIKE $1 
       AND to_station ILIKE $2`,
      [`%${from}%`, `%${to}%`]
    );

    res.json({ 
      success: true,
      trains: result.rows 
    });
  } catch (err) {
    console.error("❌ Train search error:", err.message);
    res.status(500).json({ message: "Failed to fetch trains" });
  }
});

/* ================= 2. BOOK TRAIN (Authenticated) ================= */
router.post("/book", authMiddleware, async (req, res) => {
  try {
    const db = getDB();
    const { train_id, price, from_station, to_station, travel_date, passenger_name } = req.body;
    const user_id = req.user.id; // From authMiddleware

    if (!train_id || !price || !travel_date) {
      return res.status(400).json({ message: "⚠️ Missing required booking fields" });
    }

    // Generate a secure 10-character PNR
    const pnr = crypto.randomBytes(5).toString("hex").toUpperCase();

    // Insert booking into the database
    const result = await db.query(
      `INSERT INTO train_bookings 
       (user_id, train_id, pnr, from_station, to_station, travel_date, passenger_name, price, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'CONFIRMED') 
       RETURNING *`,
      [user_id, train_id, pnr, from_station, to_station, travel_date, passenger_name, price]
    );

    res.status(201).json({ 
      success: true,
      message: "✅ Train booked successfully",
      booking: result.rows[0]
    });
  } catch (err) {
    console.error("❌ Train booking error:", err.message);
    res.status(500).json({ message: "Booking failed. Please try again." });
  }
});

/* ================= 3. GET TRAIN DETAILS ================= */
router.get("/details/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const db = getDB();
    const result = await db.query("SELECT * FROM trains WHERE id = $1", [id]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Train not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Error fetching train details" });
  }
});

export default router;