import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getDB } from "../config/db.js"; // Use getDB instead of initDB for active routes

const router = express.Router();

/* ================= AUTH MIDDLEWARE ================= */
export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "⚠️ Unauthorized: No token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "❌ Invalid or expired token" });
  }
};

/* ================= SIGNUP ================= */
router.post("/signup", async (req, res) => {
  try {
    const db = getDB();
    const { fullname, username, email, password } = req.body;

    if (!fullname || !username || !password) {
      return res.status(400).json({ message: "⚠️ All fields are required" });
    }

    // 1. Check if user already exists (Username or Email)
    const existingUser = await db.query(
      "SELECT id FROM users WHERE username = $1 OR email = $2",
      [username, email]
    );

    if (existingUser.rowCount > 0) {
      return res.status(400).json({ message: "❌ Username or Email already taken" });
    }

    // 2. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Insert User
    const result = await db.query(
      `INSERT INTO users (fullname, username, email, password)
       VALUES ($1, $2, $3, $4) RETURNING id, fullname, username, email`,
      [fullname, username, email || null, hashedPassword]
    );

    res.status(201).json({ 
      message: "✅ User registered successfully", 
      user: result.rows[0] 
    });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ message: "❌ Signup failed" });
  }
});

/* ================= SIGNIN ================= */
router.post("/signin", async (req, res) => {
  try {
    const db = getDB();
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "⚠️ Please provide credentials" });
    }

    // Search by username OR email to be flexible
    const result = await db.query(
      "SELECT * FROM users WHERE username = $1 OR email = $1",
      [username]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ message: "❌ Invalid credentials" });
    }

    const user = result.rows[0];

    // Verify Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "❌ Invalid credentials" });
    }

    // Create Token
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        fullname: user.fullname,
        email: user.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // Increased to 7 days for better UX
    );

    // Clean up sensitive data before sending back
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: "✅ Login successful",
      token,
      user: userWithoutPassword,
    });
  } catch (err) {
    console.error("Signin error:", err.message);
    res.status(500).json({ message: "❌ Signin failed" });
  }
});

export default router;