import express from "express";
import { getDB } from "../config/db.js"; // ✅ Use getDB for existing connection

const router = express.Router();

/**
 * @route   GET /api/hotels
 * @desc    Search hotels by city
 */
router.get("/", async (req, res) => {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ message: "⚠️ City parameter is required" });
  }

  try {
    const db = getDB(); // ✅ Correct way to get the active pool

    // PostgreSQL Syntax:
    // 1. Use .query() instead of .execute()
    // 2. Use $1 instead of ?
    // 3. ILIKE is built-in for case-insensitive matching in Postgres
    const result = await db.query(
      `SELECT id, name, city, address, price_per_night, rating, image_url 
       FROM hotels 
       WHERE city ILIKE $1`,
      [`%${city}%`]
    );

    res.json({ 
      success: true,
      hotels: result.rows // PostgreSQL returns data in the .rows array
    });
  } catch (err) {
    console.error("❌ Hotel fetch error:", err.message);
    res.status(500).json({ message: "❌ Failed to fetch hotels" });
  }
});

/**
 * @route   GET /api/hotels/:id
 * @desc    Get single hotel details
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const db = getDB();
    const result = await db.query("SELECT * FROM hotels WHERE id = $1", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Hotel detail error:", err.message);
    res.status(500).json({ message: "Error fetching hotel details" });
  }
});

export default router;