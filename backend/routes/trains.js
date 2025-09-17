// routes/trains.js
import express from "express";
import { randomBytes } from "crypto";

const router = express.Router();

/**
 * Mock train data generator
 * In production you'd query a real DB or third-party API
 */
const mockTrains = (from, to, date) => {
  // small deterministic-ish list for demo
  return [
    {
      id: `T-${from}-${to}-1`,
      number: "12345",
      name: `${from} Express`,
      departure: "09:00",
      arrival: "15:30",
      duration: "6h 30m",
      classes: ["SL", "3A", "2A"],
      price: 550,
    },
    {
      id: `T-${from}-${to}-2`,
      number: "54321",
      name: `${to} Intercity`,
      departure: "14:00",
      arrival: "20:00",
      duration: "6h 0m",
      classes: ["SL", "3A"],
      price: 450,
    },
  ];
};

// GET /api/trains/search?from=...&to=...&date=...
router.get("/search", (req, res) => {
  const { from, to, date } = req.query;
  if (!from || !to || !date) {
    return res.status(400).json({ message: "from, to and date required" });
  }
  // For demo we return mock trains (you can replace with DB logic)
  const trains = mockTrains(from, to, date);
  res.json({ trains });
});

// POST /api/trains/book
// expects: { trainId, trainName, price, from, to, date, passenger }
router.post("/book", async (req, res) => {
  try {
    const { trainId, trainName, price, from, to, date, passenger } = req.body;
    if (!trainId || !price || !from || !to || !date) {
      return res.status(400).json({ message: "missing booking fields" });
    }

    // Generate a simple PNR: 10 chars
    const pnr = randomBytes(5).toString("hex").toUpperCase();

    // You should save booking to DB here. For demo we just return booking.
    const booking = {
      id: `${Date.now()}`,
      pnr,
      trainId,
      trainName,
      price,
      from,
      to,
      date,
      passenger,
      status: "CONFIRMED",
      createdAt: new Date(),
    };

    // If you want, persist booking into MySQL using the db connection you already have in server.js
    // Example (uncomment and adapt if you have `db` exported/available):
    // await db.execute("INSERT INTO bookings (pnr, trainId, ...) VALUES (?, ...)", [pnr, trainId, ...]);

    res.json({ booking });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ message: "Booking failed" });
  }
});

export default router;
