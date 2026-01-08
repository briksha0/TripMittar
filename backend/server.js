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
  key_id: process.env.RAZORPAY_KEY_ID || "YOUR_KEY_ID_PLACEHOLDER",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "YOUR_KEY_SECRET_PLACEHOLDER",
});

/* ================= CORS (UPDATED) ================= */
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [
      "http://localhost:5173", 
      "http://localhost:3000", 
      "http://localhost:4173"
    ];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // LOGGING: This helps you see exactly why the frontend is failing
      console.error(`❌ CORS Blocked Origin: ${origin}`);
      callback(new Error(`Not allowed by CORS. Origin: ${origin}`));
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
// 1. Health Check Route (Open your Render URL in browser to test this)
app.get("/", (req, res) => {
  res.status(200).json({ 
    status: "success", 
    message: "TripMittar Backend is Live! 🚀" 
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/buses", busRoutes);
app.use("/api/trains", trainRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/hotel-booking", bookingsRoutes);

// Fix: Robust check for payment routes
if (typeof paymentRoutes === 'function') {
    // If it expects the razorpay instance (Dependency Injection)
    app.use("/api/payment", paymentRoutes(razorpay));
} else {
    // Fallback: If it's a standard Router object
    console.warn("⚠️ paymentRoutes is not a function. Attempting to use as standard router.");
    app.use("/api/payment", paymentRoutes);
}

/* ================= STARTUP ================= */
const startServer = async () => {
  try {
    await initDB();
    // Use 0.0.0.0 for Render compatibility
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on Port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Startup Error:", error.message);
    process.exit(1);
  }
};

startServer();
