import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import { initDB } from "./config/db.js";

// Routes
import authRoutes from "./routes/auth.js";
import busRoutes from "./routes/buses.js";
import trainRoutes from "./routes/trains.js";
import hotelRoutes from "./routes/hotels.js";
import bookingsRoutes from "./routes/bookings.js";
import paymentRoutes from "./routes/payment.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/* ================= RAZORPAY ================= */
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

/* ================= CORS ================= */
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:4000", "http://localhost:3000", "http://localhost:4173"];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

/* ================= MIDDLEWARE ================= */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* ================= ROUTES ================= */
app.use("/api/auth", authRoutes);
app.use("/api/buses", busRoutes);
app.use("/api/trains", trainRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/hotel-booking", bookingsRoutes);

// Fix: Ensure paymentRoutes is correctly initialized as a middleware function
if (typeof paymentRoutes === 'function') {
    app.use("/api/payment", paymentRoutes(razorpay));
} else {
    console.warn("⚠️ paymentRoutes is not a function. Check your export in payment.js");
}

/* ================= STARTUP ================= */
const startServer = async () => {
  try {
    await initDB();
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Startup Error:", error.message);
    process.exit(1);
  }
};

startServer();
