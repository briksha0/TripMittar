import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import Razorpay from "razorpay";
import path from "path";

import { initDB } from "./config/db.js";  // <-- import DB init function

import paymentRoutes from "./routes/payment.js";
import busRoutes from "./routes/buses.js";
import authRoutes from "./routes/auth.js";
import hotelRoutes from "./routes/hotels.js";
import bookingsRoutes from "./routes/bookings.js";
import trainRoutes from "./routes/trains.js";

dotenv.config();

const _dirname = path.resolve();
const app = express();
const port = process.env.PORT || 5000;

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Allowed origins for CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map(o => o.trim())
  : ["http://localhost:4000"];

// CORS middleware
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`❌ CORS blocked request from: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Middleware for JSON body parsing
app.use(express.json());
app.use(bodyParser.json());

// API Routes
app.use("/api/buses", busRoutes);
app.use("/api/trains", trainRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/hotel-booking", bookingsRoutes);
app.use("/api/payment", paymentRoutes(razorpay));

// Serve frontend static files
app.use(express.static(path.join(_dirname, "/frontend/dist")));

// Catch-all route for SPA - serve index.html for all other GET requests
app.get('*', (req, res) => {
  res.sendFile(path.join(_dirname, "/frontend", "dist", "index.html"));
});

// Initialize database and then start server
initDB()
  .then(() => {
    app.listen(port, "0.0.0.0", () => {
      console.log(`🚀 Server running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to initialize database:", err);
    process.exit(1);
  });
