// backend/routes/hotels.js
import express from "express";
import { initDB } from "../config/db.js"; // ✅ use named import

const router = express.Router();

// GET /api/hotels?city=...
router.get("/", async (req, res) => {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ message: "⚠️ City is required" });
  }

  try {
    const db = await initDB(); // ✅ get DB connection

    const [rows] = await db.execute(
      "SELECT id, name, city, address, price_per_night, rating, image_url FROM hotels WHERE LOWER(city) LIKE LOWER(?)",
      [`%${city}%`]
    );

    res.json({ hotels: rows });
  } catch (err) {
    console.error("❌ Hotel fetch error:", err.message);
    res.status(500).json({ message: "❌ Failed to fetch hotels" });
  }
});

export default router;
