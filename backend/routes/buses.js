import express from "express";
import { getDB } from "../config/db.js"; // Using getDB is faster than initDB

const router = express.Router();

/**
 * @route   GET /api/buses/search
 * @desc    Search buses by from, to city
 */
router.get("/search", async (req, res) => {
  const { from, to, date } = req.query;

  if (!from || !to || !date) {
    return res.status(400).json({ 
      message: "⚠️ 'from', 'to', and 'date' query parameters are required" 
    });
  }

  try {
    const db = getDB(); 
    
    // PostgreSQL uses $1, $2 for parameters and .query() instead of .execute()
    const result = await db.query(
      `SELECT * FROM buses 
       WHERE from_city ILIKE $1 
       AND to_city ILIKE $2`,
      [`%${from}%`, `%${to}%`]
    );

    res.json({ 
      success: true,
      count: result.rowCount,
      buses: result.rows 
    });
  } catch (err) {
    console.error("❌ Bus search error:", err.message);
    res.status(500).json({ message: "Internal server error while searching buses" });
  }
});

/**
 * @route   GET /api/buses/:busId/stops
 * @desc    Get all stops for a specific bus
 */
router.get("/:busId/stops", async (req, res) => {
  const { busId } = req.params;

  // Basic validation to ensure busId is a number
  if (isNaN(busId)) {
    return res.status(400).json({ message: "❌ Invalid Bus ID" });
  }

  try {
    const db = getDB();
    
    const result = await db.query(
      "SELECT * FROM bus_stops WHERE bus_id = $1 ORDER BY arrival ASC",
      [busId]
    );

    res.json({ 
      success: true,
      stops: result.rows 
    });
  } catch (err) {
    console.error("❌ Stops fetch error:", err.message);
    res.status(500).json({ message: "Failed to fetch bus route stops" });
  }
});

export default router;