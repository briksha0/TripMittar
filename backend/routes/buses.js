// routes/buses.js
import express from "express";
import { initDB } from "../config/db.js";  // ✅ use named import

const router = express.Router();

// 🔹 GET /api/buses/search
router.get("/search", async (req, res) => {
  const { from, to, date } = req.query;
  if (!from || !to || !date) {
    return res.status(400).json({ message: "⚠️ from, to, and date are required" });
  }

  try {
    const db = await initDB(); // get DB connection
    const [rows] = await db.execute(
      "SELECT * FROM buses WHERE from_city LIKE ? AND to_city LIKE ?",
      [`%${from}%`, `%${to}%`]
    );

    res.json({ buses: rows });
  } catch (err) {
    console.error("❌ Bus search error:", err.message);
    res.status(500).json({ message: "Failed to fetch buses" });
  }
});

// 🔹 GET /api/buses/:busId/stops
router.get("/:busId/stops", async (req, res) => {
  try {
    const db = await initDB(); // get DB connection
    const [rows] = await db.execute(
      "SELECT * FROM bus_stops WHERE bus_id=? ORDER BY arrival ASC",
      [req.params.busId]
    );
    res.json({ stops: rows });
  } catch (err) {
    console.error("❌ Stops fetch error:", err.message);
    res.status(500).json({ message: "Failed to fetch stops" });
  }
});

export default router;
