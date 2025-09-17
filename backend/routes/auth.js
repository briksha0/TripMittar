// backend/routes/auth.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { initDB } from "../config/db.js";

const router = express.Router();

// 🔹 Middleware to protect routes
export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "⚠️ Unauthorized: No token" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user info
    next();
  } catch (err) {
    return res.status(401).json({ message: "❌ Invalid or expired token" });
  }
};

// 🔹 Sign up
router.post("/signup", async (req, res) => {
  try {
    const db = await initDB();
    const { fullname, username, password } = req.body;

    if (!fullname || !username || !password) {
      return res.status(400).json({ message: "⚠️ All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute(
      "INSERT INTO users (fullname, username, password) VALUES (?, ?, ?)",
      [fullname, username, hashedPassword]
    );

    res.json({ message: "✅ User registered successfully" });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ message: "❌ Signup failed" });
  }
});

// 🔹 Sign in
router.post("/signin", async (req, res) => {
  try {
    const db = await initDB();
    const { username, password } = req.body;

    const [users] = await db.execute("SELECT * FROM users WHERE username = ?", [username]);

    if (users.length === 0) {
      return res.status(401).json({ message: "❌ Invalid username or password" });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "❌ Invalid username or password" });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ message: "✅ Login successful", token, user });
  } catch (err) {
    console.error("Signin error:", err.message);
    res.status(500).json({ message: "❌ Signin failed" });
  }
});

export default router;
