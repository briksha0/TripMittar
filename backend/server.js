import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import Razorpay from "razorpay";
import path from "path";
import { fileURLToPath } from "url";

import paymentRoutes from "./routes/payment.js";
import busRoutes from "./routes/buses.js";
import authRoutes from "./routes/auth.js";
import hotelRoutes from "./routes/hotels.js";
import bookingsRoutes from "./routes/bookings.js";
import trainRoutes from "./routes/trains.js";

import { initDB } from "./config/db.js";

dotenv.config();

// ✅ Setup __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Initialize express app
const app = express();
const port = process.env.PORT || 4000;

// ✅ Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Parse allowed origins from env
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map(origin => origin.trim())
  : [];
console.log("✅ Allowed origins:", allowedOrigins);
// ✅ CORS middleware
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

// ✅ Middleware
app.use(express.json());
app.use(bodyParser.json());

// ✅ Initialize Database

// ✅ API Routes
app.use("/api/buses", busRoutes);
app.use("/api/trains", trainRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/hotel-booking", bookingsRoutes);
app.use("/api/payment", paymentRoutes(razorpay));

// ✅ Serve frontend static files
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// ✅ Catch-all fallback for SPA routes
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// ✅ Start server
app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
